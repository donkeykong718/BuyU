import mongoose from 'mongoose'
import Products from "../model.js"
import dummyData from "../dummy.json" assert {type: "json"};
import testData from "../test.json" assert {type: 'json'};

// Leave these 4 lines
//@ts-ignore
mongoose.connect(process.env.DATABASE_URL)
mongoose.set('strictQuery', false);
await seed()
await mongoose.disconnect()

async function seed() {
  // Seed the database here
  // Products.remove({});
  // Products.insertMany(dummyData);
  // Products.insertMany(testData);
}