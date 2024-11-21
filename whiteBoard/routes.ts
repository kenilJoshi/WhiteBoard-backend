import express, { Router } from "express";
import {getAllWhiteBoard, saveWhiteBoard, getOneWhiteBoard } from  "../whiteBoard/controller"
import { isLoggedIn } from "../middleware/middleware";
// import { isLoggedIn } from "../middleware/middleware";

const router: Router = express.Router()

router.post("/save-whiteboard", isLoggedIn, saveWhiteBoard)
router.get("/get-all-whiteboard", isLoggedIn, getAllWhiteBoard)
router.post("/get-one-whiteboard", isLoggedIn, getOneWhiteBoard)

export default router