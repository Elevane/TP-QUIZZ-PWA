import React, { Fragment, useState, useContext } from "react";
// - Helpers
import {
  renderHTML,
  scrollToElem,
  handleChosenAnswer,
  calculateResult
} from "./utilities";
import { Store, useAppContext } from "./AppContext";
// - Style
import "./styles.css";
// - Data
import data from "./data.json";

/** Used to compare against user's chosen answers */
const correctAnswers = [1, 0];
const totalQuestions = data.results.length;

export default function App() {
  const [chosenAnswers, setChosenAnswers] = useState([]);

  function renderQuestions() {
    return data.results.map((result, index) => (
      <Question key={index} result={result} index={index} />
    ));
  }

  return (
    <Store.Provider value={{ chosenAnswers, setChosenAnswers }}>
      <Start />
      {renderQuestions()}
      <Finish />
    </Store.Provider>
  );
}

/**
 * Renders questions, answers and buttons to progress.
 *
 * @param {{results: any, index: number}} props
 */
export function Question({ result, index }) {
  return (
    <section id={`question-${index}`} className="fullpage-center">
      <h3>
        {index + 1}. {renderHTML(result.question)}
      </h3>
      <div className="answers">
        <Answers result={result} parentIndex={index} />
      </div>
      <section className="btn-group" style={{ display: "flex" }}>
        {index !== 0 && (
          <Button
            text="prev"
            func={() => scrollToElem(`question-${index - 1}`)}
          />
        )}
        {index !== totalQuestions - 1 && (
          <Button
            text="next"
            func={() => scrollToElem(`question-${index + 1}`)}
          />
        )}
        {index === totalQuestions - 1 && (
          <Button text="finish" func={() => scrollToElem("finish")} />
        )}
      </section>
    </section>
  );
}

/**
 * Combine correct and incorrect answers, sort them in alphabetical order
 * then return radio buttons.
 *
 * @param {{result:{}, parentIndex:number}} props
 */
export function Answers({ result, parentIndex }) {
  const combinedAnswers = [...result.incorrect_answers, result.correct_answer];
  combinedAnswers.sort(); // Sort to alphabetical order
  return combinedAnswers.map((answer, index) => (
    <Answer
      key={index}
      answer={answer}
      index={index}
      parentIndex={parentIndex}
    />
  ));
}

function Answer({ answer, index, parentIndex }) {
  const { chosenAnswers, setChosenAnswers } = useAppContext();
  return (
    <Fragment>
      <input
        type="radio"
        name={`question-${parentIndex}`}
        onChange={element =>
          setChosenAnswers(
            handleChosenAnswer(element, parentIndex, chosenAnswers)
          )
        }
        value={index}
      />
      {renderHTML(answer)}
      <br />
    </Fragment>
  );
}

/**
 * Saves me from writing type button over and over.
 *
 * @param {{text: string, func: () => {}}} props
 */
function Button({ text,color, func }) {
  return (
    <button type="button" onClick={func} style={{margin:"5px" ,  backgroundColor : color, border : "none", borderRadius :"30%"}}>
      {text}
    </button>
  );
}

function Start() {
  return (
    <section className="fullpage-center" id="start">
      <h1>Images Quizz</h1>
      <img src="https://img.freepik.com/vecteurs-premium/quiz-dans-style-bande-dessinee-pop-art_175838-505.jpg?w=2000" style={{width : "150px", height :"150px"}}></img>
      <Button  text="Start" color="#28a745" func={() => scrollToElem("question-0")} />
      <Button text="Rules" color=" #dc3545"></Button>
    </section>
  );
}
function sendData(score){
  console.log("...sendint score to server...." + score)
  fetch(process.env.REACT_APP_API_URL, {
    method: "POST",
    body : JSON.stringify({"score" : score}),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "*/*",
      
    },
  }).then((data) =>  data.json());
}
function Finish() {
  const { chosenAnswers } = useContext(Store);
  const textCompleted = (
    <Fragment>
      <h3>Well done!</h3>
      <h4>
        You scored {calculateResult(correctAnswers, chosenAnswers)} out of{" "}
        {totalQuestions}
      </h4>
      <Button text="start over" func={() => {sendData(calculateResult(correctAnswers, chosenAnswers)); window.location.href = "/"}} />
    </Fragment>
  );


  const textIncomplete = (
    <Fragment>
      <h4>Opps, looks like you haven't answered all the questions</h4>
      <p>Scroll up to see which questions you've missed out </p>
      
    </Fragment>
  );

  /** Questions answered out of sequence will cause array to have `undefineds`
   * this variable counts the length with those filtered out
   */
  const answeredQuestions = chosenAnswers.filter(ar => ar !== undefined).length;
  console.log(chosenAnswers , answeredQuestions, totalQuestions)
  return (
    <section className="fullpage-center" id="finish">
      {answeredQuestions === totalQuestions ? textCompleted : textIncomplete}
    </section>
  );
}
