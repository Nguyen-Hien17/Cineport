const form = document.getElementById("signupForm");

form.addEventListener("submit", function (e) {
    let valid = true;

    // Get form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Error elements
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Reset errors
    usernameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";

    // Username validation
    if (username === "") {
        usernameError.textContent = "Username is required";
        usernameError.style.display = "block";
        valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        emailError.textContent = "Email is required";
        emailError.style.display = "block";
        valid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address";
        emailError.style.display = "block";
        valid = false;
    }

    // Password validation
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters long";
        passwordError.style.display = "block";
        valid = false;
    }

    // Prevent submission if invalid
    if (!valid) {
        e.preventDefault();
    }
});