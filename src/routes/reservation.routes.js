const express = require("express");
const router = express.Router();

const {
  cancelReservation,
  getAllReservations,
  createReservation,
  getUserReservations,
  updateReservation,
  getFieldReservationsByDate,
} = require("../controllers/reservation.controller");

const verifyToken = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/admin.middleware");

console.log("[ROUTE-LOAD] reservation.routes");


router.post("/", verifyToken, createReservation);

router.get("/mine", verifyToken, getUserReservations);

router.delete("/:id", verifyToken, cancelReservation);

router.put("/:id", verifyToken, checkAdmin, updateReservation);

router.get("/", verifyToken, checkAdmin, getAllReservations);

router.get("/availability", verifyToken, getFieldReservationsByDate);

module.exports = router;
