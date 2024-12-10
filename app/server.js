import App from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

App.listen(PORT, "0.0.0.0", () => {
    console.log(`App is listening on PORT: ${PORT}`)
})
