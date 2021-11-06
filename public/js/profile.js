const fileUpload = document.querySelector(".upload");
const uploadBtn = document.querySelector(".upload-btn");
const uploadProgress = document.querySelector(".upload_progress");
let TOKEN = localStorage.getItem("token");
let ID = localStorage.getItem("userId");

// redirect and clear token and id
function Redirect() {
  localStorage.clear();
  window.location.assign("/login");
}

uploadBtn.addEventListener("click", perform);
console.log("mounted");

function perform() {
  console.log("file upload clicked");
  fileUpload.click();
}
// profile picture upload
fileUpload.addEventListener("change", (e) => {
  console.log(fileUpload.files);
  file = e.target.files[0];
  console.log(file.name);
  if (
    !["image/jpeg", "image/gif", "image/png", "image/svg+xml"].includes(
      file.type
    )
  ) {
    console.log("file must be an image");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    console.log("file must be less than 2MB");
    return;
  }
  const formData = new FormData();
  formData.append("photo", file);
  uploadBtn.textContent = "uploading image...";
  uploadBtn.style.backgroundColor = "rgb(80, 4, 80)";

  // ID = JSON.parse(ID)

  fetch(`/user/profile/${ID}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ` + `${TOKEN}`,
    },
    body: formData,
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.ok) {
        console.log(data.ok);
        console.log(data.photo);
        document.querySelector("#photo").src = `/img/${data.photo}`;
        uploadBtn.textContent = "Image uploaded successfully";
        uploadBtn.style.backgroundColor = "rgb(106, 190, 106)";
      } else {
        console.log(data.ok);
        uploadBtn.textContent = "Error processing upload file";
        uploadBtn.style.backgroundColor = "rgb(241, 98, 98)";
      }

      setTimeout(() => {
        uploadBtn.style.backgroundColor = "rgb(36, 35, 35)";
        uploadBtn.textContent = "Upload Image";
      }, 5000);
    });
});

//profile upload {}

// update profile picture
const btnUpdate = document.querySelector("#btn-update")
btnUpdate.addEventListener('click', e => {
  e.preventDefault()
  let phone = document.querySelector("#phone").value
  let occupation = document.querySelector("#occupation").value
  let location = document.querySelector("#location").value
  let address = document.querySelector("#address").value
  console.log(phone, occupation, location, address)

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("occupation", occupation);
  formData.append("location", location);
  formData.append("address", address);
  btnUpdate.textContent = "uploading profile...";
  btnUpdate.style.backgroundColor = "rgb(80, 4, 80)";
  
fetch(`/user/profile/${ID}`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ` + `${TOKEN}`,
  },
  body: formData,
})
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((data) => {
    console.log(data);
    if (data.ok) {
      console.log(data.ok);
      console.log(data.photo);
      
      btnUpdate.textContent = "profile updated successfully";
      btnUpdate.style.backgroundColor = "rgb(106, 190, 106)";
    } else {
      console.log(data.ok);
      btnUpdate.textContent = "Error encountered while processing";
      btnUpdate.style.backgroundColor = "rgb(241, 98, 98)";
    }

    setTimeout(() => {
      btnUpdate.style.backgroundColor = "rgb(80, 4, 80)";
      btnUpdate.textContent = "Update Profile";
    }, 5000);
  });
})

  // load page data
window.addEventListener("load", () => {
  console.log({ storageToken: TOKEN });
  fetch(`/user/profile/${ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ` + `${TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data.ok);
      if (data.ok) {
        console.log(data.profile);
        console.log(data.profile.name);
        document.querySelector("#username").innerHTML = data.profile.name;
        document.querySelector("#email").innerHTML = data.profile.email;
        let dateupd = data.profile.updatedAt;
        let d = new Date(dateupd);
        document.querySelector("#updated_at").innerHTML = d.toDateString();      
        let status = document.querySelector("#status");
        status.classList.add("status");
        status.innerHTML = data.profile.status.status;
        // status.class = "status-active"
        document.querySelector("#profile_id").innerHTML = data.profile._id;
        document.querySelector("#account_id").innerHTML =
          data.profile.accountId;
        document.querySelector("#address").value = data.profile.address;
        document.querySelector("#phone").value = data.profile.phone;
        document.querySelector("#location").value = data.profile.location;
        document.querySelector("#occupation").value =
          data.profile.occupation;
        data.profile.photo == null || undefined
          ? (document.querySelector("#photo").src = "/img/nopics.jpg")
          : (document.querySelector(
              "#photo"
            ).src = `/img/${data.profile.photo}`);
      } else {
        console.log(data.ok);
      }
    });
});


/* delete user */
const deleteProfile = document.querySelector("#deleteProfile");
deleteProfile.addEventListener("click", (e) => {
  e.preventDefault();
  let confirmDelete = confirm("Are you sure you want to execute this action?");
  if (confirmDelete) {
    fetch(`/user/${ID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ` + `${TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data.ok);
        if (!data.ok) {
          return alert(data.message);
        }
        alert(data.message);
        Redirect();
      });
  } else {
    alert("Action canceled");
  }
});

// logout user
const logoutUser = document.querySelector("#logoutUser");
logoutUser.addEventListener("click", (e) => {
  Redirect();
});
