const mongoose = require("mongoose");
const Product = require("../models/Product");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return res
        .status(400)
        .json({ message: "El precio debe ser un número >= 0" });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: (description || "").trim(),
      price: numPrice,
      image: (image || "").trim(),
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const product = await Product.findById(id);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      return next(err);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updates = { ...req.body };
    if (typeof updates.name === "string" && updates.name.trim() === "") {
      return res
        .status(400)
        .json({ message: "El nombre no puede estar vacío" });
    }
    if (updates.price !== undefined) {
      const numPrice = Number(updates.price);
      if (Number.isNaN(numPrice) || numPrice < 0) {
        return res
          .status(400)
          .json({ message: "El precio debe ser un número >= 0" });
      }
      updates.price = numPrice;
    }
    if (typeof updates.description === "string")
      updates.description = updates.description.trim();
    if (typeof updates.image === "string") updates.image = updates.image.trim();

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      return next(err);
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      return next(err);
    }

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

const decrementStockBulk = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const items = req.body?.items;
   
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "items debe ser un array no vacío" });
    }

    for (const it of items) {
      if (!it?.productId || !mongoose.Types.ObjectId.isValid(it.productId)) {
        return res.status(400).json({ message: "productId inválido" });
      }
      const q = Number(it.qty);
      if (!Number.isFinite(q) || q <= 0) {
        return res.status(400).json({ message: "qty debe ser > 0" });
      }
    }

    await session.withTransaction(async () => {
      
      const ids = items.map((i) => i.productId);
      const products = await Product.find({ _id: { $in: ids } }).session(
        session
      );

      const map = new Map(products.map((p) => [String(p._id), p]));

      
      for (const { productId, qty } of items) {
        const p = map.get(String(productId));
        if (!p) {
          throw Object.assign(
            new Error(`Producto ${productId} no encontrado`),
            { status: 404 }
          );
        }
        const current = Number(p.stock || 0);
        if (current < qty) {
          throw Object.assign(
            new Error(
              `Stock insuficiente para ${p.name} (disponible: ${current}, pedido: ${qty})`
            ),
            { status: 409 }
          );
        }
      }

      for (const { productId, qty } of items) {
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: -qty } },
          { session }
        );
      }
    });

    const updated = await Product.find({
      _id: { $in: req.body.items.map((i) => i.productId) },
    }).select("_id name stock");

    return res.json({ ok: true, updated });
  } catch (err) {
    if (err?.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  decrementStockBulk, 
};
