"use strict";

import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";
import { Advisor, Reviewer } from '../models/staff.js';
import { Admin } from '../models/admin.js';


export const login = async (req,res)=>{
    const {email,password,role}=req.body;

    let worker;
    if(role === 'admin'){
        worker = await Admin.findOne({email});
    }else if (role=== 'advisor'){
        worker = await Advisor.findOne({email});
    }else if(role === 'reviewer'){
        worker = await Reviewer.findOne({email});
    }
    if(!worker){
      return  res.status(401).json({message:'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password,worker.password);
    if(!isMatch){
       return res.status(401).json({message:'Invalid email or password'});
    }

    res.json({
        _id:worker._id,
        email:worker.email,
        token:generateToken(worker._id)
    });
}




