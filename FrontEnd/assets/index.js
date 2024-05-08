//get class from Dom 

//get Filters nav
const navFilters = document.querySelector(".filters-nav");
//get gallery
const gallery = document.querySelector(".gallery");



//get the aside Modal
const asideModal = document.querySelector("#modal");

//get the modal gallery box
const galleryModal = document.querySelector(".modal-box-gallery");

//get the modal's gallery 
const modalGallery = document.querySelector(".modal-gallery");

//get the 2nd modal
const addModal = document.querySelector(".modal-add-picture");

//get the form for the 2nd modal
const selectForm = document.querySelector("#category");




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
};

//function to create category option
const createOption = (category) => {
    const optionForm = document.createElement("option");
    optionForm.setAttribute("value", category.id);
    optionForm.innerText = category.name;
    selectForm.appendChild(optionForm);
};

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
        //remove works to get a blank page
        removeElement(modalGallery);
        //if category empty > display all, if category true > display category only
        project.forEach((project) => {
            //checking the project array to verify category id of a project or if null
            //then thread createProject function
            if (categoryId == project.category.id || categoryId == null) {
                //create gallery projects
                createProject(project);
                //create modal gallery projects
                createModalProject(project);
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
            createOption(category);
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




/********* --------- ADMIN MODE ---------- ********/

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
  
  //function to delete projects from the modal's gallery
  const deleteWork = async (workID) => {
      await fetch("http://localhost:5678/api/works/" + workID, {
          method: "DELETE",
          headers: {
              "content-type": "application/json",
              Authorization: "bearer " + token,
          },
      }).catch((error) => {
          console.log(error);
      });
  
      //call getwork function to update projects
      getWorks();
  };
  
  //function to create project in the modal 
  const createModalProject = (project) => {
      const figureModalProject = document.createElement("figure");
      figureModalProject.setAttribute("data-tag", project.id);
  
      const imageModalProject = document.createElement("img");
      imageModalProject.src = project.imageUrl;
      imageModalProject.alt = project.title;
      imageModalProject.classList.add("modal-project-img");
      
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("trash-icon", "fas", "fa-trash-alt");
      trashIcon.setAttribute("data-id", project.id);
      let trashIconID = trashIcon.getAttribute("data-id");
  
      const moveIcon = document.createElement("div");
      moveIcon.classList.add("move-icon");
  
      trashIcon.addEventListener("click", function (event) {
          event.preventDefault();
          if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true) {
            deleteWork(trashIconID);
          }
      });
  
      figureModalProject.appendChild(imageModalProject);
      figureModalProject.appendChild(trashIcon);
      trashIcon.appendChild(moveIcon);
      modalGallery.appendChild(figureModalProject);
  };
  
  
  
  
  /******** ------- ADD PROJECT ------ **********/
  const addWork = document.querySelector("#add-box");
  const inputElement = document.querySelector("#title");
  const selectElement = document.querySelector("#category");
  const fileInputElement = document.querySelector("#image");
  const submitButton = document.querySelector("#validate-button");
  const inputFile = document.querySelector("#image");
  
  //function to display the preview of the new work/image
  const showfile = (e) => {
      e.preventDefault();
  
      //function display images
      const reader = new FileReader();
      //read image
      reader.readAsDataURL(inputFile.files[0]);
      //send back the src into the preview 
      reader.addEventListener("load", function() {
          previewImage.src = reader.result;
      });
      //display the preview when uploading
      const previewBox = document.querySelector(".upload-picture-box");
      const previewImage = document.createElement("img");
      previewImage.setAttribute("id", "preview-image");

      // Apply styles directly to the first image
        if (!document.querySelector(".preview-image")) {
            previewImage.style.position = "absolute";
            previewImage.style.objectFit = "contain";
            previewImage.style.width = "100%";
            previewImage.style.height = "100%";
        }
  
      //hide background elements
      const uploadbutton = document.querySelector(".upload-button");
      uploadbutton.style.display ="none";
      const pictureIcon = document.querySelector(".picture-icon");
      pictureIcon.style.display ="none";
      const typeFiles = document.querySelector(".type-files");
      typeFiles.style.display ="none";
  
      previewBox.appendChild(previewImage);
  
  };

  //Fnction to check form fields 
const checkForm = () => {


    if (inputElement.value !== "" && selectElement.value !== "" && fileInputElement.value !== "") {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.style.color = "#ffffff";
    } else {
    return console.log("Formulaire incomplet");
    }

};

//Listenners of the form
inputFile.addEventListener("change", showfile);
inputElement.addEventListener("input", checkForm);
selectElement.addEventListener("input", checkForm);
fileInputElement.addEventListener("change", checkForm);

//Add a new project
const addWorks = async () => {
    //get form elements 
    let getpic = document.getElementById("image").files[0];
    let gettitle = document.getElementById("title").value;
    let getCategory = document.getElementById("category").value;

    //building the form data to send to the API
    let formData = new FormData();
    formData.append("image", getpic);
    formData.append("title", gettitle);
    formData.append("category", getCategory);

    //call the API
    await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
        },
        body: formData,
    })
    .then((response) => {
        if(response.ok) {
            getWorks(); // Updating galleries (portfolio and modal)
            closeModal(); // closing the modal 
            console.log("Le projet a été ajouté !");
            return response.json();
        } else {
            console.log("Api data recovery error");
        }
    })
    .catch((error) => {
        console.log(error);
    });
    
};


const validateForm = (e) => {
    e.preventDefault();

    // Get error message elements
    let imgIssue = document.querySelector("#error-img");
    let titleIssue = document.querySelector("#error-title");
    let categoryIssue = document.querySelector("#error-category");

    // Reset error messages
    imgIssue.innerHTML = "";
    titleIssue.innerHTML = "";
    categoryIssue.innerHTML = "";

    // Check if fields are empty
    if (inputElement.value === "") {
        titleIssue.innerHTML = "Titre obligatoire";
    }
    if (selectElement.value === "") {
        categoryIssue.innerHTML = "Catégorie obligatoire";
    }
    if (fileInputElement.files.length === 0) {
        imgIssue.innerHTML = "Image obligatoire";
    }

    // If all fields are valid, add the work
    if (inputElement.value !== "" && selectElement.value !== "" && fileInputElement.files.length > 0) {
        addWorks();
    }
};

/* --- ADMIN PAGE ELEMENTS --- */

//Function to open the modal 
const openModal = () => {

    //Activate the Aside 
    asideModal.classList.remove("unactive-modal");
    asideModal.setAttribute("aria-hidden", "false");

    //Activate the modal
    galleryModal.classList.remove("unactive-modal");


    const addPicButton = document.querySelector("#add-photo");
    addPicButton.addEventListener("click", (event) => {
        //hide 1st modal
        galleryModal.classList.add("unactive-modal");
        //display modal 2
        addModal.classList.remove("unactive-modal");
        //closing modal 2 on the X
        const closeIcon2 = document.querySelector(".close-icon-2");
        closeIcon2.addEventListener("click", closeModal);
        //back button
        const backIcon = document.querySelector(".back-icon");
        backIcon.addEventListener("click", (event) => {
            // display modal again
            galleryModal.classList.remove("unactive-modal");
            //add the unactive modal on the 2nd modal
            addModal.classList.add("unactive-modal");
            
        });       
    });
    
    
        //listener for the validate button
        //check the form (validateForm)
        addWork.addEventListener("submit", validateForm);

        //function to close the modal (cross)
        //icon
        const closeIcon = document.querySelector(".close-icon");
        closeIcon.addEventListener("click", closeModal);

        document.getElementById("modal").addEventListener("click", (event) => {
            if(event.target === document.getElementById("modal")) {
                closeModal();
            }
        });

        //get works when the modal is open
        getWorks();
    

};




//function closing modal 
const closeModal = () => {
    asideModal.classList.add("unactive-modal");
    modalGallery.classList.add("unactive-modal");
    addModal.classList.add("unactive-modal");

    //reset form
    document.querySelector("#add-box").reset();
    //removing preview image 
    const previewBox = document.querySelector(".upload-picture-box");
    const previewImage = document.querySelector("#preview-image");
    if (previewImage !== null) {
        previewBox.removeChild(previewImage);
    }

    //displaying pictureBox elements again
    const uploadButtonPic = document.querySelector(".upload-button");
    uploadButtonPic.style.display = "block";

    const pictureIcon = document.querySelector(".picture-icon");
    pictureIcon.style.display = "";

    const typeFiles = document.querySelector(".type-files");
    typeFiles.style.display = "";

    //reset validate button
    submitButton.style.backgroundColor = "#a7a7a7";
    
};


//A function to thread admin page 
//thread the function only if the token is valid
if(token !== null) {
    adminPage();
}








