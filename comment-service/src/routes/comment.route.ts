import { createCommentController, getPostCommentsController } from "@/controllers/comment.controller";
import { protectedRoute, sensitiveEndpoint } from "@/middlewares";
import express, {  Router } from "express";


const routes: Router = express.Router();

routes
    .post("/", [sensitiveEndpoint, protectedRoute], createCommentController )
    .get("/:postId", [sensitiveEndpoint, protectedRoute], getPostCommentsController)
   
    
    


export default routes


