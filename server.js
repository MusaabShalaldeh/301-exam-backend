'use strict'
const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT = process.env.port || 3010;

const MONGO_URL = process.env.MONGO_URL;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FavoriteFruitModel;

//Server Functions
server.get('/',HomeHandle)
server.get('/getFruits',GetFruitsHandle);
server.post('/addToFavorites',AddToFavoritesHandle)
server.get('/getFavoriteFruits',GetFavoriteFruitsHandle)
server.put('/updateFavoriteItem',UpdateFavoriteItemHandler)
server.delete('/deleteItem',DeleteItemHandle);

main().catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);

    const FruitSchema = new Schema({
        name: String,
        photo: String,
        price: String,
        email: String
    });

    FavoriteFruitModel = mongoose.model("FavoriteFruit", FruitSchema);
}











//Handle Functions

function HomeHandle(request,response)
{
    response.send("welcome home, user.");
}


function GetFruitsHandle(request,response){
    const url = 'https://fruit-api-301.herokuapp.com/getFruit';

    axios
    .get(url)
    .then(result=>{
        response.send(result.data);
        console.log(result.data);
    })
    .catch(err=>{
        console.log(err);
    })
}


function AddToFavoritesHandle(request,response)
{
    const {name,image,price,email} = request.body;

    FavoriteFruitModel.create({name,image,price,email},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
    })
}

function GetFavoriteFruitsHandle(request,response){
    const userEmail = request.query.email;

    FavoriteFruitModel.find({email: userEmail},(err,result)=>{
        if(err)
        {  
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
    console.log(FavoriteFruitModel);
}

function UpdateFavoriteItemHandler(request,response)
{
    const {id,name,image,price,email} = request.body;

    FavoriteFruitModel.findByIdAndUpdate(id,{name,image,price},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
}
function DeleteItemHandle(request,response){
    const {id,name,image,price,email} = request.body;

    FavoriteFruitModel.deleteOne({_id:id},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
}


server.get('*',ErrorHandle)

function ErrorHandle(request,response){
    response.send("Error 404, Page Not Found");
}


server.listen(PORT,(req,res)=>{
    console.log(`Listening on port ${PORT}`)
});