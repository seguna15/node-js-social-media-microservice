

import { searchPostController } from "@/controllers/search.controller";
import { protectedRoute, sensitiveEndpoint } from "@/middlewares";
import express, {  Router } from "express";


const routes: Router = express.Router();

routes.get("/posts", sensitiveEndpoint, searchPostController)
   
    
    


export default routes


