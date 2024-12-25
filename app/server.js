import App from "./app.js";
import dbConnect from "./db/dbConnect.js";

const PORT = process.env.PORT || 3000;

// Connect to DB and start the server
const server = dbConnect()
  .then(() => {
    return App.listen(PORT, "0.0.0.0", () => {
      console.log(`App is listening on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection failed with error: ", error);
  });

// Export server for Vercel
export default server;
