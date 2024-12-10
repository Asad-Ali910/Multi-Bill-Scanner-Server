import express from "express"
import cors from "cors"
import DecodeRouter from "./routes/DecodeRoute.js"

const App = express()

//Middlewares
App.use(cors())
App.use(express.json({limit: "10mb"}))
//Routes
App.use("/api", DecodeRouter)

export default App