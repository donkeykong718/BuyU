import Product from "../models/Product.js";
import { isValidObjectId } from "mongoose";
import { MultiFormatReader, BarcodeFormat } from "@zxing/library";

export const getProducts = async (request, response) => {
  try {
    const product = await Product.find();
    response.json(product);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const searchProducts = async (request, response) => {
  try {
    const searchTerm = request.params.search;

    if (isNaN(searchTerm) === false) {
      const product = await Product.find({ UPC: searchTerm });
      response.json(product);
    } else {
      const product = await searchFor(searchTerm);
      response.json(product);
    }

    async function searchFor(searchTerm) {
      if (isValidObjectId(searchTerm) === true) {
        const product = await Product.find({ _id: searchTerm });
        return product;
      } else if (searchTerm === "true" || searchTerm === "false") {
        const product = await Product.find({ isUnion: searchTerm });
        return product;
      } else {
        const product = await Product.find({
          $or: [
            { productName: { $regex: searchTerm, $options: "i" } },
            { manufacturer: { $regex: searchTerm, $options: "i" } },
            { unionName: { $regex: searchTerm, $options: "i" } },
          ],
        });
        // console.log(`${searchTerm} belongs to product: ${product}`);
        return product;
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const createProduct = async (request, response) => {
  try {
    const { UPC, productName, manufacturer, isUnion, unionName, createdBy } =
      request.body;

    const newProduct = await Product.create({
      UPC: UPC,
      productName: productName,
      manufacturer: manufacturer,
      isUnion: isUnion,
      unionName: unionName,
      createdBy: createdBy,
    });
    response.json(newProduct);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const updateProduct = async (request, response) => {
  try {
    const searchID = request.params.id;

    let { productName, manufacturer, isUnion, unionName, updatedBy } =
      request.body;

    // if (isUnion == false) { unionName = "" };

    const updateDetails = {
      productName,
      manufacturer,
      isUnion,
      unionName,
      updatedBy,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: searchID },
      updateDetails
    );

    response.json(updatedProduct);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const deleteProduct = async (request, response) => {
  try {
    const objID = request.params.id;
    // console.log(`The object to delete is ${objID}`);
    const deletedProduct = await Product.findByIdAndDelete({ _id: objID });
    response.json(deletedProduct);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};
