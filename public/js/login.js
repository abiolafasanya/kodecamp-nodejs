const loginForm = document.querySelector("#login");
const main = document.querySelector("main");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is register page");
  let email, password;
  email = e.target.email.value;
  password = e.target.password.value;

  const formData = {
    email,
    password,
  };

  fetch("/signin", {
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
      if (data.ok) {
        console.log(data.ok, data.message);

        localStorage.clear();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("token", data.token);

        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("success");
        main.insertBefore(msgAlert, loginForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        email = e.target.email.value = "";
        password = e.target.password.value = "";
        let userProfile = document.querySelector("#userProfile")
        userProfile.setAttribute("class", `visible`)
        userProfile.setAttribute("href", `/profile/${data.id}`)
        e.target.email.setAttribute("disabled", "true")
        e.target.password.setAttribute("disabled", "true")
        e.target.loginBtn.setAttribute("disabled", "true")
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
