const { Schema, model } = require("mongoose");

const AdSchema = new Schema(
  {
    image: { type: String, required: true, trim: true }, 
    alt: { type: String, trim: true, default: "Publicidad" },
    title: { type: String, trim: true, default: "" },
    text: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("Ad", AdSchema);
