//get elements from DOM

//get form by id
const form = document.getElementById("form");

//get input email by id
const email = document.getElementById("email");

//get input password by id
const password = document.getElementById("password");

//get error message class
const error = document.querySelector(".error-message");
error.innerText = "";



//redirection Function
function welcomeHome() {
    //if login succed > redirecting user to his landing page
    document.location.href = "./index.html";
}


//function to exec when the form is submit
form.addEventListener("submit", function (event) {
    //cancel page reload
    event.preventDefault();

    //creating an object to collect data from the form (html references)
    let user = {
        email: email.value,
        password: password.value,
    };



//calling the login API (POST)
    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        //transform user data into JSON and send the body request
        body: JSON.stringify(user), 
    })
    //get the response
    .then((Response) => {

        //checking status : if 200
        if(Response.ok) {
            return Response.json();
        //if status 401, display error message 
        }else if(Response.status === 401) {
            console.log("unauthorized");
            error.innerText = "Erreur de Mot de passe et/ou identifiant";
        //if status 404, display unknow user
        }else if(Response.status === 404) {
            console.log("user not found");
            error.innerText = "Utilisateur inconnu";
        }
    })

    //get the token in the JSON data, stock > redirection
    .then((data) => {
        sessionStorage.setItem("token", data.token);
        //thread welcomeHome function
        welcomeHome();
    })
    //catch and print errors during promise chain 
    .catch((error) => {
        console.log(error);
    })

});
