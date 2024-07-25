// import { RecipesModel } from "../models/Recipes.js";
import mongoose from "mongoose";
import express from "express"
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();


router.get("/",async (req,res)=>{
    try{
        const response = await RecipesModel.find({})
        res.json(response)

    }catch(err)
    {
        res.json(err)
    }
})

router.post("/",verifyToken,async (req,res)=>{

    const recipe = new RecipesModel(req.body)
    try{
        await recipe.save()
        res.json(req.body)

    }catch(err)
    {
        res.json(err)
    }
})

router.put("/",verifyToken,async (req,res)=>{

    // res.json("recipes called")
    const user = await UserModel.findById(req.body.userID);
    const recipe = await RecipesModel.findById(req.body.recipeID);
    console.log(user,recipe);
    try{
        user.savedRecipes.push(recipe);
        await user.save()

        res.json({savedRecipes:user.savedRecipes})

    }catch(err)
    {
        res.json(err)
    }
})

router.get("/savedRecipes/ids/:userID",async (req,res)=>{
    try{
        const user = await UserModel.findById(req.params.userID)
        res.json({savedRecipes:user?.savedRecipes})

    }catch(err){
        res.json(err)
    }
})

router.get("/savedRecipes/:userID",async (req,res)=>{
    try{
        const user = await UserModel.findById(req.params.userID)
        const savedRecipes = await RecipesModel.find({
            _id:{$in:user.savedRecipes},
        })
        
        res.json(savedRecipes)

    }catch(err){
        res.json(err)
    }
})

router.get("/hi",(req,res)=>{
    res.json({id:"sdbskjdbskd"})
})

export {router as recipesRouter}