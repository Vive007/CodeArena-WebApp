Codeforces api
reference link: https://codeforces.com/apiHelp

------------------------------------------------------------------------------------------------------------
#authenticating the codeforces user

-- select a random problem from the problemset and give it to user
-- ask user to submit a wrong answer to the problem within 2 mins
-- check the #user.status for 2 mins with count = 1
-- if the random problem (contest id and index) == (submitted contest id and index) && verdict == "WRONG_ANSWER" user is authenticated.

Links:
https://codeforces.com/apiHelp/methods#problemset.problems

https://codeforces.com/apiHelp/methods#user.status

------------------------------------------------------------------------------------------------------------

#challenging friends 

2 users user1 and user2

-- Any user can create a lobby and will send a invitation to join the lobby.
-- only 2 users can join the lobby , when 2 users join the lobby they will get menu
-- each user will select their difficulty level and topic tag and it will get displayed to both user
-- if both users ok with the choosen option they will press start button 
-- if both users press start button timer starts and for each user random question appears 
-- those who solves first will be the winner.

------------------------------------------------------------------------------------------------------------