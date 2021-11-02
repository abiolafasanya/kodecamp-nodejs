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
## Authorization
>Bearer {Token}


## Also available to test on herokuApp

## Task for Authentication and Authorization Endpoints
> Register, Login and Profile are all POST method
### Register
- Register
> POST 
> http://localhost:3000/signup
>https://kodecamp.herokuapp.com/signup
### Login
- login
> POST 
> http://localhost:3000/signin
>https://kodecamp.herokuapp.com/signin
### Profile
> Requires Authentication | Authorization [bearer token]
- Profile
> GET
> http://localhost:3000/user/profile
>https://kodecamp.herokuapp.com/user/profile

## For front End Preview and Testing
>Methods here is GET method
### SignIn Page
> http://localhost:3000/login
>https://kodecamp.herokuapp.com/login

### SignUP Page
> http://localhost:3000/register
>https://kodecamp.herokuapp.com/register

### Profile Page
> http://localhost:3000/user/profile/:id
>https://kodecamp.herokuapp.com/user/profile/:id

## Api Endpoint
> Base Url: kodecamp.herokuapp.com

- app.get("/users",auth, getUsers)

https://kodecamp.herokuapp.com/api/users

- app.get("/user/:id", auth, singleUser)

https://kodecamp.herokuapp.com/api/user/id

- app.post("/user",auth, addUser)

https://kodecamp.herokuapp.com/api/user/

- app.delete("/user/:id", auth, deleteUser)

https://kodecamp.herokuapp.com/api/user/id

- app.put("/user/:id", auth, updateUser)

https://kodecamp.herokuapp.com/api/user/id


