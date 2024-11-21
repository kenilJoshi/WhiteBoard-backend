import express, { Router } from "express";
import userRouter from "./user/routes"
import whiteBoardRouter from "./whiteBoard/routes"

const router: Router = express.Router()

router.use("/user", userRouter)
router.use("/whiteBoard", whiteBoardRouter)


export default router