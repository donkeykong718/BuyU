const unionUrl = '/api/unions/';
const userUrl = '/api/users/';

const unionButton = document.getElementById('getunions');
const userButton = document.getElementById('getusers');

const displayContainer = document.getElementById('displaycontainer');

unionButton.addEventListener("click", async () => {
  const unions = await getDB(unionUrl);
  console.log(unions);
  displayDB(unions, "unions");
})

userButton.addEventListener("click", async () => {
  const users = await getDB(userUrl);
  displayDB(users, "users");
})

async function displayDB(database, type) {

  displayContainer.innerHTML = "";

  for (let i = 0; i < database.length; i++) {
    if (type === "unions") {
      await displayUnion(database[i]);       
    }
    if (type === "users") {
      await displayUser(database[i]);
    }
  }  
};
  
async function displayUnion(unionDetails, method) {
    
  let hasButtons = true;

  const selectHeader = document.createElement('p');

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

  displayContainer.appendChild(selectHeader)

    // console.log(`Display Union is running`);
    const { _id, unionName, locals, industry, website, contactInfo, description, createdAt, updatedAt } = unionDetails;

    // console.log(unionName, locals, industry, website, contactInfo, description, createdAt, updatedAt)
  
    const unionCard = document.createElement('div');
    unionCard.classList.add('unionCard');
    displayContainer.appendChild(unionCard);
  
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    const p5 = document.createElement('p');
    const p6 = document.createElement('p');
   
    p1.textContent = `Union: ${unionName.properName} (${unionName.nickName})`;
    p2.textContent = `Locals: ${locals}`;
    p3.textContent = `Industry: ${industry}`;
    p4.textContent = `Website: ${website}`;
    p5.textContent = `Contact: ${contactInfo}`;
    p6.textContent = `Description: ${description}`;

    unionCard.appendChild(p1);
    unionCard.appendChild(p2);
    unionCard.appendChild(p3);
    unionCard.appendChild(p4);
    unionCard.appendChild(p5);
    unionCard.appendChild(p6);
  
    if (!(createdAt == undefined)) {
      const parsedCreate = parseTime(createdAt);
      const p7 = document.createElement('p');
      p7.textContent = `Entry created on: ${parsedCreate} EST`
      unionCard.appendChild(p7)
    }
  
    if (!(updatedAt == undefined)) {
      const parsedUpdate = parseTime(updatedAt);
      const p8 = document.createElement('p');
      p8.textContent = `Last updated on: ${parsedUpdate} EST`
      unionCard.appendChild(p8);
    }
    
    if (hasButtons === true) {
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = `Delete`
      unionCard.appendChild(deleteButton)
  
      deleteButton.addEventListener('click', async () => {
        const deletedUnion = await deleteEntry(unionUrl, _id);
        displayContainer.innerHTML = "";
        await displayUnion(deletedUnion, "delete");
      })
    
      const editButton = document.createElement('button');
      editButton.textContent = `Edit`
      unionCard.appendChild(editButton)
  
      editButton.addEventListener('click', async () => {
        await displayEditBox(_id);
      })
    }
};

async function displayUser(userDetails, method) {

  let hasButtons = true;

  const selectHeader = document.createElement('p');

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

  displayContainer.appendChild(selectHeader)

  // console.log(userDetails);

  // console.log(`Display User is running`);
  const { _id, userName, password, firstName, lastName, eMail, unionName, localName, title, createdAt, updatedAt } = userDetails;

  const userCard = document.createElement('div');
  userCard.classList.add('userCard');
  displayContainer.appendChild(userCard);

  const p1 = document.createElement('p');
  const p2 = document.createElement('p');
  const p3 = document.createElement('p');
  const p4 = document.createElement('p');
  const p5 = document.createElement('p');
  const p6 = document.createElement('p');
  const p7 = document.createElement('p');

  p1.textContent = (`Username: ${userName}`);
  p2.textContent = (`Password: ${password}`);
  p3.textContent = (`Name: ${firstName} ${lastName}`);
  p4.textContent = (`E-mail: ${eMail}`);
  p5.textContent = (`Union: ${unionName}`);
  p6.textContent = (`Local: ${localName}`);
  p7.textContent = (`Title/Role: ${title}`);

  userCard.appendChild(p1);
  userCard.appendChild(p2);
  userCard.appendChild(p3);
  userCard.appendChild(p4);
  userCard.appendChild(p5);
  userCard.appendChild(p6);
  userCard.appendChild(p7);

  if (!(createdAt == undefined)) {
    const p8 = document.createElement('p');
    const parsedCreate = parseTime(createdAt);
    p8.textContent = `Entry created on: ${parsedCreate} EST`
    userCard.appendChild(p8)
  }

  if (!(updatedAt == undefined)) {
    const p9 = document.createElement('p');
    const parsedUpdate = parseTime(updatedAt);
    p9.textContent = `Last update on: ${parsedUpdate} EST`
    userCard.appendChild(p9);
  }

  if (hasButtons === true) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = `Delete`
    userCard.appendChild(deleteButton)

    deleteButton.addEventListener('click', async () => {
      const deletedUser = await deleteEntry(userUrl, _id);
      displayContainer.innerHTML = "";
      await displayUser(deletedUser, "delete");
    })
  
    const editButton = document.createElement('button');
    editButton.textContent = `Edit`
    userCard.appendChild(editButton)

    editButton.addEventListener('click', async () => {
      await displayEditBox(_id);
    })
  }
};
  
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


//CONTROLLERS


async function getDB(baseUrl) {
  const results = await fetch(baseUrl);
  const json = await results.json();
  return json;
}

async function searchDB(baseUrl, searchTerm) {
  const results = await fetch(`${baseUrl}${searchTerm}`);
  const json = await results.json();
  return json;
}

async function createEntry(baseUrl, newDetails) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDetails)
  }

  const results = await fetch(baseUrl, requestOptions);
  const json = await results.json();
  return json;
}

async function deleteEntry(baseUrl, deleteTerm) {
  const results = await fetch(`${baseUrl}${deleteTerm}`, { method: 'DELETE' });
  const json = await results.json();
  return json;
}