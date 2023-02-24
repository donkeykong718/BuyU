// import mongoose from "./connection.js"
import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    UPC: Number,
    productName: String,
    manufacturer: String,
    isUnion: Boolean,
    unionName: String
  },
  {timestamps: true}
)

export default mongoose.model('Products', productSchema);