import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.models";
import checkBody from "../utils/checkbody";


const Router = express.Router();


const jwtKey = process.env.JWT_SECRET
const generateToken = (id:string,email:string)=>{

    return jwt.sign({id,email},jwtKey||"secret",{
        expiresIn:"30m",
    })

}

Router.post('/login', async (req, res) => {

    const requireBody = ["email","password"];

    const {email,password}=req.body;
    
    try {
        const user = await User.findOne({email})

        if (!checkBody(req.body, requireBody)) {
            res.json({ result: false, error: "Missing or empty field" });
            return
          }


          if (user === undefined || user === null){
            res.status(401).send({ result: false, message: "Invalid credentials" });
            return
          }
          const isPasswordValid = bcrypt.compareSync(user.password,password);
          if (isPasswordValid) {
           res.status(401).send({ result: false, message: "Invalid credentials" });
           return
          }
          
          const token = generateToken(user.id.toString(),user.email);

          res.status(200).send({
            result: true,
            token,
          });
        


    }catch(error){
      res.status(500).json({message:"server error"})
    }


})


Router.post('/register',async(req,res)=>{

  const requireBody = ["email","password"];

  const {email,password,username}=req.body;
  try{
      if (!checkBody(req.body, requireBody)) {
        res.json({ result: false, error: "Missing or empty field" });
        return
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        res.json({ result: false, error: "Invalid email format" });
        return
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.json({ result: false, error: "User already exists" });
        return
      }

      const currentDate = new Date().toISOString()
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 30); 
      const expirationDateString = expirationDate.toISOString();

      const payload = {
        createdAt: currentDate,
        expiresAt: expirationDateString,
      };

      const newUser = new User({
        username,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      const savedUser = await newUser.save();
      const token = generateToken(savedUser.id.toString(), savedUser.email);

      savedUser.token = token;

      res.status(201).json({result:true, token:savedUser.token,payload});

    }catch (error){
      res.status(500).json({result:false,error:"Server error"});
    }
})


