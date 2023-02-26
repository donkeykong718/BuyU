import Unions from "../models/Unions.js"
import { isValidObjectId } from "mongoose";

// {
//   unionName: {
//     properName: String,
//     nickName: String,
//   },
// 
// },
// {timestamps: true}
// )

export const getUnions = async (request, response) => {
  try {
    const union = await Unions.find();
    response.json(union);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const searchUnions = async (request, response) => {
  try {
    const searchTerm = request.params.search;

    if (isNaN(searchTerm) === false) {
      const union = await Unions.find({ $or:[{ phone: { details: searchTerm } },{ faxLOL: { details: searchTerm } } ]});
      response.json(union);
    }
    else {
      const union = await searchFor(searchTerm);
      response.json(union)
    };

    async function searchFor(searchTerm) {

      if (isValidObjectId(searchTerm) === true) {
        const union = await Unions
      .find({ _id: searchTerm });
        return union;
      }
      else if (searchTerm === "true" || searchTerm === "false") {
        const union = await Unions
          .find({ $or: [{ phone: { isTrue: searchTerm } },{ eMail: { isTrue: searchTerm } },{ faxLOL: { isTrue: searchTerm } },{ address: { isTrue: searchTerm } }] });
        return union;
      }
      else {
        const union = await Unions
          .find({
            $or: [{ unionName: { properName: { $regex: searchTerm, $options: 'i' }}}, { unionName: { nickName: { $regex: searchTerm, $options: 'i' }}},{ industry: { $regex: searchTerm, $options: 'i' } }, { website: { $regex: searchTerm, $options: 'i' } }, { contactInfo: { eMail: { details: { $regex: searchTerm, $options: 'i' } } } }, { contactInfo: { address: { details: { $regex: searchTerm, $options: 'i' } } } }, { description: { $regex: searchTerm, $options: 'i' } }]
          });
        return union;
      }
    };
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const createUnion = async (request, response) => {
  try {
    const {
      unionName, locals, industry, website, contactInfo, description
    } = request.body;

    const newUnion = await Unions
  .create({
      unionName: unionName,
      locals: locals,
      industry: industry,
      website: website,
      contactInfo: contactInfo,
      description:description
    })
    response.json(newUnion);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const updateUnion = async (request, response) => {
  try {
    const searchID = request.params.id;

    let { unionName, locals, industry, website, contactInfo, description } = request.body;

    // if (isUnion == false) { unionName = "" };

    const updateDetails = { unionName, locals, industry, website, contactInfo, description  }

    const updatedUnion = await Unions
  .findByIdAndUpdate({ "_id": searchID }, updateDetails);

    response.json(updatedUnion);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const deleteUnion = async (request, response) => {
  try {
    const objID = request.params.id;
    // console.log(`The object to delete is ${objID}`);
    const deletedUnion = await Unions
  .findByIdAndDelete({ "_id": objID })
    response.json(deletedUnion);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

