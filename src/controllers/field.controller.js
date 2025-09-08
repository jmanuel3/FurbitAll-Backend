const Field = require("../models/Field");

const createField = async (req, res, next) => {
  try {
    const { name = "", location = "", image = "", available } = req.body;

    if (!name.trim())
      return res.status(400).json({ message: "El nombre es obligatorio" });
    if (!location.trim())
      return res.status(400).json({ message: "La ubicación es obligatoria" });

    const newField = await Field.create({
      name: name.trim(),
      location: location.trim(),
      image: image?.trim() || "",
      available: typeof available === "boolean" ? available : true,
    });

    return res.status(201).json(newField);
  } catch (error) {
    next(error);
  }
};

const getAllFields = async (req, res, next) => {
  try {
    const fields = await Field.find();
    return res.json(fields);
  } catch (error) {
    next(error);
  }
};

const getFieldById = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      const err = new Error("Cancha no encontrada");
      err.status = 404;
      return next(err);
    }
    return res.json(field);
  } catch (error) {
    next(error);
  }
};

const updateField = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res
        .status(400)
        .json({ message: "ID inválido para actualizar cancha" });
    }

    const updates = { ...req.body };
    if (typeof updates.name === "string") updates.name = updates.name.trim();
    if (typeof updates.location === "string")
      updates.location = updates.location.trim();
    if (typeof updates.image === "string") updates.image = updates.image.trim();

    const updated = await Field.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      const err = new Error("Cancha no encontrada");
      err.status = 404;
      return next(err);
    }
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteField = async (req, res, next) => {
  try {
    const deleted = await Field.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const err = new Error("Cancha no encontrada");
      err.status = 404;
      return next(err);
    }
    return res.json({ message: "Cancha eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
};
