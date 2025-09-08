const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" }, 
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
