import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    eMail: String,
    unionName: String,
    localName: String,
    title: String
  },
  {timestamps: true}
)

export default mongoose.model('Users', userSchema);