// Initialize the variable addToy to false
let addToy = false;

// When the DOM content is loaded, execute the following function
document.addEventListener("DOMContentLoaded", () => {
  // Select the 'Add New Toy' button and the toy form container
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  // Call the function to fetch and display all toys
  getAllToys();
  
  // Add an event listener to the 'Add New Toy' button
  addBtn.addEventListener("click", () => {
    // Toggle the addToy variable
    addToy = !addToy;
    
    // If addToy is true, display the toy form container
    if (addToy) {
      toyFormContainer.style.display = "block";
      
      // Add an event listener to the submit button of the form
      document.querySelector('.add-toy-form').addEventListener('submit', handleCreateButton);      
    } else {
      // If addToy is false, hide the toy form container
      toyFormContainer.style.display = "none";
    }        
  });   
});

// Function to fetch all toys from the server
function getAllToys() {
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(data => {
      // Iterate through each toy and render it
      data.forEach(toy => renderOneToy(toy))
    })
}

// Function to render a single toy
function renderOneToy(toy) {
  // Create a new list item element
  let card = document.createElement('li')
  card.className = 'card'
  card.style.textAlign = 'center'
  
  // Populate the card with toy information
  card.innerHTML = `
    <div>
      <h2>${toy.name}</h2>
      <img class="toy-avatar" src="${toy.image}">
      <p>${toy.likes} likes</p>
      <button class='like-btn' ${toy.id}>like</button>
    </div>`
  
  // Add an event listener to the like button
  card.querySelector('.like-btn').addEventListener('click', () => {
    toy.likes++
    card.querySelector('p').textContent = toy.likes + ' likes'
    updateLikes(toy)
  }) 
  
  // Append the card to the toy collection
  document.querySelector('#toy-collection').appendChild(card)
}

// Function to handle form submission for creating a new toy
function handleCreateButton(e) {
  e.preventDefault()
  // Create a toy object with form data
  let toyObj = {
    name:e.target.name.value,
    image:e.target.image.value,
    likes: 0
  }
  // Render the new toy
  renderOneToy(toyObj)
  // Add the new toy to the server
  addNewToy(toyObj)
}

// Function to add a new toy to the server
function addNewToy(toyObj) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toyObj)
  })
  .then(res => res.json())
  .then(data => console.log(data))
}

// Function to update the likes of a toy on the server
function updateLikes(toyObj) {
  fetch(`http://localhost:3000/toys/${toyObj.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toyObj)
  })
  .then(res => res.json())
  .then(toy => console.log(toy))
}
