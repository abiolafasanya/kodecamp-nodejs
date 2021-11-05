const main = document.querySelector("main");
const createPwdForm = document.querySelector("#createPwd");

window.addEventListener("load", () => {
  let url = window.location.href;
  console.log('url from browser: %s', url);
  localStorage.clear();
  localStorage.setItem("pageUrl", url);
});

let pwdResetURL = localStorage.getItem("pageUrl");
console.log('url form localstorage: %s',pwdResetURL);
createPwdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is create password page");
  let password = e.target.password.value;
  let cpassword = e.target.cpassword.value;

  if (password !== cpassword) {
    let msg = document.createTextNode("Passwords do not match");
    let msgAlert = document.createElement("div");
    msgAlert.appendChild(msg);
    msgAlert.classList.add("error");
    main.insertBefore(msgAlert, createPwdForm);
    setTimeout(() => {
      msgAlert.classList.add("hidden");
    }, 6000);
    return;
  }
  const formData = {
    email,
  };
  fetch(pwdResetURL, {
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
        main.insertBefore(msgAlert, createPwdForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        password = e.target.password.value = "";
        cpassword = e.target.cpassword.value = "";
      } else {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("error");
        main.insertBefore(msgAlert, createPwdForm);
        password = e.target.password.value = "";
        cpassword = e.target.cpassword.value = "";
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
      }
    });
  password = e.target.password.value = "";
  cpassword = e.target.cpassword.value = "";
});
