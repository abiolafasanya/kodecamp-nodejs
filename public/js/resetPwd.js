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