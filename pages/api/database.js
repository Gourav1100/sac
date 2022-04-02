import { JSONParser } from "formidable/lib/json_parser";
import { ObjectID } from "mongodb";
import { connectToDatabase } from "../../lib/connect_todb";

const ObjectId = require('mongodb').ObjectId;

async function get(req,res){
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        let query = req.body;
        console.log(query);
        // fetch the posts
        let rdata = await db.collection(req.body.type).find({_id: ObjectID(query._id)}).toArray();
        console.log(typeof(rdata[0]._id));
        // return the posts
        return res.status(200).json({
            message: JSON.parse(JSON.stringify(rdata)),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.status(200).json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function update(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // get body data
        let query = req.body;
        // set update data
        let udata = {};
        if(query.type === "user"){
            udata = {
                name: query.name,
                password: query.password,
                privilage: query.privilage,
                contact: query.contact,
                email: query.email,
            }
        }
        else if( query.type === "post" ) {
            udata = {
                description: query.description,
                title: query.title,
                images: query.images,
                videos: query.videos,
            }
        }
        else{
            return res.status(200).send({
                message: 'Invalid database type',
                success: false,
            });
        }
        // update the published status of the post
        await db.collection(query.type).updateOne({"_id": ObjectID(query._id)},{$set: udata});

        // return a message
        return res.json({
            message: 'Data updated successfully',
            success: true,
        });
    } catch (error) {

        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function Delete(req, res) {
    try {
        // Connecting to the database
        let { db } = await connectToDatabase();

        // Deleting the post
        await db.collection(req.body.type).deleteOne({
            _id: ObjectID(req.body._id),
        });

        // returning a message
        return res.json({
            message: 'Data deleted successfully',
            success: true,
        });
    } catch (error) {
        // returning an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function add(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // set user query
        let query = req.body;
        console.log(query);
        //  set add data
        let adata;
        if(query.type === "user"){
            adata = {
                name: query.name,
                password: query.password,
                privilage: query.privilage,
                contact: query.contact,
                email: query.email,
            }
        }
        else if( type === "post" ) {
            adata = {
                description: query.description,
                title: query.title,
                images: query.images,
                videos: query.videos,
            }
        }
        else{
            return res.status(200).send({
                message: 'Invalid database type',
                success: false,
            });
        }
        await db.collection(req.body.type).insertOne(adata);
        // return a message
        return res.json({
            message: 'Data added successfully',
            success: true,
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}



export default async function handler(req,res){

    switch(req.method){
        case "GET":
            return get(req,res);
        case "POST":
            return add(req,res);
        case "PUT":
            return update(req,res);
        case "DELETE":
            return Delete(req,res);
    }
}
