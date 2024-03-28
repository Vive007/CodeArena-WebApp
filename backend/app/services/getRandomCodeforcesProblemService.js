const axios = require('axios');

const getRandomCodeforcesProblem = async () => {
    try {
        const rand = Math.floor(Math.random() * 2500);
        const response = await axios.get('https://codeforces.com/api/problemset.problems?tags=implementation');
        const problems = response.data.result.problems;
        if (rand >= problems.length) {
            throw new Error('Index out of bounds');
        }
        const link = `https://codeforces.com/problemset/problem/${problems[rand].contestId}/${problems[rand].index}`;
        return link;
    } catch (error) {
        throw new Error('Failed to get problem link');
    }
};

module.exports = {
    getRandomCodeforcesProblem
};
