import express, { Express, Request, Response,  NextFunction } from "express";
import { configureCors } from "@/config";
import { logger } from "@/utils";
import helmet from "helmet";
import { globalErrorHandler } from "@/middlewares";
import cookieParser from "cookie-parser";
import routes from "@/routes/comment.route";
import { rateLimit } from "@/middlewares/rateLimit.middleware";

const app: Express = express();

app.use(helmet())
app.use(configureCors());
app.use(cookieParser())
app.use(express.json());


app.use((req, _res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});


app.use(rateLimit);


//Routes

app.use("/api/comments", routes)

app.get("/api/comments/public/health", async(req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        success: true,
        message: "Comment service is healthy"
    })
    return
})

app.use(globalErrorHandler)

export default app;