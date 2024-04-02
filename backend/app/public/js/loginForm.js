document.addEventListener("DOMContentLoaded", function () {
    const codeforcesIdInput = document.getElementById("codeforcesId");
const passwordInput = document.getElementById("password");
// const confirmPasswordInput = document.getElementById("confirmPassword");
// const passwordMatchMessage = document.getElementById("passwordMatchMessage");
const signinButton = document.getElementById("signinButton");

// Function to check if all fields are filled and passwords match
function checkFormValidity() {
  const codeforcesId = codeforcesIdInput.value;
  const password = passwordInput.value;

  // Check if any field is empty
  const anyEmpty = (codeforcesId === "" ||  password === "" );
  

  // Check if passwords match
  const passwordsMatch = (password === confirmPassword);

  if (anyEmpty  ) {
    // Disable the button
    signinButton.disabled = true;
    signinButton.classList.add("disabled"); // Add disabled class
  } else {
    // Enable the button
    signinButton.disabled = false;
    signinButton.classList.remove("disabled"); // Remove disabled class
  }
}

// Event listeners for all input fields
codeforcesIdInput.addEventListener("input", checkFormValidity);
passwordInput.addEventListener("input", checkFormValidity);
});