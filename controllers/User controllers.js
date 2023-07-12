import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

// const TOKEN_KEY = process.env.TOKEN_KEY;

// function getExpiration() {
//   const d = new Date();
//   d.setMinutes(d.getMinutes() + 30);
//   return d.getTime();
// }

export const getUsers = async (request, response) => {
  try {
    const user = await User.find();
    response.json(user);
  } catch (error) {
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
        const user = await User.find({ _id: searchTerm });
        return user;
      } else {
        const user = await User.find({
          $or: [{ userName: searchTerm }, { eMail: searchTerm }],
        });

        return user;
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error message." });
  }
};

// export const createUser = async (request, response) => {
//   try {
//     const {
//       userName,
//       password,
//       firstName,
//       lastName,
//       eMail,
//       unionName,
//       localName,
//       title,
//     } = request.body;

//     const hash = await bcrypt.hash(password, 10);

//     const newUser = await Users.create({
//       userName: userName,
//       hash: hash,
//       firstName: firstName,
//       lastName: lastName,
//       eMail: eMail,
//       unionName: unionName,
//       localName: localName,
//       title: title,
//     });

//     const data = {
//       id: newUser._id,
//       userName: newUser.userName,
//       exp: getExpiration(),
//     };

//     const token = jwt.sign(data, TOKEN_KEY);

//     response.json(token);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json("Error message");
//   }
// };

// export const userLogin = async (request, response) => {
//   const { userName, password } = request.body;
//   const user = await Users.findOne({ userName: userName });
//   const hash = user.hash;

//   const result = await bcrypt.compare(password, hash);

//   if (!result) {
//     return res.status(401).json({
//       message: "Incorrect password",
//     });
//   }

//   const data = {
//     id: user._id,
//     userName: user.userName,
//     exp: getExpiration(),
//   };

//   // sign the jwt
//   const token = jwt.sign(data, TOKEN_KEY);

//   // return the token
//   return res.json(token);
// };

export const updateUser = async (request, response) => {
  try {
    const searchID = request.params.id;

    let {
      userName,
      password,
      firstName,
      lastName,
      eMail,
      unionName,
      localName,
      title,
    } = request.body;

    const updateDetails = {
      userName,
      password,
      firstName,
      lastName,
      eMail,
      unionName,
      localName,
      title,
    };

    const updatedUser = await User.findByIdAndUpdate(
      { _id: searchID },
      updateDetails
    );

    response.json(updatedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const deleteUser = async (request, response) => {
  try {
    const objID = request.params.id;
    const deletedUser = await User.findByIdAndDelete({ _id: objID });
    response.json(deletedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};
