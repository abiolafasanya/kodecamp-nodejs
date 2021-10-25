const express = require("express");
const app = express();
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Static file serving */
app.use(express.static('views'))
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.resolve("public")));
app.use(express.static(path.resolve("upload")));
// console.log(__dirname)

const PORT = process.env.PORT || 3000
const controller = require('./controllers/user')
const authController = require('./controllers/auth')
const pagesController = require('./controllers/pages')
const auth = require('./middleware/auth')
const {upload} = require('./utils/upload')


app.get('/api', controller.api)
/* Login and register route */
app.post("/signin", authController.login)
app.post("/signup", authController.register)
app.get('/user/profile',auth, controller.info) // get user info
app.get('/user/verify', authController.verify)

/* mail */


/*Endpoints for pages*/
app.get('/', pagesController.index)
app.get('/profile', pagesController.profile)
app.get('/login', pagesController.signIn)
app.get('/register', pagesController.signUp)

/* Authorization route */
app.post('/contact', auth, pagesController.processContact)
app.get("/api/users", auth, controller.getUsers)
app.get("/api/user/:id", auth, controller.singleUser)
/* When online this develop error because it will not 
save file on heroku but works fine on local host */
app.post("/api/user", auth, upload.single('photo'), controller.addUser)
app.delete("/api/user/:id", auth, controller.deleteUser)
app.put("/api/user/:id", auth, upload.single('photo'), controller.updateUser)

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});