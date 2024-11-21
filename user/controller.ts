import { NextFunction, Request, Response } from "express";
import ApiError from "../error/error";
import { IUser, ChangePassword } from "../type/Type";
import { validatePassword } from "../validation/validate";
import { createUser, login, forgotPassword, changePassword } from "./service";

export const signIn = async(req: Request, res: Response, next:NextFunction) => {
    try{
        const user: Partial<IUser> = req.body
        console.log(user);
        
        if(!user.email){
            throw new ApiError("Email is Required", 400, "VALIDATION_ERROR")
        }else if(!user.password){
            throw new ApiError("Password is Required", 400, "VALIDATION_ERROR")
        }else{
            const signIn_user = await login({
                email: user.email,
                password: user.password
            })
            
            if(signIn_user){
                res.cookie("token", signIn_user.token, {
                    httpOnly: true, // Add more options as necessary
                });
                res.status(200).json({
                    errCode: -1,
                    errMsg: "Success",
                    data: signIn_user
                })
            }else{
                throw new ApiError("Password Or Email is wrong", 400, "AUTHENTICATION_ERROR")
            }
            
        }

    }catch(e){
        next(e)
    }
    
}

export const signup = async(req: Request, res: Response, next:NextFunction) => {
    try{
        const user: IUser = req.body

        if(!user.email){
            throw new ApiError("Email is Required", 400, "VALIDATION_ERROR")
        }else if(!user.password){
            throw new ApiError("Password is Required", 400, "VALIDATION_ERROR")
        }else{

            const validatePassword_ = await validatePassword({
                password: user.password
            })

            if(validatePassword_){
                const create_user = await createUser({
                    name: user.name,
                    email: user.email,
                    password: validatePassword_.password,
                    passwordSalt: validatePassword_.salt 
                })

                if (create_user) {
                    res.cookie("token", create_user.token, {
                        httpOnly: true, // Add more options as necessary
                    });
            
                    res.status(200).json({
                        errCode: -1,
                        errMsg: "Success",
                        data: create_user,
                    });
                } else {
                    // Handle the case where create_user is undefined
                    throw new ApiError("User Creation Failed", 400, "FAILURE")
                }
            }
            
            
        }
    }catch(e: unknown){
        next(e)
        
    }
}

export const home = async(req: Request, res: Response) => {
    console.log(req.user);
    
    res.status(200).json({
        errCode: -1,
        errMsg: "Success"
    })
}

export const logout = async(_req: Request, res: Response, next: NextFunction) => {
    try{

        res.clearCookie("token", {
            httpOnly: true
        })

        res.status(200).json({
            errCode: -1,
            errMsg: "Success"
        })

    }catch(e){
        next(e)
    }
}

export const forgotPasswordHanldler = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const user: Partial<IUser> = req.body
        console.log(user);
        
        if(!user.email){
            throw new ApiError("Email is Required", 400, "VALIDATION_ERROR")
        }else{
            const sendToken = await forgotPassword({
                email: user.email
            })

            if(sendToken !== null){
                res.status(200).json({
                    errCode: -1,
                    errMsg: "Success"
                })
            }else{
                throw new ApiError("SomeThing Hapend", 400, "UNEXPECTED_ERROR")
            }
            
        }

    }catch(e){
        next(e)
    }
}

export const changePasswordHandler = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const data: ChangePassword = req.body
        console.log(data);
        
        if(!data.otp){
            throw new ApiError("Otp Should be Provided", 400, "VALIDATION_ERROR")
        }else if(!data.email){
            throw new ApiError("Email Should be Provided", 400, "VALIDATION_ERROR")
        }else if(!data.newPassword){
            throw new ApiError("New Password Should be Provided", 400, "VALIDATION_ERROR")
        }else if(!data.oldPassword){
            throw new ApiError("Old Password Should be Provided", 400, "VALIDATION_ERROR")
        }else{
            const changeThePassword = await changePassword(data)

            res.status(200).json({
                errCode: -1,
                errMsg: "Success",
                data: changeThePassword
            })

        }
    }catch(e){
        console.log(e);
        
        next(e)
    }
}