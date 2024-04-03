document.addEventListener('DOMContentLoaded', function () {
    // Find the element with id "chatbtn"
    const chatBtn = document.getElementById('chatbtn');
    const logoutBtn=document.getElementById('logoutbtn');
    const userId=document.getElementById('userId');
    // var user = JSON.stringify(user|| {}) ;
    // userId.textContent = `WELCOME: ${user.codeForcesID}`;
    // console.log(user.codeForcesID);
    // // Add click event listener
    chatBtn.addEventListener('click', function () {
      // Redirect to the /chat route
      location.assign('/chat');
    });
    logoutBtn.addEventListener('click', function () {
        // Redirect to the /chat route
        location.assign('/logout');
      });
  });