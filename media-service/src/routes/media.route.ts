import {  getAllMedia, uploadMediaCtrl } from "@/controllers/media.controller";
import { protectedRoute, sensitiveEndpoint, validateImage } from "@/middlewares";
import express, {  Router } from "express";


const routes: Router = express.Router();

routes
  .post(
    "/",
    [validateImage, sensitiveEndpoint, protectedRoute],
    uploadMediaCtrl
  )
  .get("/", [sensitiveEndpoint, protectedRoute], getAllMedia)

    
    
    


export default routes


