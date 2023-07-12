import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.TOKEN_KEY;

function getExpiration() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  return d.getTime();
}

export const createUser = async (request, response) => {
  console.log("CreateUser has been called from the controller");
  try {
    const {
      userName,
      password,
      firstName,
      lastName,
      eMail,
      unionName,
      localName,
      title,
    } = request.body;

    const hash = await bcrypt.hash(password, 10);

    console.log(hash);

    const newUser = await User.create({
      userName,
      hash,
      firstName,
      lastName,
      eMail,
      unionName,
      localName,
      title,
    });

    console.log(newUser);

    const data = {
      id: newUser._id,
      userName: newUser.userName,
      exp: getExpiration(),
    };

    const token = jwt.sign(data, TOKEN_KEY);

    return response.json({ newUser, token });
  } catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};

export const userLogin = async (request, response) => {
  console.log(`The controller has been called`);
  const { username, password } = request.body;
  console.log(username + " + " + password);
  const user = await User.findOne({ userName: username });
  console.log(user);
  const hash = user.hash;

  const result = await bcrypt.compare(password, hash);
  console.log("The result is " + result);

  if (!result) {
    return response.status(401).json({
      message: "Incorrect password",
    });
  }

  const data = {
    id: user._id,
    userName: user.userName,
    exp: getExpiration(),
  };

  // sign the jwt
  const token = jwt.sign(data, TOKEN_KEY);
  console.log("The token is: " + token);

  response.set("Content-Type", "application/json");

  // return the token
  return response.json({ user, token });
};
