import express, { application } from "express";
import cors from "cors";
import userRouter from "./routes/User.Route";

import { errorMiddleware } from "./middleware/errorMiddleware";

const App = express();

//Middlewares
App.use(cors());
App.use(express.json({ limit: "10mb" }));

// api routes for user
App.use("/api/auth/user", userRouter);

// custom middleware for handling custom errors
App.use(errorMiddleware);

export default App;
