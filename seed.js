import Products from "./model.js"
import dummyData from "./dummy.json" assert {type: "json"};
import testData from "./public/test.json" assert {type: 'json'};

Products.remove({});
Products.insertMany(dummyData);
Products.insertMany(testData);