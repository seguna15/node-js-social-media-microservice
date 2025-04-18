
import {  uploadMediaCtrl } from "@/controllers/media.controller";
import { protectedRoute, sensitiveEndpoint, validateImage } from "@/middlewares";
import express, {  Router } from "express";


const routes: Router = express.Router();

routes.post(
  "/",
  [validateImage, sensitiveEndpoint, protectedRoute],
  uploadMediaCtrl
);
    
    
    


export default routes


