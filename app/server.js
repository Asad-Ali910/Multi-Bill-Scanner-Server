import App from "./app.js";
import dbConnect from "./db/dbConnect.js";

const PORT = process.env.PORT || 3000;

dbConnect()
  .then(() => {
    App.listen(PORT, "0.0.0.0", () => {
      console.log(`App is listening on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database COnnection failed with erorr: ", error);
  });
