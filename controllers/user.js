const { Users } = require("../models/User");
const profile  = require("../models/profile");
exports.profilePics = (req, res) => {
  try {
    let id = req.params.id;
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      console.log(user);
      console.log(req.file, "resykt");
      user.photo = req.file;
      res.status(200).json({
        ok: true,
        data: user,
        img: user.photo,
      });
      console.log(req.file);
    } else {
      console.log(user);
      res.status(400).json({
        ok: false,
        error: "user not found",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log(err.message);
  }
};

exports.info = (req, res) => {
  console.log(profile);
  profile.find(user => {
   let userProfile = {
      name: user.name,
      id: user.id,
      email: user.email,
      accountId: user.accountId,
      profileId:user.profileId,
      address: user.address,
      status: user.status,
      phone: user.phone,
      location: user.location,
      updatedAt: user.updatedAt,
      photo: user.photo,
      occupation: user.occupation,
    }
    res.status(200).json({ ok: true, user: userProfile });
  })
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
    let id = req.params.id;
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      res.status(200).json({
        ok: true,
        user,
        message: `User with ID:${user.id} found`,
      });
    } else
      return res.status(404).json({ ok: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: [err.message, "User not found"],
    });
  }
};

exports.addUser = (req, res) => {
  try {
    let pics = req.file === undefined || null ? null : req.file.path;
    let createUser = {
      id: Users.length + (1000 + 1),
      name: req.body.name,
      email: req.body.email,
      photo: pics,
    };

    // check if user exists 
    let ifEmailExists = Users.find(user => {
      if(user.email === createUser.email) return true
      else return false
    })
  // end of checking
  if (ifEmailExists) return res.status(400).json({
    message: 'Email already taken'
  })

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
    let id = req.params.id;
    let user = Users.find((user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      // declaration of variable names to be used
      console.log(req.body, req.file);
      let name, email, pics, photo, updateUser, index;
      index = Users.findIndex((user) => user.id === id);
      pics = req.file === undefined || null ? null : req.file;
      name = req.body.name || user.name;
      email = req.body.email || user.email;
      photo = pics || user.photo;
      updateUser = { id, name, email, photo };

      console.log(updateUser);
      Users.splice(index, 1, updateUser);
      res.status(201).json({
        ok: true,
        data: updateUser,
        message: `User profile updated`,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: `User update failed`,
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
  let ID = req.params.id;
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
      login: "https://kodecamp.herokuapp.com/login",
      register: "https://kodecamp.herokuapp.com/register",
      signin: "https://kodecamp.herokuapp.com/signin",
      signup: "https://kodecamp.herokuapp.com/signup",
      profile: "https://kodecamp.herokuapp.com/profile",
      userProfile: "https://kodecamp.herokuapp.com/user/profile",
    },
    documentation: "https://github.com/fastbeetech/kodecamp-nodejs",
  });
};
