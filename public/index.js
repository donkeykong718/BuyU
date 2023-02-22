const baseUrl = 'http://localhost:8080/';

const body = document.querySelector('body');
const allproducts = document.getElementById('allproducts');
const header = document.getElementById('header');

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

  if (searchUStatus === `Y`) { searchUStatus = true }
  if (searchUStatus === 'N') { searchUStatus = false }

  console.log(`The searchUPC is ${searchUPC} which is a ${typeof searchUPC}`);
  console.log(`The searchProduct is ${searchProduct} which is a ${typeof searchProduct}`);
  console.log(`The searchManu is ${searchManu} which is a ${typeof searchManu}`);
  console.log(`The searchUStatus is ${searchUStatus} which is a ${typeof searchUStatus}`);
  console.log(`The searchUName is ${searchUName} which is a ${typeof searchUName}`);


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

  console.log(`The search term is ${searchTerm}, which is a ${typeof searchTerm}`);

  const resultProduct = await searchProducts(searchTerm);
  console.log(resultProduct);

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

  if (newUStatus === `Y`) { newUStatus = true }
  if (newUStatus === 'N') { newUStatus = false }

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

////EDIT FORM (UPDATE)

const editform = document.getElementById('editform');

const editUPCinput = document.getElementById('editUPC');
const editProductinput = document.getElementById('editProduct');
const editManuinput = document.getElementById('editManu');
const editUStatusinput = document.getElementById('editUStatus');
const editUNameinput = document.getElementById('editUName');

editform.addEventListener(`submit`, async (e) => {
  e.preventDefault();

  const searchUPC = parseInt(editUPCinput.value);

  const editProduct = editProductinput.value;
  const editManu = editManuinput.value;
  let editUStatus = editUStatusinput.value;
  const editUName = editUNameinput.value;

  if ( editUStatus === `Y`) { editUStatus = true }
  if ( editUStatus === 'N') { editUStatus = false }

  const editDetails = {
    "productName": editProduct,
    "manufacturer": editManu,
    "isUnion": editUStatus,
    "unionName": editUName
  };

  const updatedEntry = await updateProduct(searchUPC, editDetails);

  await displayProducts(updatedEntry, "edit");
})

// DELETE FORM (DELETE)

// const deleteform = document.getElementById('deleteform');
// const deleteinput = document.getElementById('delete');

// deleteform.addEventListener(`submit`, async (e) => {
//   e.preventDefault();
//   const deleteTerm = deleteinput.value;

//   console.log(`The UPC to delete is ${deleteTerm}`);

//   const deletedProduct = await deleteProducts(deleteTerm);
//   console.log(deletedProduct);

//   await displayProduct(deletedProduct, "deleted");
// })


//Basic product list display

const productList = await getProducts(baseUrl);
console.log(productList);
await displayProducts(productList);

async function displayProducts(productList, method) {
  
  allproducts.innerHTML = "";

  switch (true) {
    case (method === "search"):
      header.textContent = "Search Results:" 
      break;
    case (method === "create"):
      header.textContent = "New Entry Created:"
      break;
    case (method === "delete"):
      header.textContent = "Deleted Entry:"
      break;
    case (method === "edit"):
      header.textContent = "Updated Entry:"
      break;
    default:
      header.textContent = "Database Display"
      break;
  }

  if (productList.length === undefined) { displayProduct(productList) }
  else {
    for (let i = 0; i < productList.length; i++) {
      await displayProduct(productList[i])
      
      // const { UPC, productName, manufacturer, isUnion, unionName } = productList[i]
      // const productCard = document.createElement('div');
      // productCard.classList.add('productCard');
      // allproducts.appendChild(productCard);

      // const objID = productList[i]._id;
      // console.log(objID);

      // // const pObjID = document.createElement('p');
      // const pUPC = document.createElement('p');
      // const pName = document.createElement('p');
      // const pManu = document.createElement('p');
      // const pBoolean = document.createElement('p');
      // const pUnion = document.createElement('p');

      // // pObjID.textContent = productList[i]._id;
      // pUPC.textContent = `UPC: ${ UPC }`;
      // pName.textContent = `Product: ${ productName }`;
      // pManu.textContent = `Manufacturer: ${ manufacturer }`;
      // pBoolean.textContent = `Union made?: ${ isUnion }`;
      // pUnion.textContent = `Union: ${ unionName }`;

      // productCard.appendChild(pUPC);
      // productCard.appendChild(pName);
      // productCard.appendChild(pManu);
      // productCard.appendChild(pBoolean);
      // productCard.appendChild(pUnion);

      // const deleteButton = document.createElement('button');
      // deleteButton.textContent = `Delete`
      // productCard.appendChild(deleteButton)

      // deleteButton.addEventListener('click', async () => {                
          
      //   const deletedProduct = await deleteProduct(objID);
      //     console.log(deletedProduct);
      //     await displayProduct(deletedProduct, "deleted");
      //   })
    }
  }
};

async function displayProduct(productList) {
  const { UPC, productName, manufacturer, isUnion, unionName } = productList

  const productCard = document.createElement('div');
  productCard.classList.add('productCard');
  allproducts.appendChild(productCard);

  const objID = productList._id;
  // console.log(objID);

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

  const deleteButton = document.createElement('button');
  deleteButton.textContent = `Delete`
  productCard.appendChild(deleteButton)

  deleteButton.addEventListener('click', async () => {                
          
    const deletedProduct = await deleteProduct(objID);
    console.log(deletedProduct);
    allproducts.innerHTML = "";
    await displayProducts(deletedProduct, "delete");
    })
};


//Seems like I'm just writing the controllers again?

async function getProducts() {
  const results = await fetch(baseUrl);
  const json = await results.json();
  return json;
}

async function searchProducts(searchTerm) {
  
  console.log(`Searching for ${baseUrl}${searchTerm}`);

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

async function updateProduct(searchUCP, updateDetails) {

  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateDetails)
  }

  const results = await fetch(`${baseUrl}${searchUCP}`, requestOptions);
  const json = await results.json();
  return json;
}

async function deleteProduct(deleteTerm) {
  const results = await fetch(`${baseUrl}${deleteTerm}`, { method: 'DELETE' });
  const json = await results.json();
  return json;
}

