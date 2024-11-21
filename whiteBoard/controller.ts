import { Request, Response, NextFunction } from "express"
import { SaveWhiteBoardData } from "../type/Type"
import ApiError from "../error/error"
import { saveImage, updateImage, fetch, fetchOne } from "./service"

export const saveWhiteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const whiteBoard: SaveWhiteBoardData = req.body
        console.log(req.user);
        
        if(!whiteBoard.name){
            throw new ApiError("Image Data is Required", 400, "VALIDATION_ERROR")
        }else{
            console.log(whiteBoard.whiteBoardId);
            
            if(!whiteBoard.whiteBoardId){
                const createWhiteBoard = await saveImage({
                    name: whiteBoard.name|| "",
                    imageData: whiteBoard.imageData || "",
                    userId: req.user.id
                })
                console.log(createWhiteBoard);
                res.status(200).json({
                    errCode: -1,
                    errMsg: "Success",
                    data: createWhiteBoard
                })
            }else{
                const updateWhiteBoard = await updateImage({
                    whiteBoardId: whiteBoard.whiteBoardId || 0,
                    imageData: whiteBoard.imageData || ""
                })

                res.status(200).json({
                    errCode: -1,
                    errMsg: "Success",
                    data: updateWhiteBoard
                })
                
            }
            
        }

        
    }catch(e){
        console.log(e);
        
        next(e)
    }
}

export const getAllWhiteBoard = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const getAll = await fetch({
            userId: req.user.id || 0
        })

        res.status(200).json({
            errCode: -1,
            errMsg: "Success",
            data: getAll
        })

    }catch(e){
        next(e)
    }
}

export const getOneWhiteBoard = async(req: Request, res: Response, next: NextFunction) => {
    const whiteBoardId = req.body
    console.log(whiteBoardId);
    
    try{
        const getAll = await fetchOne({
            userId: req.user.id || 0,
            id: whiteBoardId.whiteBoardId
        })

        res.status(200).json({
            errCode: -1,
            errMsg: "Success",
            data: getAll
        })

    }catch(e){
        console.log(e);
        
        next(e)
    }
}
