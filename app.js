const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Static file serving */
app.use(express.static("views"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.resolve("public")));
app.use(express.static(path.resolve("upload")));

const userRouter = require("./router/user");
app.use("/", userRouter);

const contactRouter = require("./router/contact");
app.use("/", contactRouter);

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});
