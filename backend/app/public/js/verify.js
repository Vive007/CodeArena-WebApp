document.getElementById("verify").addEventListener("click", async () => {
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

      // Handle verification result
      alert(verificationData.verify ? "Account verified!" : "Account not verified");
      // Open a new page in a new tab or window
      window.location.href = "http://localhost:3000/";
  } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again later.");
  }
});
