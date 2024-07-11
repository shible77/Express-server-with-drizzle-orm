import express, {Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/setup';
import { users, products } from '../db/schema';
import verifySession from '../middlewares/verifySession';

const addProductRouter = express.Router();

const addProductReqBody = z.object({
    product_name : z.string(),
    description : z.string().nullable()
})
addProductRouter.post("/addProduct", verifySession, async(req, res) => {
    try{
        const { product_name, description } = addProductReqBody.parse(req.body)
        await db.insert(products).values({product_name, description})
        return res.status(201).json({
            success: true,
            data: { product_name, description },
            message: "Added Successfully",
          });
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({name: "Invalid data type.",
                message: JSON.parse(error.message),})
        }
        res.status(500).json({ message: "Internal server error", error });
    }
})

export default addProductRouter;