import express from "express";
import cors from "cors";
import userRouter from "./routes/User.Route.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const App = express();

//Middlewares
App.use(cors());
App.use(express.json({ limit: "10mb" }));

// api routes for user
App.use("/api/auth/user", userRouter);

// custom middleware for handling custom errors
App.use(errorMiddleware);

export default App;
