const img = document.getElementById("images");
img.addEventListener("click", function() {
    if (img.src.match("images/toggle.png")) {
        img.src = "images/toggle2.png";
    } else {
        img.src = "images/toggle.png";
    }
});


const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorElement = document.getElementById("error");

form.addEventListener("submit", (e) => {
    let messages = []
    if (email.value === '' || email.value == null) {
        messages.push("Email is required")
    }

    if (password.value.length <= 6) {
        messages.push("Password must be longer than 6 characters")
    }

   if (password.value.length >= 20) {
        messages.push("Password must be lesser than 20 characters")
    } 

    if (password.value === 'password') {
        messages.push("Password cannot be 'password'")
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorElement.innerText = messages.join(', ');
        errorElement.style.display = "block";
    }

   
})

// HOME FEATURES AREA TOGGLE IMAGE //

const img = document.getElementById("feature-images");
img.addEventListener("click", function() {
    if (img.src.match("images/home/mobile-apps.png")) {
        img.src = "images/home/mobile-apps2.png";
    } else {
        img.src = "images/home/mobile-apps.png";
    }
});


