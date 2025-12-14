import { http, HttpResponse } from 'msw'
import quizData from '../data/quiz.json'

// Initialize Firebase

let currentQuiz = { ...quizData }

let currentUser = null;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/*=================API ROUTES =====================*/
export const handlers = [
  http.get('/api/quiz', () => {
    return HttpResponse.json(currentQuiz)
  }),


  http.get('/api/topics', ({ request }) => {
    const id = request.json();
    return HttpResponse.json(currentQuiz.topic[id])
  }),


  //Checks if there is an identified user in the page, otherwise sends a 302 status to the server,
  //Calling a function that switchies the root to the login page

  http.get('/api/user', () => {
    if (currentUser) {
      return HttpResponse.json({
        auth: true,
        user: currentUser,
        message: "Welcome"
      })
    }
    return new HttpResponse(
      JSON.stringify({
        auth: false,
        message: "Redirecting unauthorized user to login page ",
      }),
      { status: 302 }
    );
  }),


  //Compares and processes credentials by comparing it to the database and firing a login function when accepted

  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json();


    if (password) {
      currentUser = {
        id: "123",
        name: username,
      };

      return HttpResponse.json({
        message: "Login successful",
        user: currentUser,
      });
    }

    return new HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });

    //TODO FOR CATEGORY 3 ENHANCEMENT: Compare requests to database and give response protocols based of if the logo is valid or not
  }),


  //Sets the user to null for the backend and frontend and calls logout function

  http.post('/api/logout', async () => {
    currentUser = null;
    return HttpResponse.json({
      message: "Logout successful",
      user: null,
    });
  }),

  http.post('/api/register', async ({ request }) => {
    const { newUser, newPassword } = await request.json();
    if (newUser && newPassword) {
      const encrypted = await hashPassword(newPassword);
      currentUser = {
        name: newUser,
      };

      return HttpResponse.json({
        message: "Login successful",
        user: currentUser,
      });
    }
    return new HttpResponse.json({ error: "Please enter your information" }, { status: 401 });
  
  }),


  http.post('/api/quiz', async ({ request }) => {
    const newQuizData = await request.json(); // Read JSON body from the request

    // Example: merge or overwrite current quiz
    currentQuiz = { ...currentQuiz, ...newQuizData };

    // Respond with confirmation
    return HttpResponse.json({
      message: "Quiz data updated successfully!",
      updatedQuiz: currentQuiz,
    });
  }),

  http.post('/api/hello', async ({ request }) => {
    const { who, action } = await request.json();
    if (who === "qzicl" && action === "hello") {
      return HttpResponse.json({
        topics: currentQuiz.topic.map(t => ({
          title: t.title,
          id: t.topicID ?? null
        }))
      });
    }
  })
];
/*=================================================*/