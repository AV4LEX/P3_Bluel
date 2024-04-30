//get elements

//get form
const form = document.getElementById("form");

//get input email
const email = document.getElementById("email");

//get input password
const password = document.getElementById("password");

//get error message 
const error = document.querySelector(".error-message");



//redirection Function
function welcomeHome() {
    document.location.href = "./index.html";
}


//function to exec when the form was sent 
form.addEventListener("submit", function (event) {
    event.preventDefault();

    //creating an object to get data from the form
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
        //post user data in the JSON
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
    //print error in console
    .catch((error) => {
        console.log(error);
    })

});
