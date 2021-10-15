const express = require("express");
const app = express();
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Static file serving */
app.use(express.static('views'))
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000
const controller = require('./controllers/user')
const authController = require('./controllers/auth')
const pagesController = require('./controllers/pages')
const auth = require('./middleware/auth')
const {upload} = require('./config/upload')

app.post("/login", authController.login)
/* Api Endpoint not related to task*/
app.get('/', pagesController.index)
// app.get('/contact', pagesController.contact)
app.post('/contact', pagesController.processContact)
app.get('/api', controller.api)

/* Endpoint for get, post, put and delete user */
app.get("/api/users", controller.getUsers)

app.get("/api/user/:id", controller.singleUser)

/* When online this develop error because it will not 
save file on heroku but works fine on local host */
app.post("/api/user", upload.single('photo'), controller.addUser)

app.delete("/api/user/:id", controller.deleteUser)

app.put("/api/user/:id", auth, upload.single('photo'), controller.updateUser)

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});