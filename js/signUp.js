const formContainer = document.querySelector(".form-container");
const signUpLink = document.querySelector(".signup-link");
const signUp = document.querySelector(".signup");
const LoginLink = document.querySelector(".Login-link");

signUpLink.addEventListener("click", () => {
  formContainer.style.display = "none";
  signUp.style.display = "block";
});

LoginLink.addEventListener("click", () => {
  formContainer.style.display = "block";
  signUp.style.display = "none";
});
