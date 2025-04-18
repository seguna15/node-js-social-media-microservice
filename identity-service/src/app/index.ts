import express, { Express, Request, Response,  NextFunction } from "express";
import { configureCors, redis } from "@/config";
import { logger } from "@/utils";
import { TooManyRequests } from "@/errors/TooManyRequests";
import helmet from "helmet";
import { RateLimiterRedis } from "rate-limiter-flexible";
import routes from "@/routes/identity.routes";
import { globalErrorHandler, rateLimit } from "@/middlewares";
import cookieParser from "cookie-parser";
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

//rate limiter

app.use(rateLimit);


//Routes
app.use("/api/auth", routes);

app.get("/api/auth/health", async(req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        success: true,
        message: "Identity service is healthy"
    })
    return
})

app.use(globalErrorHandler)

export default app;