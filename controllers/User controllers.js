import Users from "../models/Users.js"
import { isValidObjectId } from "mongoose";

export const getUsers = async (request, response) => {
  try {
    const user = await Users.find();
    response.json(user);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const searchUsers = async (request, response) => {
  try {
    const searchTerm = request.params.search;
    const user = await searchFor(searchTerm);
    response.json(user);

    async function searchFor(searchTerm) {

      if (isValidObjectId(searchTerm) === true) {
        const user = await Users.find({ _id: searchTerm });
        return user;
      }
      else {
        const user = await Users.find({ $or: [{ userName: searchTerm}, { eMail: searchTerm }] });
   
        return user;
      }
    };
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const createUser = async (request, response) => {
  try {
    const { userName, password, firstName, lastName, eMail, unionName, localName, title } = request.body;

    const newUser = await Users.create({
      userName: userName,
      password: password,
      firstName: firstName,
      lastName: lastName,
      eMail: eMail,
      unionName: unionName,
      localName: localName,
      title: title
    })
    response.json(newUser);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const updateUser = async (request, response) => {
  try {
    const searchID = request.params.id;

    let { userName, password, firstName, lastName, eMail, unionName, localName, title } = request.body;

    const updateDetails = { userName, password, firstName, lastName, eMail, unionName, localName, title }

    const updatedUser = await Users.findByIdAndUpdate({ "_id": searchID }, updateDetails);

    response.json(updatedUser);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

export const deleteUser = async (request, response) => {
  try {
    const objID = request.params.id;
     const deletedUser = await Users.findByIdAndDelete({ "_id": objID })
    response.json(deletedUser);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
}

