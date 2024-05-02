//get class from Dom 

//get Filters nav
const navFilters = document.querySelector(".filters-nav");
//get gallery
const gallery = document.querySelector(".gallery");



//function create a button
const createButton = (category) => {
    //create a button
    const buttonFilters = document.createElement("button");
    //set attribute with the name and the id
    buttonFilters.setAttribute("data-tag", category.name);
    buttonFilters.setAttribute("data-id", category.id);
    //display the name as a text
    buttonFilters.innerText = category.name;
    //link child to parent
    navFilters.appendChild(buttonFilters);
};

//function to create project
const createProject = (project) => {
    //create figure element to create standalone content
    const figureProject = document.createElement("figure");
    figureProject.setAttribute("data-tag", project.category.name);
    figureProject.setAttribute("data-id", project.id);
    //create element image
    const imageProject = document.createElement("img");
    imageProject.src = project.imageUrl;
    imageProject.alt = project.title;
    //create element title by using figcaption
    const figcaptionProject = document.createElement("figcaption");
    figcaptionProject.innerText = project.title;
    //link childs to parent 
    figureProject.appendChild(imageProject);
    figureProject.appendChild(figcaptionProject);
    gallery.appendChild(figureProject);
}

//function to remove element from parent to display a blank page
const removeElement = (parent_element) => {
    //a while loop to remove child while child > 0
    while(parent_element.childNodes.length > 0) {
        //removing last child until 0
        parent_element.removeChild(parent_element.lastChild);
    }
};


//a function to get the Works from the API
//async can execute this function while other function are active
//it doesn't stop the program while getWorks await for datas
const getWorks = async(categoryId) => {
    //wait for response from the API
    await fetch('http://localhost:5678/api/works')
    //check if the response is ok or send an error message in the console
    .then((response) => {
        //if the response is true, do
        if(response.ok) {
            return response.json();
        //else throw an error message in the console
        }else{
            console.log("data recovery error");
        }
    })

    //get all projects
    .then((project) => {

        //remove works to get a blank page
        removeElement(gallery);
        //if category empty > display all, if category true > display category only
        project.forEach((project) => {
            //checking the project array to verify category id of a project or if null
            //then thread createProject function
            if (categoryId == project.category.id || categoryId == null) {
                createProject(project);
            }
        });

    })
    //catch and print errors during promises chain
    .catch((error) => {
        console.log(error);
    });
};

// Function to get categories from the API
//async can execute this function while other function are active
//it doesn't stop the program while getCategories await for datas
const getCategories = async(category) => {
    //wait for response from the API
    await fetch('http://localhost:5678/api/categories')
    //check if the response is ok or send an error message in the console
    .then((response) => {
        //if the response is true, do
        if(response.ok) {
            return response.json();
        //else throw an error message in the console    
        }else{
            console.log("category data recovery error");
        }
    })

    //create buttons for each category
    .then((category) => {
        category.forEach((category) => {
            createButton(category);
        });
    })

    .then((Filter) => {
        //get all buttons
        const buttons = document.querySelectorAll(".filters-nav button");
        //for each button, listen for a click
        buttons.forEach((button) => {
            //add an event to listen when the button was clicked
            button.addEventListener("click", function() {

                //get button tag 
                //let buttonTag = button.dataset.tag;
                //console.log(buttonTag);

                //get the id attribute and display it in the console
                let categoriesId = button.getAttribute("data-id");
                console.log(categoriesId);

                //remove "is-active" class for each button 
                buttons.forEach((button) => button.classList.remove("is-active"));

                //add "is-active" for the clicked button
                this.classList.add("is-active");

                //get works form API sorted by category (call the function)
                getWorks(categoriesId);

            });
        });

    })
    //catch and print errors during promises chain
    .catch((error) => {
        console.log(error);
    });
};

// Main function to init and display data 
const main = async () => {
    await getWorks();
    await getCategories();
}

//thread main 
main();




/* --- ADMIN MODE --- */

//get elements from DOM
//get the body
const body = document.querySelector("body");

// Get gallery's title
const galleryTitle = document.querySelector("#portfolio h2");

// Get the token to manage login/logout
const token = window.sessionStorage.getItem("token");

// Function to manage the logout
const logOut = () => {
  //deleting the token from the session storage
  sessionStorage.removeItem("token");
  //console.log(token);
  //redirection at the landing page
  window.location.href = "./index.html";
};


/* --- ADMIN PAGE ELEMENTS --- */
// function to create admin page's elements 
const adminPage = () => {
  // Adding the admin "editor" bar
  body.insertAdjacentHTML(
    "afterbegin",
    `<div class="edit-bar">
        <span class="edit"><i class="fa-solid fa-pen-to-square"></i>Mode édition</span>
    </div>`
  );

  // Adding the "open modal" button
  galleryTitle.insertAdjacentHTML(
    "afterend",
    `<a id="open-modal" href="#modal" class="edit-link">
        <i class="fa-solid fa-pen-to-square"></i>modifier
    </a>`
  );
  // Removing filters like the figma design
  document.querySelector(".filters-nav").style.display = "none";


  /* --- LOGIN / LOGOUT --- */
  // get the login/logout button 
  const logButton = document.querySelector("#logButton");
  console.log("#logButton");
  // replace it by logout
  logButton.innerHTML = `<a href="./index.html">logout</a>`;
  // add event listener to wait "click"
  logButton.addEventListener("click", logOut);

  /* --- OPPENING MODAL --- */
  // Get the button to oppen the modal
  const modalLink = document.querySelector("#open-modal");
  // add event listener to wait the "click"
  modalLink.addEventListener("click", openModal);
};

//A function to thread admin page 
//thread the function only if the token is valid
if(token !== null) {
    adminPage();
}