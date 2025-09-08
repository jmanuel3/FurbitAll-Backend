const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const nextSlot = (hhmm) => {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  let H = h,
    M = m + 30;
  if (M >= 60) {
    M = 0;
    H += 1;
  }
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
};

const buildBlockedSet = (reservations) => {
  const blocked = new Set();
  for (const r of reservations) {
    blocked.add(r.hour); 
    if (Number(r.duration) === 60) {
      blocked.add(nextSlot(r.hour)); 
    }
  }
  return blocked;
};

const createReservation = async (req, res, next) => {
  try {
    const { field, date, hour, duration } = req.body;

    if (!field || !date || !hour) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }
    if (!isValidId(field)) {
      return res.status(400).json({ message: "ID de cancha inválido." });
    }
    if (![30, 60].includes(Number(duration))) {
      return res.status(400).json({ message: "Duración inválida" });
    }

    const parsedDate = new Date(`${date}T${hour}`);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Fecha u hora inválida." });
    }

    const now = new Date();
    if (parsedDate < now) {
      return res
        .status(400)
        .json({ message: "No se puede reservar para una fecha pasada." });
    }

    const sameFieldDay = await Reservation.find({ field, date });
    const blocked = buildBlockedSet(sameFieldDay);

    if (blocked.has(hour)) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }
    if (Number(duration) === 60 && blocked.has(nextSlot(hour))) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }

    const userAlreadyBooked = await Reservation.findOne({
      user: req.user.id,
      date,
      hour,
    });
    if (userAlreadyBooked) {
      return res
        .status(400)
        .json({ message: "Ya tienes una reserva para este horario." });
    }

    const sameDayReservations = await Reservation.countDocuments({
      user: req.user.id,
      date,
    });
    if (sameDayReservations >= 3) {
      return res
        .status(400)
        .json({ message: "Solo se permiten 3 reservas por día por usuario." });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      field,
      date,
      hour,
      duration: Number(duration),
    });

    return res.status(201).json(reservation);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }
    next(err);
  }
};

const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate(
      "field"
    );
    return res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate("field")
      .populate("user", "email");
    return res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const filter = { _id: id };
    if (req.user.role !== "admin") filter.user = req.user.id;

    const reservation = await Reservation.findOneAndDelete(filter);
    if (!reservation) {
      const e = new Error("Reserva no encontrada");
      e.status = 404;
      return next(e);
    }

    return res.json({ message: "Reserva cancelada correctamente" });
  } catch (err) {
    next(err);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { field, date, hour, duration } = req.body;

    if (
      !field ||
      !date ||
      !hour ||
      duration === undefined ||
      duration === null
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }
    if (!isValidId(field)) {
      return res.status(400).json({ message: "ID de cancha inválido." });
    }
    const allowedDurations = [30, 60];
    if (!allowedDurations.includes(Number(duration))) {
      return res.status(400).json({ message: "Duración inválida" });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      const e = new Error("Reserva no encontrada");
      e.status = 404;
      return next(e);
    }

    if (
      req.user.role !== "admin" &&
      req.user.id !== reservation.user.toString()
    ) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para editar esta reserva" });
    }

   
    const sameFieldDay = await Reservation.find({
      field,
      date,
      _id: { $ne: id },
    });
    const blocked = buildBlockedSet(sameFieldDay);

    if (blocked.has(hour)) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }
    if (Number(duration) === 60 && blocked.has(nextSlot(hour))) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }

    reservation.field = field;
    reservation.date = date;
    reservation.hour = hour;
    reservation.duration = Number(duration);

    await reservation.save(); 
    return res.json({
      message: "Reserva actualizada correctamente",
      reservation,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Ese turno ya está reservado." });
    }
    next(err);
  }
};

const getFieldReservationsByDate = async (req, res, next) => {
  try {
    const { field, date } = req.query;

    if (!field || !date) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

    const reservations = await Reservation.find({ field, date });
    const blocked = buildBlockedSet(reservations);

    return res.json({ reservedHours: Array.from(blocked).sort() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  cancelReservation,
  updateReservation,
  getFieldReservationsByDate,
};
