// const { Users } = require("../models/User");
const { userModel, profileModel } = require("../models/users");

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

exports.info = async (req, res) => {
  console.log(profileModel.find({}));
  profileModel.findOne({ email }, (err, user) => {
    let userProfile = {
      name: user.name,
      id: user.id,
      email: user.email,
      accountId: user.accountId,
      profileId: user.profileId,
      address: user.address,
      status: user.status,
      phone: user.phone,
      location: user.location,
      updatedAt: user.updatedAt,
      photo: user.photo,
      occupation: user.occupation,
    };
    res.status(200).json({ ok: true, user: userProfile });
  });
};

/* Endpoint action functions */
exports.getUsers = async (req, res) => {
  try {
    // 5c7ce49d-643e-4b2a-b16e-2d5e1ea348ad
    let Users = await userModel.find({});
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
    let id = { _id: req.params.id };
    let user = userModel.findOne(id, (user) => {
      if (user.id === id) return true;
      else return false;
    });
    if (user) {
      let userProfile = {
        name: user.name,
        id: user.id,
        email: user.email,
        accountId: user.accountId,
        profileId: user.profileId,
        address: user.address,
        status: user.status,
        phone: user.phone,
        location: user.location,
        updatedAt: user.updatedAt,
        photo: user.photo,
        occupation: user.occupation,
      };
      res.status(200).json({
        ok: true,
        user: userProfile,
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
      name: req.body.name,
      email: req.body.email,
      photo: pics,
    };

    // check if user exists
    let ifEmailExists = userModel.findOne(
      { email: req.body.email },
      (err, user) => {
        if (user.email === createUser.email) return true;
        else {
          console.log(err.message);
          return false;
        }
      }
    );
    // end of checking
    if (ifEmailExists)
      return res.status(400).json({
        message: "Email already taken",
      });

    let newUser = Users.create(createUser);
    if (newUser) {
      res.status(201).json({
        ok: true,
        data: createUser,
        message: "User Inserted",
      });
    } else
      return res.status(400).json({ status: 400, error: "Operation Failed" });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let id = { _id: req.params.id };
    let { name, email, photo, location, address, occupation } = req.body;
    photo = req.file;
    let updateUser = { name, email, photo, location, address, occupation };
    userModel.updateOne(id, updateUser, (err, user) => {
      if (user) {
        res.status(201).json({
          ok: true,
          data: user,
          message: `User profile updated`,
        });
      } else {
        console.log(err.message);
        res.status(404).json({
          ok: false,
          message: `User update failed`,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Update failed because User is not found"],
    });
  }
};

exports.deleteUser = async (req, res) => {
  let id = { _id: req.params.id };
  try {
    userModel.deleteOne(id, (err, user) => {
      if (err) {
        res.status(400).json({ status: 400, message: err.message });
        return;
      }
      if (!user) {
        res.status(404).json({ ok: false, message: "user not found" });
      }
      res.status(200).json({
        ok: true,
        message: "User has been deleted",
        completed: true,
      });
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: [`failed to delete user with id: ${req.params.id}`, err.message],
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
