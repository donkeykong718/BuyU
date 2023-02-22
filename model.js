import mongoose from "./connection.js"

const productSchema = new mongoose.Schema(
  {
    UPC: Number,
    productName: String,
    manufacturer: String,
    isUnion: Boolean,
    unionName: String
  }
)

export default mongoose.model('Products', productSchema);