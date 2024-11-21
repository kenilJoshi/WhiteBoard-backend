import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma-client";
import jwt from "jsonwebtoken"
import ApiError from "../error/error";
import { TokenDecode } from "../type/Type";


export const isLoggedIn = async(req: Request, _res: Response, next: NextFunction) =>{
    console.log(req.cookies);
    try{
        const token = req.cookies["token"] || req.header("Authorization")
        
        
        if(!token){
            throw new ApiError("Token is not Provided", 400, "VALIDATION_ERROR")
        }else{
            const decodedToken: TokenDecode | unknown = jwt.verify(token, process.env["JWT_SECRET"] || "secret")

            if(typeof decodedToken === "string"){
                throw new ApiError("Invalid Token Format", 400, "VALIDATION_ERROR");
            }

            const getUser = await prisma.user.findUnique({
                where: {
                    email: (decodedToken as TokenDecode)["email"] || ""
                }
            })

            if(getUser == null){
                throw new ApiError("Token is Invalid", 400, "VALIDATION_ERROR");
            }

            req.user =  getUser

            next()
            
        }
    }catch(e){
        next(e)
    }

}

