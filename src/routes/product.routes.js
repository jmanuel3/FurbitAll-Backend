const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/Product");
const verifyToken = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const { name, price, description = "", image = "", stock } = req.body;

    if (!name || price === undefined || price === null) {
      return res
        .status(400)
        .json({ message: "Nombre y precio son obligatorios" });
    }
    const numPrice = Number(price);
    if (!Number.isFinite(numPrice) || numPrice < 0) {
      return res.status(400).json({ message: "Precio inválido" });
    }

    const payload = { name, price: numPrice, description, image };
    if (stock !== undefined) {
      const numStock = Number(stock);
      if (!Number.isFinite(numStock) || numStock < 0) {
        return res.status(400).json({ message: "Stock inválido" });
      }
      payload.stock = numStock;
    }

    const created = await Product.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});


router.put("/:id", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const update = {};
    if (req.body.name !== undefined) update.name = String(req.body.name);
    if (req.body.price !== undefined) {
      const numPrice = Number(req.body.price);
      if (!Number.isFinite(numPrice) || numPrice < 0) {
        return res.status(400).json({ message: "Precio inválido" });
      }
      update.price = numPrice;
    }
    if (req.body.description !== undefined)
      update.description = String(req.body.description);
    if (req.body.image !== undefined) update.image = String(req.body.image);
    if (req.body.stock !== undefined) {
      const numStock = Number(req.body.stock);
      if (!Number.isFinite(numStock) || numStock < 0) {
        return res.status(400).json({ message: "Stock inválido" });
      }
      update.stock = numStock;
    }

    const updated = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!updated)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

router.patch("/stock/bulk", verifyToken, async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "items debe ser un array no vacío" });
    }

    for (const it of items) {
      if (!it?.productId || !isValidId(it.productId)) {
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
          const e = new Error(`Producto ${productId} no encontrado`);
          e.status = 404;
          throw e;
        }
        const current = Number(p.stock || 0);
        if (current < qty) {
          const e = new Error(
            `Stock insuficiente para ${p.name} (disp: ${current}, pedido: ${qty})`
          );
          e.status = 409;
          throw e;
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
    })
      .select("_id name stock")
      .sort({ name: 1 });

    return res.json({ ok: true, updated });
  } catch (err) {
    if (err?.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  } finally {
    session.endSession();
  }
});

module.exports = router;
