import "dotenv/config";
import mongoose from "mongoose";
import Unions from "./models/Union.js";
import unionData from "./unions.json" assert { type: "json" };

// Leave these 4 lines
//@ts-ignore
mongoose.connect(process.env.DATABASE_URL);
mongoose.set("strictQuery", false);
await seed();
await mongoose.disconnect();

async function seed() {
  await Unions.remove({});
  await Unions.insertMany(unionData);
}
