const questions = [
    {
        question: "testing1",
        choice1: "answer choice 1",
        choice2: "answer choice 2",
        choice3: "answer choice 3",
        choice4: "answer choice 4",
        answer: "A",
        explanation: "spaceholder",
    },
    {
        question: "testing2",
        choice1: "answer choice 1",
        choice2: "answer choice 2",
        choice3: "answer choice 3",
        choice4: "answer choice 4",
        answer: "B",
        explanation: "spaceholder",
    },
    {
        question: "testing3",
        choice1: "answer choice 1",
        choice2: "answer choice 2",
        choice3: "answer choice 3",
        choice4: "answer choice 4",
        answer: "C",
        explanation: "spaceholder",
    },
];

module.exports = (num) => {

    const length = questions.length;

    const qNum = num % length;

    const questionOutput = questions[qNum];

    return questionOutput;
};