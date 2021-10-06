const { query } = require("express");
const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Users = [
  { id: 1, name: "abiola fasanya", email: "harbiola78@gmail.com" },
  { id: 2, name: "jane adams", email: "jane@gmail.com" },
  { id: 3, name: "michael faraday", email: "michael@gmail.com" },
  { id: 4, name: "christiano ronaldo", email: "ronaldo@gmail.com" },
  { id: 5, name: "isaac newton", email: "newton@gmail.com" },
  { id: 6, name: "joe bidden", email: "joe@gmail.com" },
  { id: 7, name: "adam smith", email: "adams@gmail.com" },
  { id: 8, name: "white money", email: "white@gmail.com" },
  { id: 9, name: "sandra udoh", email: "sandra@gmail.com" },
  { id: 10, name: "johb doe", email: "john@gmail.com" },
];

app.get("/user", async (req, res) => {
  /* Get all users statements/codes goes below here*/
  try {
    res.status(200).json({
      status: 200,
      data: Users,
      message: `${Users.length} Users found`,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Server Error"],
    });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    Users.filter((user) => {
      if (user.id == req.params.id) {
        res.status(200).json({
          status: 200,
          data: user,
          message: `User with ID:${user.id} found`,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Server Error"],
    });
  }
});

app.post("/user", (req, res) => {
  /* Create user statements/codes goes below here*/
  try {
    let createUser = {
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
    };
    let newUser = Users.push(createUser);
    if (newUser) {
      res.status(201).json({
        status: 201,
        data: createUser,
        message: "User Inserted",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: ["failed to insert new user", err.message],
    });
  }
});

app.delete("/user/:id", (req, res) => {
  /* Delete user statements/codes goes below here*/
  try {
    let removeUser = Users.pop({ id: req.params.id });
    if (removeUser) {
      res.status(200).json({
        status: 200,
        message: `User ${req.params.id} Deleted`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: ["failed to delete", err.message],
    });
  }
});

app.put("/user/:id", (req, res) => {
  // Update one user
  try {
    let index = Users.findIndex((user) => user.id == req.params.id);
    let id, name, email, password;
    id = req.params.id;
    name = req.body.name;
    email = req.body.email;
    let updateUser = (Users[index] = {id, name, email});
    if (updateUser) {
      res.status(201).json({
        status: 201,
        data: updateUser,
        message: `User with id ${req.params.id} updated`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: ["failed to delete", err.message],
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
