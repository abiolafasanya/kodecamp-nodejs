const contact = document.querySelector("form");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let message = document.querySelector("#message");
let contactArea = document.querySelector(".card");

contact.addEventListener("submit", (e) => {
  e.preventDefault();
  // let {email, message} = e.target.value
  let payload = {
    name: username.value,
    email: email.value,
    message: message.value,
  };
  console.log(payload);

  document.querySelector("#btn").classList.add("btn-success");
  document.querySelector("#btn").innerHTML = `<span class="flex space-x-3">
                  <img src="https://img.icons8.com/color/48/ffffff/spinning-circle--v2.png" 
                  class="spin" style="width:8px; height:8px; "/>
                  Sending Message...
              </span>`;

  const msgAlert = document.createElement("div");

  fetch("/contact", {
    method: "post",
    //   credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      if (data.ok) {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("success");
        contactArea.insertBefore(msgAlert, contact);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 6000);
        document.querySelector("#btn").classList.remove("btn-success");
        document.querySelector("#btn").classList.add("btn-send");
        document.querySelector("#btn").innerHTML = "Submit";
        username.value = "";
        email.value = "";
        message.value = "";
      } else {
        console.log(data.ok, data.message);
        let msg = document.createTextNode(data.message);
        msgAlert.appendChild(msg);
        msgAlert.classList.add("error");
        contactArea.insertBefore(msgAlert, contact);
        setTimeout(() => {
          msgAlert.classList.add("hidden");
        }, 8000);

        username.value = "";
        email.value = "";
        message.value = "";
        document.querySelector("#btn").classList.remove("btn.success");
        document.querySelector("#btn").classList.add("btn.send");
        document.querySelector("#btn").innerHTML = "Submit";
      }
    });
});

// if (
//   (username.value === "" || username.value === null) &&
//   (email.value === "" || email.value === null) &&
//   (message.value === "" || message.value === null)
// ) {
//   console.log("form values are empty");
//   msgAlert.appendChild(empty);
//   msgAlert.classList.add("error");
//   contactArea.insertBefore(msgAlert, contact);
//   setTimeout(() => {
//     msgAlert.classList.add("hidden");
//   }, 6000);

//   email.value = "";
//   message.value = "";
//   document.querySelector("#btn").classList.add("bg-green");
//   document.querySelector("#btn").innerHTML = "Submit";

//   return;
// }
