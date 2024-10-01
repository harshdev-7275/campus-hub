import express,{Request, Response} from "express"
import { prisma } from "../configs/prisma"

const getAllPostByCollege = async( req:Request, res:Response)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
               id: req.user?.userId 
            }
        })

        const posts = await prisma.post.findMany({
            where:{
                college: String(user?.college)
            },
            orderBy:{
                createdAt:"asc"
            }
        })
        return res.status(200).json({
            success:true,
            posts: posts,
            length: posts.length
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error!"
        })
    }
}


export {getAllPostByCollege}