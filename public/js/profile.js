const fileUpload = document.querySelector(".upload");
const uploadBtn = document.querySelector(".upload-btn");
const uploadProgress = document.querySelector(".upload_progress");
const profileImage = document.querySelector(".pics");

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
  let TOKEN = localStorage.getItem("token");
  let ID = localStorage.getItem("userId");
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
        console.log(data.data.photo.path);
        // profileImage.setAttribute('src', `${data.data.photo.filename}`)
        profileImage.src = `${data.data.photo.path}`;
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
window.addEventListener("load", () => {
  let TOKEN = localStorage.getItem("token");
  let ID = localStorage.getItem("userId");
  console.log({ storageToken: TOKEN });
  fetch(`/user/profile/${ID}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + `${TOKEN}`,
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
        console.log(data.profile)
        console.log(data.profile.name)
        document.querySelector("#username").innerHTML = data.profile.name;
        document.querySelector("#email").innerHTML = data.profile.email;
        document.querySelector("#updated_at").innerHTML = data.profile.updatedAt;
        document.querySelector("#status").innerHTML = data.status;
        document.querySelector("#profile_id").innerHTML = data.profile.id;
        document.querySelector("#account_id").innerHTML = data.profile.accountId;
        document.querySelector("#address").innerHTML = data.profile.address;
        document.querySelector("#phone").innerHTML = data.profile.phone;
        document.querySelector("#location").innerHTML = data.profile.location;
        document.querySelector("#occupation").innerHTML = data.profile.occupation;
        document.querySelector("#photo").src = `/img/${data.profile.photo.filename}` || null;
      } else {
        console.log(data.ok);
      }
    })
});
