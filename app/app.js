import express, { application } from "express"
import cors from "cors"
import ExtractBillInfoRouter from "./routes/ExtractBillInfoRoute.js"
import RegisterUserRouter from "./routes/RegisterUserRoute.js"
import LoginUserRouter from "./routes/LoginUserRoute.js"
import ValidateTokensRoute from "./routes/ValidateAccessTokenRoute.js"
import otpVerificationRoute from "./routes/optverificationRoute.js"

const App = express()

//Middlewares
App.use(cors());
App.use(express.json({limit: "10mb"}));

//Routes
App.use("/api", ExtractBillInfoRouter);
App.use("/api", RegisterUserRouter);
App.use('/api', LoginUserRouter);
App.use('/api', ValidateTokensRoute);
App.use('/api', otpVerificationRoute);

App.get('/api',(req, res)=>{    
    res.send("Hello Wolrdd")
})

export default App