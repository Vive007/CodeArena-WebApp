

document.addEventListener("DOMContentLoaded", function () {
        const codeforcesIdInput = document.getElementById("codeforcesId");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordMatchMessage = document.getElementById("passwordMatchMessage");
    const signupButton = document.getElementById("signupButton");
  
    // Function to check if all fields are filled and passwords match
    function checkFormValidity() {
      const codeforcesId = codeforcesIdInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
  
      // Check if any field is empty
      const anyEmpty = codeforcesId === "" || email === "" || password === "" || confirmPassword === "";
      const isPasswordEmpty=(password==="" || confirmPassword==="");
  
      // Check if passwords match
      const passwordsMatch = (password === confirmPassword);
  
      if (anyEmpty || (isPasswordEmpty || !passwordsMatch) ) {
        // Disable the button
        signupButton.disabled = true;
        signupButton.classList.add("disabled"); // Add disabled class
      } else {
        // Enable the button
        signupButton.disabled = false;
        signupButton.classList.remove("disabled"); // Remove disabled class
      }
  
      // Show password match message
      if (passwordsMatch && !isPasswordEmpty) {
        passwordMatchMessage.textContent = "Passwords match";
        passwordMatchMessage.style.color = "green";
      } else {
        passwordMatchMessage.textContent = "Passwords do not match";
        passwordMatchMessage.style.color = "red";
      }
    }
  
    // Event listeners for all input fields
    codeforcesIdInput.addEventListener("input", checkFormValidity);
    emailInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);
    confirmPasswordInput.addEventListener("input", checkFormValidity);
    // Event listeners for all input fields
    document.getElementById("signupButton").addEventListener("click", async () => {
        try {
            const codeforcesId = document.getElementById("codeforcesId").value;
            const response = await fetch('http://localhost:3000/api/getRandomCodeforcesProblem');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (!data.link) {
                throw new Error('Some error occurred. Please reload the page');
            }
            
            const { link, problemId, index } = data.link;
            const submissionLink = prompt("Submit a compilation error to this problem:", link);
            window.open(submissionLink,'_blank');
            
            // Function to verify user using long polling
            const verifyUserLongPolling = async () => {
                try {
                    const verifyResponse = await fetch(`http://localhost:3000/api/verifyCodeforcesUser/${problemId}/${index}/${codeforcesId}`);
                    if (!verifyResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const verificationData = await verifyResponse.json();
                    return verificationData;
                } catch (error) {
                    console.error('Error:', error);
                    throw new Error('An error occurred while verifying user');
                }
            };
      
            // Perform long polling
            const startTimestamp = Date.now();
            const pollingTimeout = 60000; // 1 minute timeout
            let verificationData;
            while (true) {
                verificationData = await verifyUserLongPolling();
                if (verificationData.verify !== undefined) {
                    break;
                }
                if (Date.now() - startTimestamp >= pollingTimeout) {
                    throw new Error('Polling timeout');
                }
                await new Promise(resolve => setTimeout(resolve, 3000)); // Poll every 3 seconds
            }
            
            // Get values from input fields
            // const codeforcesId = document.getElementById("codeforcesId").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
        
            // Create an object with the form data
            const formData = {
                codeforcesId: codeforcesId,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            };
            
            if(verificationData.verify){
                // Send a POST request to the server
                fetch('http://localhost:3000/signup', {
                    //method: 'POST',
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    // You can add logic here to handle the response, such as showing a success message to the user
                })
                .catch(error => {
                    console.error('Error:', error);
                    // You can handle errors here, such as showing an error message to the user
                });
            }
            else{
                console.log("didnt send post request to store the data ");
            }

            alert(verificationData.verify ? "Account verified!" : "Account not verified");
            // Open a new page in a new tab or window
            if(verificationData.verify)
            window.location.href = "http://localhost:3000/";
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
        }
      });
      
  });
  
















































































// document.addEventListener("DOMContentLoaded", function () {
//     const codeforcesIdInput = document.getElementById("codeforcesId");
//     const emailInput = document.getElementById("email");
//     const passwordInput = document.getElementById("password");
//     const confirmPasswordInput = document.getElementById("confirmPassword");
//     const passwordMatchMessage = document.getElementById("passwordMatchMessage");
//     const signupButton = document.getElementById("signupButton");
  
//     // Function to check if all fields are filled and passwords match
//     function checkFormValidity() {
//       const codeforcesId = codeforcesIdInput.value;
//       const email = emailInput.value;
//       const password = passwordInput.value;
//       const confirmPassword = confirmPasswordInput.value;
  
//       // Check if any field is empty
//       const anyEmpty = codeforcesId === "" || email === "" || password === "" || confirmPassword === "";
//       const isPasswordEmpty=(password==="" || confirmPassword==="");
  
//       // Check if passwords match
//       const passwordsMatch = (password === confirmPassword);
  
//       if (anyEmpty || (isPasswordEmpty || !passwordsMatch) ) {
//         // Disable the button
//         signupButton.disabled = true;
//         signupButton.classList.add("disabled"); // Add disabled class
//       } else {
//         // Enable the button
//         signupButton.disabled = false;
//         signupButton.classList.remove("disabled"); // Remove disabled class
//       }
  
//       // Show password match message
//       if (passwordsMatch && !isPasswordEmpty) {
//         passwordMatchMessage.textContent = "Passwords match";
//         passwordMatchMessage.style.color = "green";
//       } else {
//         passwordMatchMessage.textContent = "Passwords do not match";
//         passwordMatchMessage.style.color = "red";
//       }
//     }
  
//     // Event listeners for all input fields
//     codeforcesIdInput.addEventListener("input", checkFormValidity);
//     emailInput.addEventListener("input", checkFormValidity);
//     passwordInput.addEventListener("input", checkFormValidity);
//     confirmPasswordInput.addEventListener("input", checkFormValidity);
//   });
  




























// document.addEventListener("DOMContentLoaded", function () {
//     const btn = document.getElementById("signupButton");
  
//     btn.addEventListener('click', (e) => {
//       e.preventDefault(); // Prevent default behavior (form submission or page reload)
  
//       // Get values from input fields
//       const codeforcesId = document.getElementById("codeforcesId").value;
//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;
//       const confirmPassword = document.getElementById("confirmPassword").value;
  
//       // Create an object with the form data
//       const formData = {
//         codeforcesId: codeforcesId,
//         email: email,
//         password: password,
//         confirmPassword: confirmPassword
//       };
  
//       // Send a POST request to the server
//       fetch('http://localhost:3000/signup', {
//         //method: 'POST',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       })
//       .then(response => response.json())
//       .then(data => {
//        // console.log(data); // Log the response from the server
//        console.log("move to another page");

//         // You can add logic here to handle the response, such as showing a success message to the user
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         // You can handle errors here, such as showing an error message to the user
//       });
//     });

//   });