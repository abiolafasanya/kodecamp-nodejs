const Users = require("../models/User");

exports.index = () => {
  console.log("Hello world this is abiola fasanya");
};

exports.profilePics = (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if(user){
        console.log(user);
        user.photo = req.file
        res.status(200).json({data: user, img: user.photo});
        console.log(req.file);
      }
      else{
        console.log(user);
         res.status(400).json({error: 'user not found'})
        }
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err.message);
  }
};

/* Endpoint action functions */
exports.getUsers = (req, res) => {
  try {
    if (Users.length > 0)
      return res.status(200).json({
        status: 200,
        data: Users,
        message: `${Users.length} Users found`,
      });
    else return res.status(404).json({ status: 404, error: "No record found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "failed to get users"],
    });
  }
};

exports.singleUser = (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      res.status(200).json({
        status: 200,
        data: user,
        message: `User with ID:${user.id} found`,
      });
    } else
      return res.status(404).json({ status: 404, error: "User not found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "User not found"],
    });
  }
};

exports.addUser = (req, res) => {
  try {
    let pics = req.file === undefined || null ? null : req.file.path
    let createUser = {
      id: Users.length + 1,
      name: req.body.name,
      email: req.body.email,
      photo: pics
    };
    let newUser = Users.push(createUser);
    if (newUser) {
      res.status(201).json({
        status: 201,
        data: createUser,
        message: "User Inserted",
      });
    } else
      return res.status(400).json({ status: 400, error: "Operation Failed" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: ["failed to insert new user", err.message],
    });
  }
};

exports.updateUser = (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      let index = Users.findIndex((user) => user.id === id);
      let  name, email
      name = req.body.name || user.name;
      email = req.body.email || user.email;
      updateId = user.id || req.params.id;
      let upload = req.file.path || user.photo;
      let updateUser = { id, name, email, upload};
      console.log(updateUser)
      Users.splice(index, 1, updateUser);
      res.status(201).json({
        status: 201,
        data: updateUser,
        message: `User with id ${user.id} updated`,
      });
    } else {
      res.status(404).json({
        status: [404, false],
        error: `User does with this ID: ${req.params.id} does not exist`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Update failed because User is not found"],
    });
  }
};

exports.deleteUser = (req, res) => {
  let ID = parseInt(req.params.id);
  try {
    let CheckUser = Users.find((user) => {
      if (user.id === ID) return true;
      else return false;
    });
    if (CheckUser) {
      Users.filter((user) => user.id !== CheckUser.id);
      return res.status(200).json({
        status: 200,
        message: `User ${CheckUser.id} has been succeccfully Deleted`,
      });
    } else
      return res
        .status(404)
        .json({ status: 404, message: `User with id ${ID} not found` });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [`failed to delete user with id: ${req.params.id}`, err.message],
    });
  }
};

exports.api = (req, res) => {
  res.json({
    endpoints: {
      getUsers: "https://kodecamp.herokuapp.com/api/users",
      singleUser: "https://kodecamp.herokuapp.com/api/user/id",
      addUser: "https://kodecamp.herokuapp.com/api/user/",
      updateUser: "https://kodecamp.herokuapp.com/api/user/id",
      deleteUser: "https://kodecamp.herokuapp.com/api/user/id",
    },
    documentation: "https://github.com/fastbeetech/kodecamp-nodejs",
  });
};
