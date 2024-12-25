import App from "./app.js";
import dbConnect from "./db/dbConnect.js";
import { createServer } from "@vercel/node"; // Vercel's Node wrapper

const PORT = process.env.PORT || 3000;

// Connect to DB first
dbConnect()
  .then(() => {
    App.listen(PORT, () => {
      console.log(`App is listening on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection failed with error: ", error);
  });

// Export handler for Vercel
export default createServer(App);
