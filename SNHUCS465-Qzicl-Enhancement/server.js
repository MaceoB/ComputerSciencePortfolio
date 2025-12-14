import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { initializeFirebaseApp, uploadRegisteredInfo, getUserInfo } from "./src/firebase.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;



// Read quiz.json at runtime
const quizPath = path.join(__dirname, "src", "data", "quiz.json");
let currentQuiz = JSON.parse(fs.readFileSync(quizPath, "utf-8"));
let currentUser = null;
let newUserData;

//Function to encrypt password using a SHA-256 hash code
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  //return is called in an async api route as buffer builds the string
  return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Middleware
app.use(express.json());

// Serve React static files
app.use(express.static(path.join(__dirname, "dist")));

//Streeam requests for backend for development
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

/*=================API ROUTES =====================*/


app.get("/api/quiz", (req, res) => res.json(currentQuiz)); //responds with the current quiz data

app.get("/api/topics", (req, res) => {
  res.json({
    topics: currentQuiz.topic.map((t, idx) => ({
      title: t.title,
      id: t.topicID ?? idx,
    })), //responds with a list of topics
  });
}); //responds with a list of topics




app.post("/api/user", (req, res) => {
  currentUser = req.body;
  //TODO FOR CATEGORY 3 ENHANCEMENT: Compare requests to database and give response protocols based of if the logo is valid or not
});


app.post("/api/quiz", (req, res) => {
  const newQuizData = req.body; //updates the new quiz using the old quiz as a request
  currentQuiz = { ...currentQuiz, ...newQuizData };
  res.json({ message: "Quiz updated", updatedQuiz: currentQuiz }); //Returns the new quiz data as a response
});

app.post("/api/hello", (req, res) => {
  const { who, action } = req.body; //takes in request from the user and the hello action
  if (who === "qzicl" && action === "hello") {
    res.json({
      topics: currentQuiz.topic.map((t, idx) => ({
        title: t.title,
        id: t.topicID ?? idx,
      })), //responds with a list of topics

    });
  } else {
    res.status(400).json({ error: "Invalid request" });
  }
});


//Checks if there is an identified user in the page, otherwise sends a 302 status to the server,
//Calling a function that switchies the root to the login page
app.get("/api/user", (req, res) => {
  if (currentUser) {
    return res.json({
      auth: true,
      user: currentUser,
      message: "Welcome"
    })
  }
  return res.status(302).json({
    auth: false,
    message: "Redirecting unauthorized user to login page",
  });
});


//Compares and processes credentials by comparing it to the database and firing a login function when accepted

app.post("/api/login", async (req, res) => {
  const { usernameInput, passwordInput } = req.body;
  //inputted password gets encoded so the database could compare passwords
  const hashedPass = await hashPassword(passwordInput);
  console.log("From:", hashedPass);

  try {
    //Checks if info is in the database if the firestore is connected
    const result = await getUserInfo(usernameInput, hashedPass);
    if (!result.success || !result.data) {
      //if the database doesn't find the data the user entered
      return res.status(401).json({ error: "Invalid credentials" });
    }
    currentUser = {
      name: result.data.username,
    }
    return res.json({
      message: "Login successful",
      user: currentUser,
    });
  }
  catch (error) {
    //Catches error if there's no firestore connected
    return res.status(500).json({ error: "Server Error" });
  }



  //TODO FOR CATEGORY 3 ENHANCEMENT: Compare requests to database and give response protocols based of if the login is valid or not
});


//Sets the user to null for the backend and frontend and calls logout function

app.post("/api/logout", async (req, res) => {
  currentUser = null;
  return res.json({
    message: "Logout successful",
    user: null,
  });
});


app.post('/api/register', async (req, res) => {
  const { newUser, newPassword } = req.body;
  if (newUser && newPassword) {
    //Make sure that the user has inputted both the username and password
    const encrypted = await hashPassword(newPassword); //Encrypt password that will be stored
    //Create new data shape for the database to accept
    newUserData = {
      username: newUser,
      password: encrypted,
    };

    try {
      const result = await uploadRegisteredInfo(newUserData); //Push to the database document in the collection

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      currentUser = { name: newUserData.username }; //Sets the user so the site won't force them back to the authentication page when /api/user is called

      return res.json({
        message: "Registration successful",
        user: currentUser,
      });
    } catch (error) {
      // This is a safety net in case something unexpected happens
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }
  return res.status(401).json({ error: "Please enter your information" });
});

/*=================================================*/

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function testFirebaseApp() {
  try {
    await initializeFirebaseApp();
    //await uploadProcessedData();
    console.log("Success");
  }
  catch (error) {

  }
}

testFirebaseApp(); // Connect firebase