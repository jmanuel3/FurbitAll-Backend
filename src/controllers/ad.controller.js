const Ad = require("../models/Ad");

exports.getAll = async (_req, res, next) => {
  try {
    const ads = await Ad.find({ active: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json(ads);
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmin = async (_req, res, next) => {
  try {
    const ads = await Ad.find().sort({ order: 1, createdAt: 1 });
    res.json(ads);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { image, alt, title, text, active, order } = req.body;
    if (!image) {
      return res
        .status(400)
        .json({ message: "El campo 'image' es obligatorio" });
    }
    const ad = await Ad.create({ image, alt, title, text, active, order });
    res.status(201).json(ad);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ad) return res.status(404).json({ message: "Anuncio no encontrado" });
    res.json(ad);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByIdAndDelete(id);
    if (!ad) return res.status(404).json({ message: "Anuncio no encontrado" });
    res.json({ message: "Anuncio eliminado" });
  } catch (err) {
    next(err);
  }
};
