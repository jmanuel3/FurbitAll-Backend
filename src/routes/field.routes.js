const express = require("express");
const router = express.Router();

const {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
} = require("../controllers/field.controller");

const verifyToken = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

router.get("/", getAllFields);
router.get("/:id", getFieldById);

router.post("/", verifyToken, checkAdmin, createField);
router.put("/:id", verifyToken, checkAdmin, updateField);
router.delete("/:id", verifyToken, checkAdmin, deleteField);

module.exports = router;
