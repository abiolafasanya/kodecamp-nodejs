const registerForm = document.querySelector("#register");
const main = document.querySelector("main")

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is register page");
  let name, email, password, cpassword;

  name = e.target.name.value;
  email = e.target.email.value;
  password = e.target.password.value;
  cpassword = e.target.cpassword.value;
  // console.log({name, email, password, cpassword})

  // const formData = new FormData();
  // formData.append("name", name);
  // formData.append("email", email);
  // formData.append("password", password);
  // formData.append("cpassword", cpassword);
  // console.log(formData)

  const formData = {
    name,
    email,
    password,
  };
  console.log(formData);

  fetch("/register", {
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
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("success");
        main.insertBefore(msgAlert, registerForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        name = e.target.name.value = "";
        email = e.target.email.value = "";
        password = e.target.password.value = "";
        cpassword = e.target.cpassword.value = "";

      } else {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("error");
        main.insertBefore(msgAlert, registerForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        name = e.target.name.value = "";
        email = e.target.email.value = "";
        password = e.target.password.value = "";
        cpassword = e.target.cpassword.value = "";
      }
    });
});
