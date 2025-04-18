
import { createPostCrl, deleteSinglePostCtrl, getAllPostsCtrl, getSinglePostCtrl } from "@/controllers/post.controller";
import { protectedRoute, sensitiveEndpoint } from "@/middlewares";
import express, {  Router } from "express";


const routes: Router = express.Router();

routes
    .post("/", [sensitiveEndpoint, protectedRoute], createPostCrl )
    .get("/public",sensitiveEndpoint, getAllPostsCtrl)
    .get("/public/:id", sensitiveEndpoint, getSinglePostCtrl)
    .delete("/:id", [sensitiveEndpoint, protectedRoute], deleteSinglePostCtrl)
    
    


export default routes


