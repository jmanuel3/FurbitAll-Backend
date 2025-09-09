const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/ad.controller");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

console.log("[ROUTE-LOAD] ad.routes"); // cambia el nombre según el archivo

router.get("/", ctrl.getAll);

router.get("/admin", verifyToken, checkAdmin, ctrl.getAllAdmin);
router.post("/", verifyToken, checkAdmin, ctrl.create);
router.put("/:id", verifyToken, checkAdmin, ctrl.update);
router.delete("/:id", verifyToken, checkAdmin, ctrl.remove);

module.exports = router;
