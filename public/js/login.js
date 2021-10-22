const loginForm = document.querySelector("#login");
const main = document.querySelector("main");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is register page");
  let name, email, password, cpassword;

  email = e.target.email.value;
  password = e.target.password.value;

  const formData = {
    email,
    password,
  };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const msgAlert = document.createElement("div");
      localStorage.clear()
      if (data.ok) {
        console.log(data.ok, data.message);
        localStorage.setItem('token', data.token)
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("success");
        main.insertBefore(msgAlert, loginForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        email = e.target.email.value = "";
        password = e.target.password.value = "";
      } else {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("error");
        main.insertBefore(msgAlert, loginForm);
        email = e.target.email.value = "";
        password = e.target.password.value = "";
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
      }
    });
    email = e.target.email.value = "";
    password = e.target.password.value = "";
});
