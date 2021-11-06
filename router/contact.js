const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// controllers
const pagesController = require("../controllers/pages");

// @route GET /
router.get("/", pagesController.contactPage);
router.post("/contact", auth, pagesController.contact);

module.exports = router;