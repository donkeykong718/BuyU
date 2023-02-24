//MAKE SURE TO GIVE CREDIT TO ZXING (https://github.com/zxing-js/library)
// import { MultiFormatReader, BarcodeFormat } from '@zxing/library';

const PROXY = 'https://cors-proxy-k7a5pa4az44r.runkit.sh'

const barcodeKey = "key=qcukoqhlmkagewubr21i7isnr46nt6";
const barcodeURL = `${PROXY}/api.barcodelookup.com/v3/products?`

const baseUrl = 'http://localhost:8080/';

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
  crudContainer.classList.remove("hidden");
});

// const returnButton = document.getElementById('returnButton')

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

  // console.log(`The searchUPC is ${searchUPC} which is a ${typeof searchUPC}`);
  // console.log(`The searchProduct is ${searchProduct} which is a ${typeof searchProduct}`);
  // console.log(`The searchManu is ${searchManu} which is a ${typeof searchManu}`);
  // console.log(`The searchUStatus is ${searchUStatus} which is a ${typeof searchUStatus}`);
  // console.log(`The searchUName is ${searchUName} which is a ${typeof searchUName}`);

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

  // console.log(`The search term is ${searchTerm}, which is a ${typeof searchTerm}`);

  const resultProduct = await searchProducts(searchTerm);
  // console.log(resultProduct);

  await displayProducts(resultProduct, "search");
  crudContainer.classList.add("hidden");
})

//CREATE FORM (CREATE)

const createform = document.getElementById('createform');

const newUPCinput = document.getElementById('createUPC');
const newProductinput = document.getElementById('createProduct');
const newManuinput = document.getElementById('createManu');
const newUStatusinput = document.getElementById('createUStatus');
const newUNameinput = document.getElementById('createUName');

const scanButton = document.getElementById('scanbutton');
const scanner = document.getElementById('scanner');

    // EMBEDDED SCANNER

scanButton.addEventListener('click', () => {
  scanButton.classList.add("hidden");
  scanner.classList.remove("hidden")
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

  if (newUStatus.toString().toUpperCase() === 'Y') {
    newUStatus = true;
  }
  if (newUStatus.toString().toUpperCase() === 'N') {
    newUStatus = false
  }

  if (newUStatus === true && (newUName === undefined || newUName === ""))
  {
    newUName = prompt("Please enter a Union Name");
    newUNameinput.required = true;
  }

  if (newUStatus === false && newUName !== undefined)
  {
    alert("You cannot have a Union Name for a non-union product");
    newUName = "";
  }

  const newDetails = {
    "UPC": newUPC,
    "productName": newProduct,
    "manufacturer": newManu,
    "isUnion": newUStatus,
    "unionName": newUName
  };

  const newEntry = await createProduct(newDetails);
  
  await displayProducts(newEntry, "create");
  crudContainer.classList.add("hidden");

})

//Basic product list display

const productList = await getProducts(baseUrl);
// console.log(productList);
await displayProducts(productList, "listDB");

async function displayProducts(productList, method) {

  if (method === "listDB") {
    const display = allProducts;
    display.innerHTML = "";
    selectContainer.classList.add("hidden")
    dbContainer.classList.remove("hidden");
    let hasButtons = true;

    for (let i = 0; i < productList.length; i++) {
      await displayProduct(productList[i], hasButtons, display)
    }
  }
  else {
    const display = selectProducts;
    selectProducts.innerHTML = "";
    selectContainer.classList.remove("hidden");
    dbContainer.classList.add("hidden");

    
    let hasButtons = true;

    switch (true) {
      case (method === "search"):
        selectHeader.textContent = "Search Results:"
        break;
      case (method === "create"):
        selectHeader.textContent = "New Entry Created:"
        break;
      case (method === "delete"):
        selectHeader.textContent = "Deleted Entry:"
        hasButtons = false;
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
    anchor.href = "http://localhost:8080/public";
    anchor.textContent = "Return to Database"
    selectProducts.appendChild(anchor);
  }
};

async function displayProduct(productList, hasButtons, display) {
  const { UPC, productName, manufacturer, isUnion, unionName } = productList

  const productCard = document.createElement('div');
  productCard.classList.add('productCard');
  display.appendChild(productCard);

  const objID = productList._id;

  // productCard.textContent = `The ${method} product is:`

      // const pObjID = document.createElement('p');
  const pUPC = document.createElement('p');
  const pName = document.createElement('p');
  const pManu = document.createElement('p');
  const pBoolean = document.createElement('p');
  const pUnion = document.createElement('p');

      // pObjID.textContent = productList[i]._id;
  pUPC.textContent = `UPC: ${ UPC }`;
  pName.textContent = `Product: ${ productName }`;
  pManu.textContent = `Manufacturer: ${ manufacturer }`;
  pBoolean.textContent = `Union made: ${ isUnion }`;
  pUnion.textContent = `Union: ${ unionName }`;

  productCard.appendChild(pUPC);
  productCard.appendChild(pName);
  productCard.appendChild(pManu);
  productCard.appendChild(pBoolean);
  productCard.appendChild(pUnion);

  if (hasButtons === true) {

    const deleteButton = document.createElement('button');
    deleteButton.textContent = `Delete`
    productCard.appendChild(deleteButton)

    deleteButton.addEventListener('click', async () => {
          
      const deletedProduct = await deleteProduct(objID);
      // console.log(deletedProduct);
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

  // console.log(`The objectID of the item to be edited is ${searchID}`);
  // console.log(typeof searchID);

  // console.log(isValidObjectId(searchID));

  const updateProduct = await searchProducts(searchID);
  // console.log(updateProduct);
  const { UPC, productName, manufacturer, isUnion, unionName } = updateProduct[0];

  // console.log(`The product to update has a UPC of ${UPC}, a productName of ${productName}, is made by ${manufacturer}, has a union status of ${isUnion} and ${unionName}`);

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
  // editUPC.style.display = "inline";
  // labelUPC.textContent = `Current UPC: ${UPC}`;

  const labelProduct = document.createElement('label')
  const editProduct = document.createElement('input');
  editProduct.setAttribute("id", "editProduct");
  editProduct.setAttribute("type", "text");
  editProduct.setAttribute("value", productName)
  // labelProduct.textContent = `Current Product: ${productName}\n`;
  
  const labelManu = document.createElement('label')
  const editManu = document.createElement('input');
  editManu.setAttribute("id", "editManu");
  editManu.setAttribute("type", "text");
  editManu.setAttribute("value", manufacturer);
  // labelManu.textContent = `Current Manufactuer: ${manufacturer}\n`;
  
  const labelUStatus = document.createElement('label')
  const editUStatus = document.createElement('input');
  editUStatus.setAttribute("id", "editUStatus");
  editUStatus.setAttribute("type", "text");
  editUStatus.setAttribute("pattern", "[Yy]|[Nn]|[Ff]alse|[Tt]rue")
  editUStatus.setAttribute("value", isUnion);
  // editUStatus.style.display = "inline";
  // labelUStatus.textContent = `Curent Union Status: ${isUnion}`;

  const labelUName = document.createElement('label')
  const editUName = document.createElement('input');
  editUName.setAttribute("id", "editUName");
  editUName.setAttribute("type", "text");
  editUName.setAttribute("value", unionName);
  // labelUName.textContent = `Current Union Name: ${unionName}`;

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
  
    if ((editUStatus === false || isUnion === false) && (editedUName !== undefined || editedUName !== "" || editedUName !== null))
    {
      alert("You cannot have a Union Name for a non-union product");
      editedUName = "";
    }

    // if (isNaN(editedUPC) === true) { editedUPC = UPC }
    // if (editedProduct === "") { editedProduct = productName }
    // if (editedManu === "") { editedManu = manufacturer }
    // if (editedUStatus === "") { editedUStatus = isUnion }
    // if (editedUName === "") { editedUName = unionName}

    const editDetails = {
      "UPC": editedUPC,
      "productName": editedProduct,
      "manufacturer": editedManu,
      "isUnion": editedUStatus,
      "unionName": editedUName
    };

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editDetails)
    }
  
    // const results =
      await fetch(`${baseUrl}${searchID}`, requestOptions);
    // const updatedEntry = await results.json();

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
  
  // console.log(`Searching for ${baseUrl}${searchTerm}`);

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
    const results = await fetch(`${barcodeURL}barcode=${barcode}&formatted=y&${barcodeKey}`)
    
    const json = await results.json();
    // const json = testData;
    console.log("This is the json")
    console.log(json);


    const productData = json.products[0];
    console.log("This is just the product data")
    console.log(productData);

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
  catch {
  }
}