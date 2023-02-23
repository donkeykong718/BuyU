const baseUrl = 'http://localhost:8080/';

const body = document.querySelector('body');
const allproducts = document.getElementById('allproducts');
const header = document.getElementById('header');
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
  const searchUName = searchUNameinput.value;

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
})

//CREATE FORM (CREATE)

const createform = document.getElementById('createform');

const newUPCinput = document.getElementById('createUPC');
const newProductinput = document.getElementById('createProduct');
const newManuinput = document.getElementById('createManu');
const newUStatusinput = document.getElementById('createUStatus');
const newUNameinput = document.getElementById('createUName');

createform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const newUPC = parseInt(newUPCinput.value);
  const newProduct = newProductinput.value;
  const newManu = newManuinput.value;
  let newUStatus = newUStatusinput.value;
  const newUName = newUNameinput.value;

  if (newUStatus.toString().toUpperCase() === 'Y') { newUStatus = true }
  if (newUStatus.toString().toUpperCase() === 'N') { newUStatus = false }

  const newDetails = {
    "UPC": newUPC,
    "productName": newProduct,
    "manufacturer": newManu,
    "isUnion": newUStatus,
    "unionName": newUName
  };

  const newEntry = await createProduct(newDetails);
  
  await displayProducts(newEntry, "create");

})

//Basic product list display

const productList = await getProducts(baseUrl);
// console.log(productList);
await displayProducts(productList);

async function displayProducts(productList, method) {
  
  allproducts.innerHTML = "";
  let hasButtons = true;

  switch (true) {
    case (method === "search"):
      header.textContent = "Search Results:" 
      break;
    case (method === "create"):
      header.textContent = "New Entry Created:"
      hasButtons = false;
      break;
    case (method === "delete"):
      header.textContent = "Deleted Entry:"
      hasButtons = false;
      break;
    case (method === "edit"):
      header.textContent = "Updated Entry:"
      hasButtons = false;
      break;
    default:
      header.textContent = "Database Display"
      break;
  }

  if (productList.length === undefined) { displayProduct(productList, hasButtons)}
  else {
    for (let i = 0; i < productList.length; i++) {
      await displayProduct(productList[i], hasButtons)
    }
  }

  const anchor = document.createElement('a');
  anchor.href = "http://localhost:8080/public";
  anchor.textContent = "Return to Database"
  allproducts.appendChild(anchor);
};

async function displayProduct(productList, hasButtons) {
  const { UPC, productName, manufacturer, isUnion, unionName } = productList

  const productCard = document.createElement('div');
  productCard.classList.add('productCard');
  allproducts.appendChild(productCard);

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
  pBoolean.textContent = `Union made?: ${ isUnion }`;
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
      allproducts.innerHTML = "";
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

  allproducts.innerHTML = "";
  header.textContent = "Edit Entry:"

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
  editUStatus.setAttribute("pattern", "[Yy]|[Nn]")
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
  allproducts.appendChild(editBox);

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    let editedUPC = parseInt(editUPC.value);
    let editedProduct = editProduct.value;
    let editedManu = editManu.value;
    let editedUStatus = editUStatus.value;
    let editedUName = editUName.value;

    if (editedUStatus.toString().toUpperCase() === 'Y') { editedUStatus = true }
    if (editedUStatus.toString().toUpperCase() === 'N') { editedUStatus = false }

    if (isNaN(editedUPC) === true) { editedUPC = UPC }
    if (editedProduct === "") { editedProduct = productName }
    if (editedManu === "") { editedManu = manufacturer }
    if (editedUStatus === "") { editedUStatus = isUnion }
    if (editedUName === "") { editedUName = unionName}

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

