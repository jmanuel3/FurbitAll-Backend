const { Schema, model, Types } = require("mongoose");

const reservationSchema = new Schema(
  {
    field: { type: Types.ObjectId, ref: "Field", required: true },
    
    date: { type: String, required: true },
    
    hour: { type: String, required: true },
    duration: { type: Number, enum: [30, 60], required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


reservationSchema.index({ field: 1, date: 1, hour: 1 }, { unique: true });

module.exports = model("Reservation", reservationSchema);
