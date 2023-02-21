import Products from "./model.js"
import dummyData from "./dummy.json" assert {type: "json"};

Products.remove({});
Products.insertMany(dummyData);