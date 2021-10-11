const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000
const controller = require('./controllers/user')
const {upload} = require('./config/upload')

/* Api Endpoint not related to task*/
app.get('/', controller.index)
app.get('/api', controller.api)

/* Endpoint for get, post, put and delete user */
app.get("/api/users", controller.getUsers)

app.get("/api/user/:id", controller.singleUser)

app.post("/api/user", upload.single('photo'), controller.addUser)

app.delete("/api/user/:id", controller.deleteUser)

app.put("/api/user/:id", upload.single('photo'), controller.updateUser)

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});