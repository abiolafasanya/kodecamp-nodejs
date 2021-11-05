const resetPwdForm = document.querySelector("#pwdReset");
const main = document.querySelector("main");
const createPwdForm = document.querySelector("#createPwd");

resetPwdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is reset password page");
  let email = e.target.email.value;

  const formData = {
    email,
  };

  fetch("/password-reset", {
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
        main.insertBefore(msgAlert, resetPwdForm);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        email = e.target.email.value = "";
      } else {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("error");
        main.insertBefore(msgAlert, resetPwdForm);
        email = e.target.email.value = "";
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
      }
    });
  email = e.target.email.value = "";
});


createPwdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("this is create password page");
 let  password = e.target.password.value;
 let  cpassword = e.target.cpassword.value;

 if(password !== cpassword){
    let msg = document.createTextNode("Passwords do not match");
    let msgAlert = document.createElement("div");
    msgAlert.appendChild(msg);
    msgAlert.classList.add("error");
    main.insertBefore(msgAlert, createPwdForm);
    setTimeout(() => {
      msgAlert.classList.add("hidden");
    }, 6000);
    return
 }
  const formData = {
    email,
  };
  let URL = localStorage.getItem("pageUrl");
  fetch(URL, {
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

window.addEventListener("load", () => {
  let url = window.location.href;
  consol.log(url);
})