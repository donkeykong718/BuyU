import Products from "./model.js"

export const getProducts = async (request, response) => {
  const product = await Products.find();
  response.json(product);
}

export const searchProducts = async (request, response) => {
  const UPC = request.params.upc;
  const product = await Products.find({ UPC: UPC });
  console.log(`UPC: ${UPC} belongs to product: ${ product }`);
  response.json(product);
}

export const createProduct = async (request, response) => {
  const { UPC, productName, manufacturer, isUnion, unionName } = request.body;

  console.log(`The UPC is ${UPC}`)
  console.log(`The product is ${productName}`)
  console.log(`It's made by ${manufacturer}`)
  console.log(`It is union? ${isUnion}`);
  console.log(`The union is ${unionName}`);
  
  const newProduct = await Products.create({
    UPC: UPC,
    productName: productName,
    manufacturer: manufacturer,
    isUnion: isUnion,
    unionName: unionName,
  })
  response.json(newProduct);
}

export const updateProduct = async (request, response) => {
  const UPC = request.params.upc;

  const { productName, manufacturer, isUnion, unionName } = request.body;
  const updateDetails = { productName, manufacturer, isUnion, unionName }

  const updatedProduct = await Products.findOneAndUpdate({ UPC: UPC }, updateDetails);

  response.json(updatedProduct);
}

export const deleteProduct = async (request, response) => {
  const UPC = request.params.upc;
  const deletedProduct = await Products.findOneAndDelete({ UPC: UPC })
  response.json(deletedProduct);
}

