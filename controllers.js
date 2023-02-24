import Products from "./model.js"
import { isValidObjectId } from "mongoose";
import { MultiFormatReader, BarcodeFormat } from '@zxing/library';


export const getProducts = async (request, response) => {
  try {
    const product = await Products.find();
    response.json(product);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const searchProducts = async (request, response) => {
  try {
    const searchTerm = request.params.search;

    if (isNaN(searchTerm) === false) {
      const product = await Products.find({ UPC: searchTerm });
      response.json(product);
    }
    else {
      const product = await searchFor(searchTerm);
      response.json(product)
    };
    
    async function searchFor(searchTerm) {
      
      if (isValidObjectId(searchTerm) === true) {
        const product = await Products.find({ _id: searchTerm });
        return product;
      }  
      else if (searchTerm === "true" || searchTerm === "false") {
        const product = await Products.find({ isUnion: searchTerm });
        return product;
      }
      else {
        const product = await Products.find({ $or: [{ productName: { $regex: searchTerm, $options: 'i' } }, { manufacturer: { $regex: searchTerm, $options:'i'} }, { unionName: searchTerm }] });
        // console.log(`${searchTerm} belongs to product: ${product}`);
        return product;
      }
    };
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const createProduct = async (request, response) => {
  try {
    const { UPC, productName, manufacturer, isUnion, unionName } = request.body;

    // console.log(`The request body looks like:`)
    // console.log(request.body);

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

    // if (isUnion === false) { unionName = undefined };
  
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
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const updateProduct = async (request, response) => {
  try {
    const searchID = request.params.id;

    let { productName, manufacturer, isUnion, unionName } = request.body;

    // if (isUnion == false) { unionName = "" };

    const updateDetails = { productName, manufacturer, isUnion, unionName }

    const updatedProduct = await Products.findByIdAndUpdate({ "_id": searchID }, updateDetails);

    response.json(updatedProduct);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const deleteProduct = async (request, response) => {
  try {
    const objID = request.params.id;
    // console.log(`The object to delete is ${objID}`);
    const deletedProduct = await Products.findByIdAndDelete({ "_id": objID })
    response.json(deletedProduct);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const scanBarcode = async (request, response) => {
  try {
    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX/*, ...*/];
    
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    
    const reader = new MultiFormatReader();
    
    const luminanceSource = new RGBLuminanceSource(imgByteArray, imgWidth, imgHeight);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    
    reader.decode(binaryBitmap, hints);
  }
  catch (error) {
    console.error(error);
 }
}
