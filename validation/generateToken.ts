import jwt from "jsonwebtoken"
import { IUser } from "../type/Type"

const generateToken = (user: Partial<IUser>): string => 
    jwt.sign(user, process.env['JWT_SECRET']|| "Secret", {expiresIn: "60d"})

export default generateToken