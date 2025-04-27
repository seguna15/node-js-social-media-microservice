import cors from "cors";

export const configureCors = () => {
  return cors({
    //allowed access to origin
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000"];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); //given permission to allow request
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true, // enable support for cookies
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600, // cache pre flight response for 10 mins (600 seconds) -> avoid sending options request multiple times
  });
};
