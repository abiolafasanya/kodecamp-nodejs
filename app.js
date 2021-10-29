const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Static file serving */
app.use(express.static("views"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.resolve("public")));
app.use(express.static(path.resolve("upload")));
// console.log(__dirname)

const db = require("./config/db");
const controller = require("./controllers/user");
const authController = require("./controllers/auth");
const pagesController = require("./controllers/pages");
const auth = require("./middleware/auth");
const { upload } = require("./utils/upload");

app.get("/api", controller.api);
/* Login and register route */
app.post("/signin", authController.signin);
app.post("/signup", authController.signup);
app.get("/user/profile/:id", auth, controller.profile); // get user info

/*Endpoints for pages*/
app.get("/", pagesController.contactPage);
app.get("/profile", pagesController.profile);
app.get("/login", pagesController.login);
app.get("/register", pagesController.register);
app.post("/contact", auth, pagesController.contact);

/* Authorization route */
app.get("/user/verify", authController.verify);
app.get("/api/users", controller.getUsers);
app.get("/api/user/:id", auth, controller.singleUser);
app.post("/api/user", auth, upload.single("photo"), controller.addUser);
app.delete("/api/user/:id", auth, controller.deleteUser);
app.put("/user/profile/:id", auth, upload.single("photo"), controller.updateProfile);

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});
