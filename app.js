const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Users = [
  { id: 1000, name: "abiola fasanya", email: "harbiola78@gmail.com" },
  { id: 1001, name: "johb doe", email: "john@gmail.com" },
  { id: 1002, name: "jane adams", email: "jane@gmail.com" },
  { id: 1003, name: "michael faraday", email: "michael@gmail.com" },
  { id: 1004, name: "christiano ronaldo", email: "ronaldo@gmail.com" },
  { id: 1005, name: "isaac newton", email: "newton@gmail.com" },
  { id: 1006, name: "joe bidden", email: "joe@gmail.com" },
  { id: 1007, name: "adam smith", email: "adams@gmail.com" },
  { id: 1008, name: "white money", email: "white@gmail.com" },
  { id: 1009, name: "sandra udoh", email: "sandra@gmail.com" },
];

/* Api Endpoint*/
app.get("/user", getUsers)

app.get("/user/:id", singleUser)

app.post("/user", addUser)

app.delete("/user/:id", deleteUser)

app.put("/user/:id", updateUser)

/* Endpoint action functions */
function getUsers(req, res) {
  try {
    if (Users.length > 0)
   return res.status(200).json({
      status: 200,
      data: Users,
      message: `${Users.length} Users found`,
    })
    else return res.status(400).json({status: 400, error: 'No record found'})
  } catch (err) {
    res.status(400).json({
      status: 400,
      error: [err.message, "failed to get users"],
    })
  }
} 

function singleUser(req, res) {
  try {
    let id = parseInt(req.params.id)
    let user = Users.find((user) => {
     if (user.id  === id) return true
     else return false
     })
     if (user) {
       res.status(200).json({
         status: 200,
         data: user,
         message: `User with ID:${user.id} found`,
        })
      }
      else {
        res.status(400).json({status: 400, error: 'User not found'})
      }
  } catch (err) {
    res.status(400).json({
      status: 400,
      error: [err.message, "User not found"],
    })
  } 
}

function addUser(req, res) {
  try {
    let createUser = {
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
    }
    let newUser = Users.push(createUser);
    if (newUser) {
      res.status(201).json({
        status: 201,
        data: createUser,
        message: "User Inserted",
      })
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      error: ["failed to insert new user", err.message],
    })
  }
} 

function updateUser(req, res) {
  try {
    let id = parseInt(req.params.id)
   let user = Users.find((user) => {
    if (user.id  === id) return true
    else return false
    })
    if (user){
      let index = Users.findIndex(user => user.id  === id)
      let {name, email} = req.body || [user.name, user.email]
      updateId = user.id || req.params.id
      let updateUser = {id, name, email}
      Users.splice(index, 1, updateUser)
      res.status(201).json({
        status: 201,
        index: user.index,
        data: updateUser,
        message: `User with id ${user.id} updated`,
      })
    }
    else{
      res.status(400).json({
        status: [400, false],
        error:  `User does with this ID: ${req.params.id} does not exist`,
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Update failed because User is not found"],
    })
  }
}

function deleteUser(req, res) {
  let ID = parseInt(req.params.id)
  try {
    let CheckUser = Users.find(user => {
      if (user.id  === ID) return true
      else return false
    })
    if(CheckUser){
      let user = Users.filter(user => user.id !== CheckUser.id)
        return res.status(200).json({
           status: 200,
           message: `User ${CheckUser.id} Deleted`,
           user,
         })
    } else return res.status(401).json({status: 401, message: `User with id ${ID} not found`})
    
   } catch (err) {
     res.status(500).json({
       status: 500,
       error: [`failed to delete user with id: ${req.params.id}`, err.message],
     });
   }
} 

app.listen(3000, () => {
  console.log("Server running on port 3000");
});