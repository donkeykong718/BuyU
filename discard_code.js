////EDIT FORM & UPDATE FUNCTION (all moved into event listener for Edit button)

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

async function updateProduct(searchId, updateDetails) {

  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateDetails)
  }

  const results = await fetch(`${baseUrl}${searchId}`, requestOptions);
  const json = await results.json();
  return json;
}

// DELETE FORM (moved into event listener for Delete button)

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

//Details for "displayProducts" moved into singular displayProduct function

      const { UPC, productName, manufacturer, isUnion, unionName } = productList[i]
      const productCard = document.createElement('div');
      productCard.classList.add('productCard');
      allproducts.appendChild(productCard);

      const objID = productList[i]._id;
      console.log(objID);

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
          await displayProduct(deletedProduct, "deleted");
      })
      