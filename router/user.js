const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// controllers
const controller = require("../controllers/user")
const authController = require("../controllers/auth");
const resetController = require("../controllers/reset");
const pagesController = require("../controllers/pages");
const { upload } = require("../utils/upload");

// @route   GET /api
router.get("/", controller.api);

/* Login, register, and profile operation route */

// @route   POST /user/signin
router.post("/signin", authController.signin);

// @route   POST /user/signup
router.post("/signup", authController.signup);

// @route   GET user/profile/:id
router.get("/user/profile/:id", auth, controller.profile); // get user info

// @route   PUT /user/profile/:id
router.put(
  "/user/profile/:id",
  auth,
  upload.single("photo"),
  controller.updateProfile
);

/* End of login, register, and profile operation route 
*****************************************************************************
*/

/* Password and Reset operation route */

// @route   POST /password-reset 
router.post("/password-reset", resetController.requestPwdReset);

// @route   POST /create-password/:id/:token
router.post("/create-password/:id/:token", resetController.createPassword);

/* End of password and Reset operation route 
*****************************************************************************
*/

/* User route that deals with verification, getting all users, single user and removing/deleteing user*/

// @route   GET /user/verify
router.get("/user/verify", authController.verify);

// @route  GET /users
router.get("/users", auth, controller.getUsers);

// @route  GET /user/:id
router.get("/user/:id", auth, controller.singleUser);

// @route  DELETE /user/:id
router.delete("/user/:id", auth, controller.deleteUser);

/* End of user route that deals with verification, getting all users, 
  single user and removing/deleteing user 
*****************************************************************************
*/

/*Endpoints for all pages that displays on the browser*/

// @route GET /register     //register page
router.get("/register", pagesController.register);

// @route GET /login        //login page
router.get("/login", pagesController.login);

// @route GET /profile/:id //profile page
router.get("/profile/:id", pagesController.profile);

// @route GET /forgot-password //forgot password page
router.get("/forgot-password", pagesController.requestPwdReset);

// @route GET /reset-password/:id/:token //reset password page
router.get("/reset-password/:id/:token", pagesController.createPassword);

/* Endpoints for pages
*****************************************************************************
*/  

module.exports = router;