import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: String,
    hash: String,
    firstName: String,
    lastName: String,
    eMail: String,
    unionName: String,
    localName: String,
    title: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
