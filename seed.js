import mongoose from 'mongoose'
import Unions from "./models/Unions.js"
import unionData from "./unions.json" assert {type: "json"};

// Leave these 4 lines
//@ts-ignore
mongoose.connect("mongodb://localhost/buyU")
mongoose.set('strictQuery', false);
Unions.remove();
Unions.insertMany(unionData);

// async function seed() {
//   Unions.remove({});
//   Unions.insertMany(unionData);
// }