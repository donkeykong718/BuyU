//MAKE SURE TO GIVE CREDIT TO ZXING (https://github.com/zxing-js/library)
// process.env.BARCODE_KEY;

window.onload = localStorage.getItem("currentUser");
// const currentUserID = localStorage.getItem("currentUser");
// sessionStorage.setItem("currentUser", currentUserID);
// localStorage.removeItem("currentUser");

let currentUser = await getUser(localStorage.currentUser)
console.log(currentUser);
if (currentUser.length === 0) {
  window.location.href = `http://localhost:3000/login.html`
}
else { currentUser = currentUser[0] };

const { userName, firstName, lastName, unionName, localName, title } = currentUser;
console.log(userName, firstName, lastName, unionName, localName, title);

const loggedIn = document.getElementById('loggedin');
loggedIn.textContent = `You are logged in as ${userName}`;

const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.reload();
})


const PROXY = 'https://cors-proxy-k7a5pa4az44r.runkit.sh'
const barcodeURL = `${PROXY}/api.barcodelookup.com/v3/products?`

const baseUrl = '/api/products/';

const body = document.querySelector('body');

const dbContainer = document.getElementById('dbcontainer');
const dbHeader = document.getElementById('dbheader');
const allProducts = document.getElementById('allproducts');

const selectContainer = document.getElementById('selectcontainer');
const selectHeader = document.getElementById('selectheader');
const selectProducts = document.getElementById('selectproducts');

const crudContainer = document.getElementById('crudcontainer');
const crButton = document.getElementById('crButton');

crButton.addEventListener('click', () => {
  dbContainer.classList.add("hidden");
  crudContainer.classList.remove("mobilehidden");
});

//SEARCH FORM (READ)

const searchform = document.getElementById('searchform');

const searchUPCinput = document.getElementById('searchUPC');
const searchProductinput = document.getElementById('searchProduct');
const searchManuinput = document.getElementById('searchManu');
const searchUStatusinput = document.getElementById('searchUStatus');
const searchUNameinput = document.getElementById('searchUName');

searchform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  let searchTerm = undefined

  const searchUPC = parseInt(searchUPCinput.value);
  const searchProduct = searchProductinput.value;
  const searchManu = searchManuinput.value;
  let searchUStatus = searchUStatusinput.value;
  let searchUName = searchUNameinput.value;

  if (searchUStatus.toString().toUpperCase() == 'Y') { searchUStatus = true }
  if (searchUStatus.toString().toUpperCase() == 'N') { searchUStatus = false }

  switch(false) {
    case (isNaN(searchUPC)):
      searchTerm = searchUPC;
      break;
    case (searchProduct === ""):
      searchTerm = searchProduct;
      break;
    case (searchManu === ""):
      searchTerm = searchManu;
      break;
    case (searchUStatus === ""):
        searchTerm = searchUStatus;
      break;
    case (searchUName === ""):
        searchTerm = searchUName;
        break;
  };

  const resultProduct = await searchProducts(searchTerm);

  await displayProducts(resultProduct, "search");
  crudContainer.classList.add("mobilehidden");
})


//CREATE FORM (CREATE)

const createform = document.getElementById('createform');

const newUPCinput = document.getElementById('createUPC');
const newProductinput = document.getElementById('createProduct');
const newManuinput = document.getElementById('createManu');
const newUStatusinput = document.getElementById('createUStatus');
const newUNameinput = document.getElementById('createUName');
newUStatusinput.setAttribute("value", true);
newUNameinput.setAttribute("value", unionName);


    // EMBEDDED SCANNER

const scanButton = document.getElementById('scanbutton');
const scanner = document.getElementById('scanner');
    
scanButton.addEventListener('click', () => {
  scanButton.classList.add("hidden");
  scanner.classList.remove("hidden");
  let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect')
        selectedDeviceId = videoInputDevices[0].deviceId
        if (videoInputDevices.length >= 1) {
            videoInputDevices.forEach((element) => {
              const sourceOption = document.createElement('option')
              sourceOption.text = element.label
              sourceOption.value = element.deviceId
              sourceSelect.appendChild(sourceOption)
              })
  
              sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value;
              };
  
              const sourceSelectPanel = document.getElementById('sourceSelectPanel')
              sourceSelectPanel.style.display = 'block'
            }
  
  document.getElementById('startButton').addEventListener('click', () => {
      codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', async (result, err) => {
        if (result) {
            newUPCinput.setAttribute("value", result);
            const video = document.getElementById("video");
            video.style.border = "5px solid lightgreen"
            const successMessage = document.createElement('div');
            const messageDiv = document.getElementById('message');
            successMessage.textContent = "Scan successful"
            successMessage.style.color = "green"
            successMessage.style.fontWeight = "bold"
            messageDiv.appendChild(successMessage)
              
    //BARCODE SEARCH -- USE SPARINGLY 
                  
            // const scannedDetails = await barcodeSearch(result.text);
            // newProductinput.setAttribute("value", scannedDetails.productName)
            // newManuinput.setAttribute("value",scannedDetails.manufacturer)
            // console.log(result)
            // document.getElementById('result').textContent = result.text
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err)
              document.getElementById('result').textContent = err
            }
      })
        console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
      })
  
      document.getElementById('resetButton').addEventListener('click', () => {
        codeReader.reset()
        document.getElementById('result').textContent = '';
        console.log('Reset.')
      })
        
    })
    .catch((err) => {
    console.error(err)
    })
});

createform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const newUPC = parseInt(newUPCinput.value);
  const newProduct = newProductinput.value;
  const newManu = newManuinput.value;
  let newUStatus = newUStatusinput.value;
  let newUName = newUNameinput.value;

  if (newUStatus.toString().toUpperCase() === 'Y') { newUStatus = true };
  if (newUStatus.toString().toUpperCase() === 'N') { newUStatus = false };

  if (newUStatus === true && (newUName === undefined || newUName === ""))
  { newUName = prompt("Please enter a Union Name") };

  if (newUStatus === false && (newUName != undefined && newUName !="")) {
    alert("You cannot have a Union Name for a non-union product");
    newUName = ""
  };

  const newDetails = {
    "UPC": newUPC,
    "productName": newProduct,
    "manufacturer": newManu,
    "isUnion": newUStatus,
    "unionName": newUName,
    "createdBy": userName
  };

  newUPCinput.removeAttribute("value")   
  newProductinput.removeAttribute("value")
  newManuinput.removeAttribute("value")
  newUStatusinput.removeAttribute("value")
  newUNameinput.removeAttribute("value")

  const newEntry = await createProduct(newDetails);
  
  await displayProducts(newEntry, "create");
  crudContainer.classList.add("mobilehidden");

})

//Basic product list display

const productList = await getProducts(baseUrl);
await displayProducts(productList, "listDB");

async function displayProducts(productList, method) {

let hasButtons = true;

  if (method === "listDB") {
    const display = allProducts;
    display.innerHTML = "";
    selectContainer.classList.add("hidden")
    dbContainer.classList.remove("hidden");
  
    for (let i = 0; i < productList.length; i++) {
      await displayProduct(productList[i], hasButtons, display)
    }
  }
  else {
    const display = selectProducts;
    selectProducts.innerHTML = "";
    selectContainer.classList.remove("hidden");
    dbContainer.classList.add("hidden");   
    
    hasButtons = false;

    switch (true) {
      case (method === "search"):
        selectHeader.textContent = "Search Results:"
        hasButtons = true;
        break;
      case (method === "create"):
        selectHeader.textContent = "New Entry Created:"
         break;
      case (method === "delete"):
        selectHeader.textContent = "Deleted Entry:"
        break;
      case (method === "edit"):
        selectHeader.textContent = "Updated Entry:"
        break;
    }

    if (productList.length === undefined) { displayProduct(productList, hasButtons, display) }
    else {
      for (let i = 0; i < productList.length; i++) {
        await displayProduct(productList[i], hasButtons, display)
      }
    }

    const anchor = document.createElement('a');
    anchor.href = "/";
    anchor.textContent = "Return to Database"
    selectProducts.appendChild(anchor);
  }
};

async function displayProduct(productList, hasButtons, display) {
  const { UPC, productName, manufacturer, isUnion, unionName, createdBy, updatedBy, createdAt, updatedAt } = productList

  const productCard = document.createElement('div');
  productCard.classList.add('productCard');
  display.appendChild(productCard);

  const objID = productList._id;

  const pUPC = document.createElement('p');
  const pName = document.createElement('p');
  const pManu = document.createElement('p');
  const pBoolean = document.createElement('p');
  const pUnion = document.createElement('p');
  const pCreated = document.createElement('p');
  const pUpdated = document.createElement('p');
 
  pUPC.textContent = `UPC: ${ UPC }`;
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
    pCreated.textContent = `Entry created by user ${createdBy} on: ${parsedCreate} EST`
    productCard.appendChild(pCreated)
  }

  if (!(updatedAt == undefined)) {
    const parsedUpdate = parseTime(updatedAt);
    pUpdated.textContent = `Last updated by user ${updatedBy} on: ${parsedUpdate} EST`
    productCard.appendChild(pUpdated); }

  if (hasButtons === true) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = `Delete`
    productCard.appendChild(deleteButton)

    deleteButton.addEventListener('click', async () => {          
      const deletedProduct = await deleteProduct(objID);
      display.innerHTML = "";
      await displayProducts(deletedProduct, "delete");
    })
  
    const editButton = document.createElement('button');
    editButton.textContent = `Edit`
    productCard.appendChild(editButton)

    editButton.addEventListener('click', async () => {
      await displayEditBox(objID);
    })
  }
};

async function displayEditBox(searchID) {

  const updateProduct = await searchProducts(searchID);
  const { UPC, productName, manufacturer, isUnion, unionName } = updateProduct[0];

  selectContainer.classList.remove("hidden");
  dbContainer.classList.add("hidden");

  selectProducts.innerHTML = "";
  selectHeader.textContent = "Edit Entry:"

  const editBox = document.createElement(`div`);
  editBox.classList.add("productCard");

  const editForm = document.createElement('form');
  editForm.setAttribute("id", "editform");

  const labelUPC = document.createElement('label')
  const editUPC = document.createElement('input');
  editUPC.setAttribute("id", "editUPC");
  editUPC.setAttribute("minlength", "12");
  editUPC.setAttribute("maxlength", "12"); 
  editUPC.setAttribute("value", UPC)

  const labelProduct = document.createElement('label')
  const editProduct = document.createElement('input');
  editProduct.setAttribute("id", "editProduct");
  editProduct.setAttribute("type", "text");
  editProduct.setAttribute("value", productName)
  
  const labelManu = document.createElement('label')
  const editManu = document.createElement('input');
  editManu.setAttribute("id", "editManu");
  editManu.setAttribute("type", "text");
  editManu.setAttribute("value", manufacturer);
  
  const labelUStatus = document.createElement('label')
  const editUStatus = document.createElement('input');
  editUStatus.setAttribute("id", "editUStatus");
  editUStatus.setAttribute("type", "text");
  editUStatus.setAttribute("pattern", "[Yy]|[Nn]|[Ff]alse|[Tt]rue")
  editUStatus.setAttribute("value", isUnion);

  const labelUName = document.createElement('label')
  const editUName = document.createElement('input');
  editUName.setAttribute("id", "editUName");
  editUName.setAttribute("type", "text");
  editUName.setAttribute("value", unionName);

  const submitEdit = document.createElement('button')
  submitEdit.textContent = "Submit Edit"

  editForm.appendChild(labelUPC);
  editForm.appendChild(editUPC);
  labelUPC.textContent = "UPC: ";

  editForm.appendChild(labelProduct);
  editForm.appendChild(editProduct);
  labelProduct.textContent ="Product Name: ";

  editForm.appendChild(labelManu);
  editForm.appendChild(editManu);
  labelManu.textContent = "Manufacturer: ";

  editForm.appendChild(labelUStatus);
  editForm.appendChild(editUStatus);
  labelUStatus.textContent = "Union Status (Y/N): ";

  editForm.appendChild(labelUName);
  editForm.appendChild(editUName);
  labelUName.textContent = "Union Name: ";

  editForm.appendChild(submitEdit);

  editBox.appendChild(editForm);
  selectProducts.appendChild(editBox);

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    let editedUPC = parseInt(editUPC.value);
    let editedProduct = editProduct.value;
    let editedManu = editManu.value;
    let editedUStatus = editUStatus.value;
    let editedUName = editUName.value;

    if (editedUStatus.toString().toUpperCase() === 'Y') { editedUStatus = true }
    if (editedUStatus.toString().toUpperCase() === 'N') { editedUStatus = false }

    if ((editedUStatus === true || isUnion === true) && (editedUName == undefined || editedUName == "" || editedUName == null))
    {editedUName = prompt("Please enter a Union Name");}
  
    if ((editUStatus === false || isUnion === false) && !(editedUName == undefined || editedUName == "" || editedUName == null))
    {
      alert("You cannot have a Union Name for a non-union product");
      editedUName = "";
    }

    const editDetails = {
      "UPC": editedUPC,
      "productName": editedProduct,
      "manufacturer": editedManu,
      "isUnion": editedUStatus,
      "unionName": editedUName,
      "updatedBy": userName
    };

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editDetails)
    }
  
    await fetch(`${baseUrl}${searchID}`, requestOptions);

    const updatedEntry = await searchProducts(searchID);

    await displayProducts(updatedEntry, "edit");
  })
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDetails)
  }

  const results = await fetch(baseUrl, requestOptions);
  const json = await results.json();
  return json;
}

async function deleteProduct(deleteTerm) {
  const results = await fetch(`${baseUrl}${deleteTerm}`, { method: 'DELETE' });
  const json = await results.json();
  return json;
}


/// NEW API CALL

async function barcodeSearch(barcode) {
  try {
    // console.log('The barcode search has begun');
    const results = await fetch(`${barcodeURL}barcode=${barcode}&formatted=y&key=${barcodeKey}`)
    
    const json = await results.json();
    const productData = json.products[0];
    const scannedUPC = productData.barcode_number;
    const scannedProduct = productData.title;
    const scannedManu = productData.manufacturer;

    const scannedDetails = {
      "UPC": scannedUPC,
      "productName": scannedProduct,
      "manufacturer": scannedManu,
    };

    return scannedDetails;

    // const { barcode_number, title, manufacturer } = productData;
    // console.log("These are the destructured variables")
    // console.log(barcode_number, title, manufacturer);    

    // console.log("These are the scan variables")
    // console.log(scannedUPC, scannedProduct, scannedManu);

  }
  catch (error) {
    console.error(error);
  }
}


function parseTime(rawDate) {
    const tIndex = rawDate.indexOf('T');
    const zIndex = rawDate.indexOf('.');
    const hIndex = rawDate.indexOf(':');

    const date = rawDate.slice(0, (tIndex))
    let time = rawDate.slice(tIndex + 1, zIndex); 
    const hour = parseInt(rawDate.slice(tIndex + 1, hIndex));
    let estHour = hour - 5;
    let amPM = "AM";

    if (estHour > 12) {
      estHour = estHour - 12;
      amPM = "PM";
    }
    else if (estHour = 12) {
      amPM = "PM"
    };
  time = time.replace(hour.toString(), estHour.toString());

  const parsedDate = `${date} at ${time} ${amPM}`
  return parsedDate;
};

async function getUser(userId) {
  const results = await fetch(`/api/users/${userId}`);
  const json = await results.json();
  console.log(json);
  return json;
}