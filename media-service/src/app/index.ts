import express, { Express, Request, Response,  NextFunction } from "express";
import { configureCors } from "@/config";
import { logger } from "@/utils";
import helmet from "helmet";
import { globalErrorHandler} from "@/middlewares";
import cookieParser from "cookie-parser";
import routes from "@/routes/media.route";


const app: Express = express();

app.use(helmet())
app.use(configureCors());
app.use(cookieParser())
app.use(express.json());
//app.use(express.urlencoded({ extended: true }))


app.use((req, _res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});





//Routes

app.use("/api/media", routes)

app.get("/api/media/health", async(req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        success: true,
        message: "Media service is healthy"
    })
    return
})

app.use(globalErrorHandler)

export default app;