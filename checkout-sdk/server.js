const express = require("express");
const path = require("path");

const app = express();

// Serve your dist folder
app.use("/", express.static(path.join(__dirname, "dist")));

app.listen(3001, () => {
  console.log("Checkout SDK running at http://localhost:3001");
});
