import express from "express"
import cors from "cors"
import ExtractBillInfoRouter from "./routes/ExtractBillInfoRoute.js"

const App = express()

//Middlewares
App.use(cors())
App.use(express.json({limit: "10mb"}))
//Routes
App.use("/api", ExtractBillInfoRouter)

export default App