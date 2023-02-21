const baseUrl = 'http://localhost:8080/';

const body = document.querySelector('body');
const allproducts = document.getElementById('allproducts');

//SEARCH FORM (READ)

const searchform = document.getElementById('searchform');
const searchinput = document.getElementById('search');

searchform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const searchTerm = searchinput.value;

  console.log(`The search term is ${searchTerm}, which is a ${typeof searchTerm}`);

  const resultProduct = await searchProducts(searchTerm);
  console.log(resultProduct);

  await displayProducts(resultProduct);
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
  
  await displayProduct(newEntry, "created");

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

  await displayProduct(updatedEntry, "updated");
})

// DELETE FORM (DELETE)

const deleteform = document.getElementById('deleteform');
const deleteinput = document.getElementById('delete');

deleteform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const deleteTerm = deleteinput.value;

  console.log(`The UPC to delete is ${deleteTerm}`);

  const deletedProduct = await deleteProducts(deleteTerm);
  console.log(deletedProduct);

  await displayProduct(deletedProduct, "deleted");
})


//Basic product list display

const productList = await getProducts(baseUrl);
console.log(productList);
await displayProducts(productList);


async function displayProducts(productList) {
  allproducts.innerHTML = "";
  
    for (let i = 0; i < productList.length; i++) {
      const { UPC, productName, manufacturer, isUnion, unionName } = productList[i]
      const div = document.createElement('div');
      div.textContent = `Entry ${i} is UPC: ${UPC}, productName: ${productName}, manufacturer: ${manufacturer}, isUnion: ${isUnion}, unionName: ${unionName}`;
      allproducts.appendChild(div);
    }
};

async function displayProduct(productList, entry) {
  allproducts.innerHTML = "";
  
  const { UPC, productName, manufacturer, isUnion, unionName } = productList;
  const div = document.createElement('div');
  div.textContent = `The ${entry} product is UPC: ${UPC}, productName: ${productName}, manufacturer: ${manufacturer}, isUnion: ${isUnion}, unionName: ${unionName}`;
  allproducts.appendChild(div);
};


//Seems like I'm just writing the controllers again?

async function getProducts() {
  const results = await fetch(baseUrl);
  const json = await results.json();
  return json;
}

async function searchProducts(searchTerm) {
  const results = await fetch(`${baseUrl }${searchTerm}`);
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

async function deleteProducts(deleteTerm) {
  const results = await fetch(`${baseUrl}${deleteTerm}`, { method: 'DELETE' });
  const json = await results.json();
  return json;
}

