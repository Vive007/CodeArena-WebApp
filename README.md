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

--user1 will select a topic tag and rating and duration required(max 1hour)
--user1 will challenge the user2 and if user2 accepts the challenge && both are online both will get redirect link to an arena page 
--codeforces provides json containing all problems and we'll filter the json according to the rating
--select random question out of the filtered json
--send the link to the arena page and start the timer
-- every 3 seconds check the #user.status for last 3 submissions 
--user who submitted in least amount of time will be winner
--arena will gets destroyed after the timer ends.

------------------------------------------------------------------------------------------------------------