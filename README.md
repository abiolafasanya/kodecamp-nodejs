# kodecamp-nodejs
> NodeJs Task -- Reconstruct your codebase to meet MVC
## live link
[live link](https://kodecamp.herokuapp.com/api)

## clone or fork

## dependencies
- nodemon

## to run locally use
> to install dependencies use the below line

```bash
    npm install
```
> then use start server use the below line

```bash
    npm run start
```

## Also available to test on herokuApp

### Api Endpoint
> Base Url: kodecamp.herokuapp.com

- app.get("/users",auth, getUsers)

- Register
> POST 
> http://localhost:3000/register
- login
> POST 
> http://localhost:3000/login
- Profile
> GET
> http://localhost:3000/user/profile


https://kodecamp.herokuapp.com/api/users

- app.get("/user/:id", auth, singleUser)

https://kodecamp.herokuapp.com/api/user/id

- app.post("/user",auth, addUser)

https://kodecamp.herokuapp.com/api/user/

- app.delete("/user/:id", auth, deleteUser)

https://kodecamp.herokuapp.com/api/user/id

- app.put("/user/:id", auth, updateUser)

https://kodecamp.herokuapp.com/api/user/id


