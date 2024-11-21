import ApiError from "../error/error";
import prisma from "../prisma/prisma-client";
import { SaveWhiteBoardData } from "../type/Type";


export const saveImage = async(data: SaveWhiteBoardData) => {
    const name = data.name.trim()
    const imageData = data.imageData
    const userId = data.userId

    const save = await prisma.whiteBoard.create({
        data: {
            name: name,
            imageData: imageData,
            userId: userId
        }
    })

    if(save){
        return save
    }else{
        throw new ApiError("Something went wrong",500, "Error")
    }
}

export const updateImage = async(data: Partial<SaveWhiteBoardData>) => {
    const imageData = data.imageData
    const whiteBoardId = parseInt(data.whiteBoardId);
    
    
    const update = await prisma.whiteBoard.update({
        where: {
            id: whiteBoardId
        },
        data: {
            imageData: imageData
        }
    })
    if(update){
        return update
    }else{
        throw new ApiError("Something went wrong",500, "Error")
    }
    
}

export const fetch = async(data: {userId: number}) => {
    const userId = data.userId || 0

    const get = await prisma.whiteBoard.findMany({
        where:{
            userId: userId
        }
    })

    if(get){
        return get
    }else{
        throw new ApiError("Something went wrong",500, "Error")
    }
}

export const fetchOne = async(data: any) => {
    const userId = data.userId
    const whiteBoardId = parseInt(data.id)

    const getOne = await prisma.whiteBoard.findUnique({
        where: {
            userId: userId,
            id: whiteBoardId
        }
    })

    if(getOne){
        return getOne
    }else{
        throw new ApiError("Something went wrong",500, "Error")
    }
}