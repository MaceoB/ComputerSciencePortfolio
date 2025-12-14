import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from './login'

export default function App() {

  //const varibales initialized at once app is rendered
  const [user, setUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [iterator, setIterator] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [startTimer, setTime] = useState(0);



  useEffect(() => {
    //Upon rendering, the JSON object returns the quiz data and user data
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get("/api/user", { validateStatus: () => true });

        // Check auth in JSON response
        if (userResponse.data?.auth) setUser(resetUI.data.user);
        

        console.log(userResponse.data.message);

      } catch (error) {
        console.error("Error locating user", error);
      }
    };

    fetchUser();

    const fetchData = async () => {
      try {

        const postResponse = await axios.post("/api/quiz", {
          who: "qzicl",
          action: "hello",
        });
        console.log("POST response:", postResponse.data);


        const getResponse = await axios.get("/api/quiz");
        setQuizData(getResponse.data);
      } catch (error) {
        console.error("Error fetching topics: ", error);
      }
    };

    fetchData();
  }, []);


  const updateQuizData = async (updatedQuiz) => {
    try {
      const response = await axios.post("/api/quiz", updatedQuiz);
      console.log("Server response:", response.data);
      setQuizData(response.data.updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz: ", error);
    }
  };

  //Clear all initalized variables after the quiz is finished
  const resetUI = () => {
    setCurrentId(null);
    setIterator(0);
    setFeedback("");
    setTotalCorrect(0);
    setTime("");
    setButtonsDisabled(false);
  };

  const handleSubjectClick = (id) => {
    setCurrentId(id);
    document.getElementById("menu").style.display = "none";
    //Set the start time using XX:XX:XX AM/PM format
    setTime(new Date());
  };

  const handleOptionClick = (answer, correctAnswer) => {
    setButtonsDisabled(true); //Disable all of the answe buttons so the user can't change their answer 
    document.getElementById("next").style.display = "block"; //Show the next button so the user can proceed to the next question

    //Checks if the parameters are equal to eachother
    if (answer === correctAnswer) {
      setFeedback("Correct!");
      setTotalCorrect(totalCorrect + 1);
      //Adds 1 to the total correct value if correct
    } else {
      setFeedback("Wrong answer");
    }
  };

  const handleLogOut = () => {
    const postResponse = axios.post("/api/logout", { validateStatus: () => true });
    setUser(null);
  }

  //Calls once the "next" button has been clicked
  const handleNextClick = () => {
    document.getElementById("next").style.display = "none";
    const topic = quizData.topic[currentId];
    if (iterator + 1 < topic.quiz.length) {
      setIterator(iterator + 1); //Increment iterator
      setButtonsDisabled(false); //Enable buttons
      setFeedback("");
    } else {
      //Calls code if the iterator meets the end of the quiz
      setFeedback("Quiz Complete");
      const diff = Math.abs(new Date() - startTimer); // milliseconds

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      const finalTime = `${hours}:${minutes}:${seconds}`;
      
      const updatedQuiz = {
        ...quizData,
        topic: quizData.topic.map((t, i) =>
          i === currentId
            ? {
              ...t,
              //Set the end time using XX:XX:XX AM/PM format
              sessionTime: finalTime,
              score: totalCorrect,
            }
            : t
        ),
      };

      updateQuizData(updatedQuiz);
      setTimeout(resetUI, 3000);
    }
  };


  //If quiz data is loading
  if (!user) return <Login onLogin={setUser} />;
  if (!quizData) return <p>Loading quiz...</p>;
  

  //If quiz data loaded, and there is no corrent topic id selected, then the menu prompts the user to choose a subject
  //While returning the react elements, the posted response from the back and will set the start time, end time, and score
  if (currentId === null)
    return (
      <div id="menu">
        <h1>Choose your subject</h1>
        <div id="container">
          <div id="subjects">
            {quizData.topic.map((t, idx) => (
              <div key={idx} className="subject-card">
                <button
                  className="subject"
                  onClick={() => handleSubjectClick(idx)}
                >
                  {t.title}
                </button>
                <div className="session-info">
                  <p>Time taken: {t.sessionTime || "—"}</p>
                  <p>Score: {t.score ?? "—"}/{t.quiz.length}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <button
              className="logout"
              onClick = {handleLogOut}
            
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );

  const topic = quizData.topic[currentId];
  const currentQuestion = topic.quiz[iterator];

  //Returns react element:displaying the name of the topic, the current question prompt, and a mapped out group of generated buttons.
  //Next only reveals itself once the handleOptionClick has been called
  //If handle next click is called, then the iterator will increment, setting the currentQuestion value to point to the text question
  return (
    <div>
      <h1>{topic.title}</h1>
      <div>
        <strong>{currentQuestion.question}</strong>
        <div>
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              className="options"
              onClick={() => handleOptionClick(opt, currentQuestion.answer)}
              disabled={buttonsDisabled}
            >
              {opt}
            </button>
          ))}
        </div>
        <p id="correct">{feedback}</p>
        <button id="next" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
}
