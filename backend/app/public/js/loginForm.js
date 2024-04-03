document.addEventListener("DOMContentLoaded", function () {
  const codeforcesIdInput = document.getElementById("sigcodeforcesId");
  const passwordInput = document.getElementById("sigpassword");
  const signinButton = document.getElementById("signinButton");
  const passwordMatchMessage = document.getElementById("errorMessage");

  // Function to check if both fields are filled
  function checkInputs() {
    const codeforcesIdValue = codeforcesIdInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // Enable button only if both fields are not empty
    if (codeforcesIdValue !== "" && passwordValue !== "") {
      signinButton.disabled = false;
      signinButton.classList.remove("disabled"); // Remove disabled class
    } else {
      signinButton.disabled = true;
      signinButton.classList.add("disabled"); // Add disabled class
    }
  }

  // Event listener for Codeforces ID input
  codeforcesIdInput.addEventListener("input", checkInputs);

  // Event listener for Password input
  passwordInput.addEventListener("input", checkInputs);

  // Event listener for Sign in button
  signinButton.addEventListener("click", function (e) {
    e.preventDefault();

    const codeforcesId = codeforcesIdInput.value.trim();
    const password = passwordInput.value.trim();

    // Create an object with the form data
    const formData = {
      codeforcesId: codeforcesId,
      password: password
    };

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response from the server
      if (data.error) {
        // Handle error messages
        console.error('Error:', data.error);
        passwordMatchMessage.textContent = data.error;
        passwordMatchMessage.style.color = "red";
        passwordMatchMessage.classList.add("show"); // Show error message
      } else if(data.user) {
        // No errors, move to another page or show success message
        console.log(data.user);
        
        console.log("move to another page");
        passwordMatchMessage.classList.remove("show"); // Hide error message
        location.assign('/home');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle other network errors
    });

  });

});
