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
    //create element figure
    const figureProject = document.createElement("figure");
    figureProject.setAttribute("data-tag", project.category.name);
    figureProject.setAttribute("data-id", project.id);
    //create element image
    const imageProject = document.createElement("img");
    imageProject.src = project.imageUrl;
    imageProject.alt = project.title;
    //create element title
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
const getWorks = async(categoryId) => {
    //wait for response
    await fetch('http://localhost:5678/api/works')
    //check if the response is ok or send an error message in the console
    .then((response) => {
        if(response.ok) {
            return response.json();
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
            if (categoryId == project.category.id || categoryId == null) {
                createProject(project);
            }
        });

    })

    .catch((error) => {
        console.log(errror);
    });
};

// Function to get categories from the API
const getCategories = async(category) => {
    //wait for response
    await fetch('http://localhost:5678/api/categories')
    //check if the response is ok or send an error message in the console
    .then((response) => {
        if(response.ok) {
            return response.json();
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
            button.addEventListener("click", function() {

                //get button tag 
                //let buttonTag = button.dataset.tag;
                //console.log(buttonTag);

                //get the id and display it in the console
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

    .catch((error) => {
        console.log(errror);
    });
};

//function to display all getWorks 
const main = async () => {
    await getWorks();
    await getCategories();
}

//thread main 
main();




