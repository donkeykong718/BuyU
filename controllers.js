import Products from "./model.js"
import { isValidObjectId } from "mongoose";

export const getProducts = async (request, response) => {
    const product = await Products.find();
    response.json(product);
};


export const searchProducts = async (request, response) => {
  try {
    const searchTerm = request.params.search;

    if (isValidObjectId(searchTerm) === true) {
      const product = await Products.find({ _id: searchTerm });
      response.json(product);
    }
    else {
      const product = await searchFor(searchTerm);
      response.json(product)
    };
    
    async function searchFor(searchTerm) {
      if (isNaN(searchTerm) === false) {
        const product = await Products.find({ UPC: searchTerm });
        return product;
      }
      else if (searchTerm === "true" || searchTerm === "false") {
        const product = await Products.find({ isUnion: searchTerm });
        return product;
      }
      else {
        const product = await Products.find({ $or: [{ productName: searchTerm }, { manufacturer: searchTerm }, { unionName: searchTerm }] });
        console.log(`${searchTerm} belongs to product: ${product}`);
        return product;
      }
    };
  }
  catch (error) {
    return null;
  }
}

export const createProduct = async (request, response) => {
  try {
    const { UPC, productName, manufacturer, isUnion, unionName } = request.body;

    console.log(`The request body looks like:`)
    console.log(request.body);

    // const newEntry = request.body;
    // console.log(newEntry);
    // Products.create(newEntry)
    //   .then(entry => {
    //     response.json(entry)
    //   });

    // console.log(`The UPC is ${UPC}`)
    // console.log(`The product is ${productName}`)
    // console.log(`It's made by ${manufacturer}`)
    // console.log(`It is union? ${isUnion}`);
    // console.log(`The union is ${unionName}`);
  
    const newProduct = await Products.create({
      UPC: UPC,
      productName: productName,
      manufacturer: manufacturer,
      isUnion: isUnion,
      unionName: unionName,
    })
    response.json(newProduct);
  }
  catch (error) {
    return null
  }
}

export const updateProduct = async (request, response) => {
  try {
    const searchID = request.params.id;

    const { productName, manufacturer, isUnion, unionName } = request.body;
    const updateDetails = { productName, manufacturer, isUnion, unionName }

    const updatedProduct = await Products.findByIdAndUpdate({ "_id": searchID }, updateDetails);

    response.json(updatedProduct);
  }
  catch (error) {
    return null
  }
}

export const deleteProduct = async (request, response) => {
  try {
    const objID = request.params.id;
    console.log(`The object to delete is ${objID}`);
    const deletedProduct = await Products.findByIdAndDelete({ "_id": objID })
    response.json(deletedProduct);
  }
  catch {
    return null
  }
}

