const baseUrl = "/api/users/";

const body = document.querySelector("body");

const loginContainer = document.getElementById("logincontainer");
const loginForm = document.getElementById("loginform");
const signupButton = document.getElementById("signupbutton");

const loginUserInput = document.getElementById("loginUser");
const loginPasswordInput = document.getElementById("loginPassword");

const displayContainer = document.getElementById("displaycontainer");
const signupContainer = document.getElementById("signupcontainer");

signupButton.addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginUser = loginUserInput.value;
  const loginPassword = loginPasswordInput.value;

  console.log(`Username: ` + loginUser + " and password: " + loginPassword);

  userLogin(loginUser, loginPassword);

  // const currentUser = await searchUsers(loginUser);
  // const errMsg = document.createElement("p");
  // errMsg.classList.add("errormsg");
  // errMsg.style.color = "red";
  // errMsg.style.fontWeight = "bold";
  // const oldErrMsg = document.querySelector(".errormsg");
  // if (oldErrMsg) {
  //   oldErrMsg.parentNode.removeChild(oldErrMsg);
  // }

  // if (currentUser.length === 0) {
  //   errMsg.textContent =
  //     "No user by that name was found. Please create an account.";
  //   loginContainer.appendChild(errMsg);
  // } else {
  //   const correctUser = currentUser[0];
  // console.log(correctUser);
  // let correctPassword = correctUser.password;
  // console.log(correctPassword);
  // if (loginPassword != correctPassword) {
  //   errMsg.textContent = "Password is incorrect. Please try again.";
  //   loginContainer.appendChild(errMsg);
  // } else {
  //   console.log(correctUser._id);
  //   localStorage.setItem("currentUser", correctUser._id);
  //   console.log("The password was correct");
  //   window.location.href = `/index.html`;
  // }
  // }
});

const unionList = await getUnions();
const unionArray = [];
for (const union of unionList) {
  unionArray.push(union.unionName.nickName);
}
unionArray.sort();
console.log(unionArray);

const signupForm = document.getElementById("signupform");

const userNameInput = document.getElementById("userName");
const passwordInput = document.getElementById("password");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const eMailInput = document.getElementById("eMail");
const unionSelect = document.getElementById("unionName");
const localInput = document.getElementById("localName");
const titleInput = document.getElementById("title");

unionSelect.innerHTML = "";

const nullOption = document.createElement("option");
nullOption.value = null;
nullOption.text = "(None)";
unionSelect.appendChild(nullOption);

for (const union of unionArray) {
  const selection = union;
  const option = document.createElement("option");
  option.value = selection;
  option.text = selection;
  unionSelect.appendChild(option);
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = userNameInput.value;
  const password = passwordInput.value;
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const eMail = eMailInput.value;
  const unionName = unionSelect.options[unionSelect.selectedIndex].value;
  const localName = localInput.value;
  const title = titleInput.value;

  console.log(`The unionName is ${unionName}`);

  const newDetails = {
    userName: userName,
    password: password,
    firstName: firstName,
    lastName: lastName,
    eMail: eMail,
    unionName: unionName,
    localName: localName,
    title: title,
  };

  createUser(newDetails);

  // const duplicateUser = await searchUsers(userName);
  // const duplicateEmail = await searchUsers(eMail);
  // console.log(duplicateUser.length);

  // const oldErrMsg = document.querySelector(".errormsg");
  // if (oldErrMsg) {
  //   oldErrMsg.parentNode.removeChild(oldErrMsg);
  // }

  // if (duplicateUser.length > 0) {
  //   const errMsg = document.createElement("p");
  //   errMsg.classList.add("errormsg");

  //   errMsg.style.color = "red";
  //   errMsg.style.fontWeight = "bold";
  //   errMsg.textContent = "That username is already taken. Please try another.";
  //   signupContainer.appendChild(errMsg);
  // }
  // else if (duplicateEmail.length > 0) {
  //   const errMsg = document.createElement("p");
  //   errMsg.style.color = "red";
  //   errMsg.style.fontWeight = "bold";
  //   errMsg.textContent =
  //     "An account with that e-mail already exists. Please try another.";
  //   signupContainer.appendChild(errMsg);
  // }
  // else await displayUser(newDetails, false);
});

async function createUser(userDetails) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  };

  // const results = await fetch("/api/auth/signup", requestOptions);
  // const newUser = await results.json();
  // console.log(newUser);

  fetch("/api/auth/signup", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("The response data is:");
      console.log(data);

      // Extract the token from the response data
      const token = data.token;
      const authUser = data.newUser;

      console.log("The token is: " + token);
      console.log("The authorized User is: ");
      console.log(authUser);

      localStorage.setItem("token", token);
      localStorage.setItem("user", authUser.userName);
      window.location.href = `/index.html`;

      // Further processing or actions with the token
      // ...
    })
    .catch((error) => {
      console.log("An error occurred:");
      console.log(error);
    });
  // return newUser;
}

async function displayUser(userDetails, confirmed) {
  signupContainer.classList.add("hidden");
  displayContainer.innerHTML = "";
  displayContainer.classList.remove("hidden");

  const userCard = document.createElement("div");
  userCard.classList.add("userCard");
  displayContainer.appendChild(userCard);

  if (confirmed === true) {
    console.log(`Display User has started the second time`);
    const objID = userDetails._id;
    console.log(objID);
    const newUser = await searchUsers(objID);
    userDetails = newUser[0];
    const userHeader = document.createElement("div");
    userHeader.textContent = "A new user has been created:";
    userCard.appendChild(userHeader);

    const loginLink = document.createElement("a");
    loginLink.href = `/login.html`;
    loginLink.textContent = "Click to Log-In";
    userCard.appendChild(loginLink);
  }

  const {
    userName,
    password,
    firstName,
    lastName,
    eMail,
    unionName,
    localName,
    title,
    createdAt,
    updatedAt,
  } = userDetails;

  const p1 = document.createElement("p");
  const p2 = document.createElement("p");
  const p3 = document.createElement("p");
  const p4 = document.createElement("p");
  const p5 = document.createElement("p");
  const p6 = document.createElement("p");
  const p7 = document.createElement("p");

  p1.textContent = `Username: ${userName}`;
  p2.textContent = `Password: ${password}`;
  p3.textContent = `Name: ${firstName} ${lastName}`;
  p4.textContent = `E-mail: ${eMail}`;
  p5.textContent = `Union: ${unionName}`;
  p6.textContent = `Local: ${localName}`;
  p7.textContent = `Title/Role: ${title}`;

  userCard.appendChild(p1);
  userCard.appendChild(p2);
  userCard.appendChild(p3);
  userCard.appendChild(p4);
  userCard.appendChild(p5);
  userCard.appendChild(p6);
  userCard.appendChild(p7);

  if (!(createdAt == undefined)) {
    const p8 = document.createElement("p");
    const parsedCreate = parseTime(createdAt);
    p8.textContent = `Entry created on: ${parsedCreate} EST`;
    userCard.appendChild(p8);
  }

  if (!(updatedAt == undefined)) {
    const p9 = document.createElement("p");
    const parsedUpdate = parseTime(updatedAt);
    p9.textContent = `Last update on: ${parsedUpdate} EST`;
    userCard.appendChild(p9);
  }

  if (confirmed === false) {
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    userCard.appendChild(confirmButton);

    confirmButton.addEventListener("click", async () => {
      const newUser = await createUser(userDetails);
      await displayUser(newUser, true);
    });

    const editButton = document.createElement("button");
    editButton.textContent = `Edit`;
    userCard.appendChild(editButton);

    editButton.addEventListener("click", async () => {
      displayContainer.classList.add("hidden");
      signupContainer.classList.remove("hidden");
    });
  }
}

function parseTime(rawDate) {
  const tIndex = rawDate.indexOf("T");
  const zIndex = rawDate.indexOf(".");
  const hIndex = rawDate.indexOf(":");

  const date = rawDate.slice(0, tIndex);
  let time = rawDate.slice(tIndex + 1, zIndex);
  const hour = parseInt(rawDate.slice(tIndex + 1, hIndex));
  let estHour = hour - 5;
  let amPM = "AM";

  if (estHour > 12) {
    estHour = estHour - 12;
    amPM = "PM";
  } else if ((estHour = 12)) {
    amPM = "PM";
  }
  time = time.replace(hour.toString(), estHour.toString());

  const parsedDate = `${date} at ${time} ${amPM}`;
  return parsedDate;
}

async function searchUsers(searchTerm) {
  console.log(`Search Users has begun with searchTerm ${searchTerm}`);

  const results = await fetch(`${baseUrl}${searchTerm}`);
  const json = await results.json();
  console.log(json);
  return json;
}

async function userLogin(username, password) {
  console.log("User login has been called");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };
  console.log(requestOptions);

  fetch("/api/auth/signin", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("The response data is:");
      console.log(data);

      // Extract the token from the response data
      const token = data.token;
      const authUser = data.user;

      console.log("The token is: " + token);
      console.log("The authorized User is: ");
      console.log(authUser);

      localStorage.setItem("token", token);
      localStorage.setItem("user", authUser.userName);
      window.location.href = `/index.html`;

      // Further processing or actions with the token
      // ...
    })
    .catch((error) => {
      console.log("An error occurred:");
      console.log(error);
    });
}

async function createProduct(newDetails) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newDetails),
  };

  const results = await fetch(baseUrl, requestOptions);
  const json = await results.json();
  return json;
}

async function getUnions() {
  const results = await fetch(`/api/unions/`);
  const json = await results.json();
  return json;
}
