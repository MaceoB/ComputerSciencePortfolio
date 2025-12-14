# Artifact 1

Qzicl is a lab assignment I worked on in my CS-465 FUll Stack Development class where we demonstrate the ability to create and upload a full stack app that listens to routes on the back end, and changes elements using react on the front end. 

Below is the development backlog and justifications for the enhancements:

-Change posted data format: The user would find it to be more convenient if the app displayed how much time it took for them to do the quiz, rather than the time they started the quiz, and the time they ended the quiz. The application will do the math and return the data through a route. (11/12-13) (Done)
-Score should be returned as a string, to show the amount of points they got in a quiz out of the amount of points they can get in a quiz. (11/12-13)  (Done)
-The user should also see their personal best records of time and score (11/12-13)
-For scalability purposes, the backend will have more developed routes and will be called every time the front end is looking for data, rather than forcing the front end to split the data itself. When server.js, the data will already be mapped out and feasibly returned once axios fetches it from the back end, over forcing a topic to split every time there is a new question. (11/12-13) (Out of scope)

-Create a login/register page that gathers user data. If the user data is validated in the backend, then backend will let the user in. The first iteration will give dummy data and accept all inputs until the MongoDB is integrated, so this is simply designing another page that is accessed first. (11/14-15)

-Record logs on respective documents. (11/16)

-To split the server data into data per user, the website will prmpt the user to insert their credentials (and possibly be integrated with MONGODB). Personalized data scores to each individual user will enforce privacy and security to the platform. The users, their passwords, their emails, their best times per quiz, and their best scores per quiz will all be recorded. For each quiz, the topics will be concatenated with "score" and "time" for each value. This will be done in the third category. (Thanksgiving break)






This is the copy of artifact one that will be enhanced with different design philosophies and a database.
