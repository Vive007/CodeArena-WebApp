const axios = require("axios");

async function myCallback(id, index, userId) {
    try {
        const response = await axios.get('https://codeforces.com/api/user.status', {
            params: { handle: userId, from: 1, count: 1 },
        });
    
        const submittedId = response.data.result[0]['id'];
        const submittedIndex = response.data.result[0]['problem']['index'];
        
        if (submittedId == id && submittedIndex == index) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to fetch data from Codeforces API:', error.message);
        return false;
    }
}

const verify = async (id, index, userId) => {
    return new Promise(async (resolve, reject) => {
        let verified = false;
        let intervalID;
        intervalID = setInterval(async () => {
            verified = await myCallback(id, index, userId);
            if (verified) {
                clearInterval(intervalID);
                clearTimeout(timeoutID);
                resolve(true);
            }
        }, 3000);

        const timeoutID = setTimeout(() => {
            clearInterval(intervalID);
            resolve(false);
        }, 60000);
    });
};

module.exports = {
    verify
};
