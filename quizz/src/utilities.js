import React from "react";

/**
 * Decode HTML entity and return it as HTML div element.
 *
 * @param {string} rawHTML
 * @returns {JSX.Element}
 */
export function renderHTML(rawHTML) {
  return React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML }
  });
}

/**
 * Updates chosen answers array with the index value of the answer that has been selected.
 *
 * @param {HTMLInpitElement} element Used to get radio button value
 * @param {number} parentIndex Used to put value in correct position in array
 * @param {Array<number} chosenAnswers Current array of chosen answers.
 * @returns {Array<number>}
 */
export function handleChosenAnswer(element, parentIndex, chosenAnswers) {
  const selectedAnswerInt = +element.currentTarget.value;
  let updatedAnswers = [...chosenAnswers];

  updatedAnswers[parentIndex] = selectedAnswerInt;
  return updatedAnswers;
}

/**
 * Compare correct answers with chosen answers array.
 * Loop through correct answers and if chosen answer matches, increement results.
 *
 * @param {Array<number>} correctAnswers
 * @param {Array<number>} chosenAnswers
 * @returns {number}
 */
export function calculateResult(correctAnswers, chosenAnswers) {
  let result = 0;
  correctAnswers.forEach((correctAnswer, index) => {
    if (chosenAnswers[index] === correctAnswer) result++;
  });
  return result;
}

export function scrollToElem(elemId) {
  const elem = document.getElementById(elemId);
  elem.scrollIntoView({ behavior: "smooth" });
}
