import express, {Router} from "express"
import { home, logout, signIn, signup, forgotPasswordHanldler, changePasswordHandler } from "./controller"
import { isLoggedIn } from "../middleware/middleware"

const router: Router = express.Router()

router.post("/signin", signIn)
router.post("/signup", signup)
router.get("/home", isLoggedIn, home)
router.put("/forgotPassword", forgotPasswordHanldler)
router.put("/changePassword", changePasswordHandler)
router.post("/logout", isLoggedIn, logout)

export default router