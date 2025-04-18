import express, { Router } from "express";
import {
  loginCtrl,
  logoutCtrl,
  refreshAccessToken,
  RegisterCtrl,
} from "@/controllers/identity.controller";
import { catchAsyncError } from "@/middlewares";
import { sensitiveEndpoint } from "@/middlewares";

const routes: Router = express.Router();

routes
  .post("/register", sensitiveEndpoint, catchAsyncError(RegisterCtrl))
  .post("/login", sensitiveEndpoint, catchAsyncError(loginCtrl))
  .post("/logout", catchAsyncError(logoutCtrl))
  .post(
    "/refresh-token",
    sensitiveEndpoint,
    catchAsyncError(refreshAccessToken)
  );

export default routes;
