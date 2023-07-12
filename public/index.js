//MAKE SURE TO GIVE CREDIT TO ZXING (https://github.com/zxing-js/library)

let loaded = false;

window.onload = sessionStorage.getItem("token");
if (sessionStorage.getItem("token") === null) {
  window.location.href = `/login.html`;
} else {
  loaded = true;
}

const wrapper = document.getElementsByClassName("wrapper")[0];

if (loaded) {
  wrapper.classList.remove("hidden");
}

// addEventListener("unload", (event) => {
//   console.log("Unloading");
//   sessionStorage.removeItem("user");
//   sessionStorage.removeItem("token");
// });

let currentPage = window.location.href;

const homeIndex = document.getElementById("homeindex");
const aboutIndex = document.getElementById("aboutindex");
const contactIndex = document.getElementById("contactindex");

if (homeIndex.href === currentPage) {
  homeIndex.classList.add("active-page");
}
if (aboutIndex == currentPage) {
  aboutIndex.classList.add("active-page");
}
if (contactIndex == currentPage) {
  contactIndex.classList.add("active-page");
}

let activeName = sessionStorage.getItem("user");

let currentUser = await getUser(activeName);
// console.log(currentUser);
// if (currentUser.length === 0) {
//   window.location.href = `/login.html`;
// } else {
//   currentUser = currentUser[0];
// }

const { userName, firstName, lastName, unionName, localName, title } =
  currentUser;
console.log(userName, firstName, lastName, unionName, localName, title);

const loggedIn = document.getElementById("loggedin");
loggedIn.textContent = `You are logged in as ${activeName}`;

const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  localStorage.removeItem("token");
  location.reload();
});

const baseUrl = "/api/products/";

const body = document.querySelector("body");

const dbContainer = document.getElementById("dbcontainer");
const dbHeader = document.getElementById("dbheader");
const allProducts = document.getElementById("allproducts");

const selectContainer = document.getElementById("selectcontainer");
const selectHeader = document.getElementById("selectheader");
const selectProducts = document.getElementById("selectproducts");

const createContainer = document.getElementById("createcontainer");
const crButton = document.getElementById("crButton");

const editContainer = document.getElementById("editcontainer");

crButton.addEventListener("click", () => {
  dbContainer.classList.add("hidden");
  createContainer.classList.remove("mobilehidden");
});

const unionList = await getUnions();
const unionArray = [];
for (const union of unionList) {
  unionArray.push(union.unionName.nickName);
}
unionArray.sort();
console.log(unionArray);

//SEARCH FORM (READ)

const searchform = document.getElementById("searchform");

const searchTypeselect = document.getElementById("searchtype");
const searchUPCinput = document.getElementById("searchupc");
const searchStringinput = document.getElementById("searchstring");
const searchUStatusselect = document.getElementById("searchstatus");
const searchUNameselect = document.getElementById("searchunion");

let nullOption = document.createElement("option");
nullOption.value = null;
nullOption.text = "(None)";
searchUNameselect.appendChild(nullOption);

for (const union of unionArray) {
  const selection = union;
  const option = document.createElement("option");
  option.value = selection;
  option.text = selection;
  searchUNameselect.appendChild(option);
}

searchform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  let searchTerm = undefined;

  const searchType =
    searchTypeselect.options[searchTypeselect.selectedIndex].value;

  const searchUPC = parseInt(searchUPCinput.value);
  const searchString = searchStringinput.value;
  const searchUStatus =
    searchUStatusselect.options[searchUStatusselect.selectedIndex].value;
  const searchUName =
    searchUNameselect.options[searchUNameselect.selectedIndex].value;

  console.log(searchUPC, searchString, searchUStatus, searchUName);

  console.log(`The selected search type is ${searchType}`);

  switch (searchType) {
    case "1":
      searchTerm = searchString;
      searchStringinput.classList.add("active");
      break;
    case "2":
      searchTerm = searchUPC;
      searchUPCinput.classList.add("active");
      break;
    case "3":
      searchTerm = searchUName;
      searchUNameselect.classList.add("active");
      break;
    case "4":
      searchTerm = searchUStatus;
      searchUStatusselect.classList.add("acitive");
      break;
  }

  console.log(`The search term is ${searchTerm}`);

  const resultProduct = await searchProducts(searchTerm);

  await displayProducts(resultProduct, "search");
  createContainer.classList.add("mobilehidden");
});

//CREATE FORM (CREATE)

const createform = document.getElementById("createform");

const newUPCinput = document.getElementById("createUPC");
const newProductinput = document.getElementById("createProduct");
const newManuinput = document.getElementById("createManu");
const newUStatusinput = document.getElementById("createUStatus");
const newUNameselect = document.getElementById("createUName");

newUStatusinput.setAttribute("value", true);

newUNameselect.innerHTML = "";

nullOption = document.createElement("option");
nullOption.value = null;
nullOption.text = "(None)";
newUNameselect.appendChild(nullOption);

for (const union of unionArray) {
  const selection = union;
  const option = document.createElement("option");
  option.value = selection;
  option.text = selection;
  if (selection === unionName) {
    option.setAttribute("selected", "selected");
  }
  newUNameselect.appendChild(option);
}

// EMBEDDED SCANNER

const scanButton = document.getElementById("scanbutton");
const scanner = document.getElementById("scanner");

scanButton.addEventListener("click", () => {
  scanButton.classList.add("hidden");
  scanner.classList.remove("hidden");
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement("option");
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        const sourceSelectPanel = document.getElementById("sourceSelectPanel");
        sourceSelectPanel.style.display = "block";
      }

      document.getElementById("startButton").addEventListener("click", () => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          async (result, err) => {
            if (result) {
              createform.reset();
              newUPCinput.setAttribute("value", result);
              const video = document.getElementById("video");
              video.style.border = "5px solid lightgreen";
              const successMessage = document.createElement("div");
              const messageDiv = document.getElementById("message");
              successMessage.textContent = "Scan successful";
              successMessage.style.color = "green";
              successMessage.style.fontWeight = "bold";
              messageDiv.appendChild(successMessage);

              //BARCODE SEARCH -- USE SPARINGLY

              const scannedDetails = await barcodeSearch(result.text);
              newProductinput.setAttribute("value", scannedDetails.productName);
              newManuinput.setAttribute("value", scannedDetails.manufacturer);
              console.log(result);
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err);
              document.getElementById("result").textContent = err;
            }
          }
        );
        console.log(
          `Started continous decode from camera with id ${selectedDeviceId}`
        );
      });

      document.getElementById("resetButton").addEventListener("click", () => {
        codeReader.reset();
        createform.reset();
        video.style.border = "1px solid gray";
        const messageDiv = document.getElementById("message");
        messageDiv.innerHTML = "";
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

createform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const newUPC = parseInt(newUPCinput.value);
  const newProduct = newProductinput.value;
  const newManu = newManuinput.value;
  let newUStatus = newUStatusinput.value;
  let newUName = newUNameselect.options[newUNameselect.selectedIndex].value;

  if (newUStatus.toString().toUpperCase() === "Y") {
    newUStatus = true;
  }
  if (newUStatus.toString().toUpperCase() === "N") {
    newUStatus = false;
  }

  if (newUStatus === true && (newUName === undefined || newUName === "")) {
    newUName = prompt("Please enter a Union Name");
  }

  if (newUStatus === false && newUName != undefined && newUName != "") {
    alert("You cannot have a Union Name for a non-union product");
    newUName = "";
  }

  const newDetails = {
    UPC: newUPC,
    productName: newProduct,
    manufacturer: newManu,
    isUnion: newUStatus,
    unionName: newUName,
    createdBy: userName,
  };

  newUPCinput.removeAttribute("value");
  newProductinput.removeAttribute("value");
  newManuinput.removeAttribute("value");
  newUStatusinput.removeAttribute("value");

  const newEntry = await createProduct(newDetails);

  await displayProducts(newEntry, "create");
  createContainer.classList.add("mobilehidden");
});

//Basic product list display

const productList = await getProducts(baseUrl);
await displayProducts(productList, "listDB");

async function displayProducts(productList, method) {
  let hasButtons = true;

  if (method === "listDB") {
    const display = allProducts;
    display.innerHTML = "";
    selectContainer.classList.add("hidden");
    dbContainer.classList.remove("hidden");

    for (let i = 0; i < productList.length; i++) {
      await displayProduct(productList[i], hasButtons, display);
    }
  } else {
    const display = selectProducts;
    selectProducts.innerHTML = "";
    selectContainer.classList.remove("hidden");
    dbContainer.classList.add("hidden");

    hasButtons = false;

    switch (true) {
      case method === "search":
        selectHeader.textContent = `${productList.length} Search Results:`;
        hasButtons = true;
        break;
      case method === "create":
        selectHeader.textContent = "New Entry Created:";
        break;
      case method === "delete":
        selectHeader.textContent = "Deleted Entry:";
        break;
      case method === "edit":
        selectHeader.textContent = "Updated Entry:";
        break;
    }

    if (productList.length === undefined) {
      displayProduct(productList, hasButtons, display);
    } else {
      for (let i = 0; i < productList.length; i++) {
        await displayProduct(productList[i], hasButtons, display);
      }
    }
  }

  const anchor = document.createElement("a");
  anchor.href = "/";
  anchor.textContent = "Return to Database";
  selectProducts.appendChild(anchor);
}

async function displayProduct(productList, hasButtons, display) {
  const {
    UPC,
    productName,
    manufacturer,
    isUnion,
    unionName,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  } = productList;

  const productCard = document.createElement("div");
  productCard.classList.add("productCard");
  display.appendChild(productCard);

  const objID = productList._id;

  const pUPC = document.createElement("p");
  const pName = document.createElement("p");
  const pManu = document.createElement("p");
  const pBoolean = document.createElement("p");
  const pUnion = document.createElement("p");
  const pCreated = document.createElement("p");
  const pUpdated = document.createElement("p");

  pUPC.textContent = `UPC: ${UPC}`;
  pName.textContent = `Product: ${productName}`;
  pManu.textContent = `Manufacturer: ${manufacturer}`;
  pBoolean.textContent = `Union made: ${isUnion}`;
  pUnion.textContent = `Union: ${unionName}`;

  productCard.appendChild(pUPC);
  productCard.appendChild(pName);
  productCard.appendChild(pManu);
  productCard.appendChild(pBoolean);
  productCard.appendChild(pUnion);

  if (!(createdAt == undefined)) {
    const parsedCreate = parseTime(createdAt);
    pCreated.textContent = `Entry created by user ${createdBy} on: ${parsedCreate} EST`;
    productCard.appendChild(pCreated);
  }

  if (!(updatedAt == undefined)) {
    const parsedUpdate = parseTime(updatedAt);
    pUpdated.textContent = `Last updated by user ${updatedBy} on: ${parsedUpdate} EST`;
    productCard.appendChild(pUpdated);
  }

  if (hasButtons === true) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = `Delete`;
    productCard.appendChild(deleteButton);

    deleteButton.addEventListener("click", async () => {
      const deletedProduct = await deleteProduct(objID);
      display.innerHTML = "";
      await displayProducts(deletedProduct, "delete");
    });

    const editButton = document.createElement("button");
    editButton.textContent = `Edit`;
    productCard.appendChild(editButton);

    editButton.addEventListener("click", async () => {
      await displayEditBox(objID);
    });
  }
}

async function displayEditBox(searchID) {
  const editClose = document.getElementById("editclose");
  editClose.addEventListener("click", () => {
    editContainer.classList.add("hidden");
  });

  const updateProduct = await searchProducts(searchID);
  const { UPC, productName, manufacturer, isUnion, unionName } =
    updateProduct[0];

  window.scrollTo(0, 0);

  editContainer.classList.remove("hidden");

  const editBox = document.getElementById(`editbox`);
  const editForm = document.getElementById("editform");
  const editUPC = document.getElementById("editupc");
  editUPC.setAttribute("value", UPC);

  const editProduct = document.getElementById("editproduct");
  editProduct.setAttribute("value", productName);
  const editManu = document.getElementById("editmanu");
  editManu.setAttribute("value", manufacturer);

  const editUStatus = document.getElementById("editstatus");
  editUStatus.setAttribute("value", isUnion);

  const editUName = document.getElementById("editunion");

  // const oldUName = document.createElement('p');

  // oldUName.textContent = `Union: ${unionName}`;
  // editForm.appendChild(oldUName);

  for (const union of unionArray) {
    const selection = union;
    const option = document.createElement("option");
    option.value = selection;
    option.text = selection;
    if (selection === unionName) {
      option.setAttribute("selected", "selected");
    }
    editUName.appendChild(option);
  }

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let editedUPC = parseInt(editUPC.value);
    let editedProduct = editProduct.value;
    let editedManu = editManu.value;
    let editedUStatus = editUStatus.value;
    let editedUName = editUName.options[editUName.selectedIndex].value;

    if (editedUStatus.toString().toUpperCase() === "Y") {
      editedUStatus = true;
    }
    if (editedUStatus.toString().toUpperCase() === "N") {
      editedUStatus = false;
    }

    if (
      (editedUStatus === true || isUnion === true) &&
      (editedUName == undefined || editedUName == "" || editedUName == null)
    ) {
      editedUName = prompt("Please enter a Union Name");
    }

    if (
      (editUStatus === false || isUnion === false) &&
      !(editedUName == undefined || editedUName == "" || editedUName == null)
    ) {
      alert("You cannot have a Union Name for a non-union product");
      editedUName = "";
    }

    const editDetails = {
      UPC: editedUPC,
      productName: editedProduct,
      manufacturer: editedManu,
      isUnion: editedUStatus,
      unionName: editedUName,
      updatedBy: userName,
    };

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDetails),
    };

    await fetch(`${baseUrl}${searchID}`, requestOptions);
    editContainer.classList.add("hidden");
    location.reload();
  });
}

//Seems like I'm just writing the controllers again?

async function getProducts() {
  const results = await fetch(baseUrl);
  const json = await results.json();
  return json;
}

async function searchProducts(searchTerm) {
  const results = await fetch(`${baseUrl}${searchTerm}`);
  const json = await results.json();
  return json;
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

async function deleteProduct(deleteTerm) {
  const results = await fetch(`${baseUrl}${deleteTerm}`, { method: "DELETE" });
  const json = await results.json();
  return json;
}

/// NEW API CALL

async function barcodeSearch(barcode) {
  try {
    const results = await fetch(`/api/scanner/${barcode}`);
    const json = await results.json();

    const productData = json.products[0];
    const scannedUPC = productData.barcode_number;
    const scannedProduct = productData.title;
    const scannedManu = productData.manufacturer;

    const scannedDetails = {
      UPC: scannedUPC,
      productName: scannedProduct,
      manufacturer: scannedManu,
    };

    return scannedDetails;
  } catch (error) {
    console.error(error);
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

async function getUser(userId) {
  const results = await fetch(`/api/users/${userId}`);
  const json = await results.json();
  console.log(json[0]);
  return json[0];
}

async function getUnions() {
  const results = await fetch(`/api/unions/`);
  const json = await results.json();
  return json;
}
