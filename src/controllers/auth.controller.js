import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({email})
    if(userFound)
    return res.status(400).json(["The email already exists"])

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });
    const userSaved = await newUser.save();
    const token = await createAccesToken({id: userSaved._id})
    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email
    })
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


export const login = async (req, res) => {
  const { username, password} = req.body;

  try {

    const userFound = await User.findOne({username})
    console.log(userFound)
    if (!userFound) return res.status(400).json({message: "user not found"}) 

    const isMatch = await bcrypt.compare(password, userFound.password);

    if(!isMatch) return res.status(400).json({message:"Incorret password"})

    const token = await createAccesToken({id: userFound._id})
    res.cookie("token", token);
    res.json({
      success: true,
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email
      }
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


export const logout = (req, res) => {
    res.cookie('token', "", {
      expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const verifyToken = async(req,res) => {
         const {token} = req.cookies
         console.log(token)

         if(!token) return res.status(401).json({message:"Unauthorized"})

         jwt.verify(token, TOKEN_SECRET, async(err, user)=>{
          if (err) return res.status(401).json({message: "Unauthorized"})

          const userFound = await User.findById(user.id)
          console.log(user.id)
          if (!userFound) return res.status(401).json({message: "Unauthorized"})

          return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
          })
         })
}