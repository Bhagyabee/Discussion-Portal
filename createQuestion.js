const questionList = document.getElementById("questions");
const responseList = document.getElementById("response-list");

function addQuestion(questionObj) {
  const questionId = getQuestionId();

  if (!questionObj.sub || !questionObj.question) {
    alert("Please fill in both the title and body of the question.");
    return;
  }

  const question = {
    subject: questionObj.sub,
    description: questionObj.question,
    id: questionId,
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now(),
    isResolve: false,
    isFavorite: false,
    acceptedAns: 0,
  };

  saveQuestionToLocalStorage(question);
  displayQuestionAtUI(question);
  renderQuestions();
}

function saveQuestionToLocalStorage(question) {
  let questions = localStorage.getItem("questions");
  if (questions) {
    questions = JSON.parse(questions);
  } else {
    questions = [];
  }
  questions.push(question);

  localStorage.setItem("questions", JSON.stringify(questions));
}

function displayQuestionAtUI(question) {
  const questionContainer = document.createElement("div");
  const qtitle = document.createElement("div");
  const qdesc = document.createElement("div");
  const ansupd = document.createElement("div");

  const up = document.createElement("div");
  const down = document.createElement("div");
  const fav = document.createElement("div");
  questionContainer.className = "questioncontainer";
  qtitle.className = "qtitle";
  qdesc.className = "qdesc";
  ansupd.className = "ansupd";

  up.className = "up";
  down.className = "down";
  fav.className = "fav";

  up.onclick = () => {
    upvoteQuestion(question.id);
    renderQuestions();
  };
  down.onclick = () => {
    downvoteQuestion(question.id);
    renderQuestions();
  };

  const title = document.createElement("p");
  const description = document.createElement("p");
  const upvote = document.createElement("label");
  const downvote = document.createElement("label");
  const favorite = document.createElement("label");
  const createdAt = document.createElement("p");

  title.innerText = question.subject;
  description.innerText = question.description;

  upvote.innerHTML = '<i class="fa-regular fa-heart"></i> ' + question.upvotes;
  downvote.innerHTML =
    '<i class="fa-solid fa-heart-crack"></i> ' + question.downvotes;

  favorite.innerHTML = question.isFavorite
    ? '<i class="fa-solid fa-star"></i>'
    : '<i class="fa-regular fa-star"></i>';

  fav.onclick = () => {
    toggleFavoriteQuestion(question.id);
  };

  createdAt.innerText = new Date(question.createdAt).toLocaleDateString("en");

  qtitle.appendChild(title);
  qdesc.appendChild(description);
  up.appendChild(upvote);
  down.appendChild(downvote);
  fav.appendChild(favorite);

  ansupd.appendChild(up);
  ansupd.appendChild(down);
  ansupd.appendChild(fav);

  questionContainer.appendChild(qtitle);
  questionContainer.appendChild(qdesc);
  questionContainer.appendChild(ansupd);

  questionList.appendChild(questionContainer);

  qdesc.onclick = () => viewQuestion(question);
}

function viewQuestion(question) {
  const enterContent = document.getElementById("Qform");
  const questionDisplay = document.getElementById("Qresponse");
  enterContent.classList.add("hidden-div");
  questionDisplay.classList.remove("hidden-div");
  questionDisplay.classList.add("showQuestion");

  const title = document.getElementById("question-title");
  const description = document.getElementById("question-body");

  title.innerText = question.subject;
  description.innerText = question.description;

  const resolveButton = document.getElementById("resolve-btn");

  responseList.innerHTML = "";
  renderResponses(question.id);
  const submitResponse = document.getElementById("submitResponse");

  submitResponse.removeEventListener("click", submitResponseHandler);

  submitResponse.replaceWith(submitResponse.cloneNode(true));
  document.getElementById("submitResponse").addEventListener("click", () => {
    submitResponseHandler(question.id);
  });

  resolveButton.onclick = () => {
    resolveQuestion(question.id);
  };
}

function submitResponseHandler(questionId) {
  const responseName = document.getElementById("user").value;
  const responseAns = document.getElementById("ans").value;

  if (responseAns && responseName) {
    const responseObj = {
      questionId: questionId,
      name: responseName,
      ans: responseAns,
      createdAt: Date.now(),
    };
    saveResponseToLocalStorage(responseObj);
    displayResponseAtUI(responseObj);

    // Clear the input fields
    document.getElementById("user").value = "";
    document.getElementById("ans").value = "";
  } else {
    alert("Please provide both a name and an answer.");
  }
}

function saveResponseToLocalStorage(response) {
  let responses = localStorage.getItem("responses");
  if (responses) {
    responses = JSON.parse(responses);
  } else {
    responses = [];
  }
  responses.push(response);
  localStorage.setItem("responses", JSON.stringify(responses));
}
function renderResponses(questionId) {
  const responses = JSON.parse(localStorage.getItem("responses")) || [];
  const questionResponses = responses.filter(
    (response) => response.questionId === questionId
  );

  questionResponses.forEach((response) => displayResponseAtUI(response));
}

function displayResponseAtUI(response) {
  const responseContainer = document.createElement("div");
  responseContainer.className = "response";

  const name = document.createElement("div");

  name.innerText = response.name;
  name.className = "userName";

  const comment = document.createElement("div");
  comment.innerText = response.ans;
  comment.className = "ansDiv";

  responseContainer.appendChild(name);
  responseContainer.appendChild(comment);
  responseList.appendChild(responseContainer);
}

function resolveQuestion(questionId) {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];

  questions = questions.map((question) => {
    if (question.id === questionId) {
      question.isResolve = true;
    }
    return question;
  });

  localStorage.setItem("questions", JSON.stringify(questions));
  renderQuestions();

  showNewQuestionForm();
}
function showNewQuestionForm() {
  const enterContent = document.getElementById("Qform");
  const questionDisplay = document.getElementById("Qresponse");

  enterContent.classList.remove("hidden-div");
  questionDisplay.classList.add("hidden-div");
  questionDisplay.classList.remove("showQuestion");

  const title = document.getElementById("question-title");
  const description = document.getElementById("question-body");
  title.innerText = "";
  description.innerText = "";
}
function renderQuestions() {
  const questionList = document.getElementById("questions");
  questionList.innerHTML = "";
  let questions = localStorage.getItem("questions");
  if (questions) {
    questions = JSON.parse(questions);
  } else {
    questions = [];
  }
  questions.sort((a, b) => {
    if (a.isFavorite === b.isFavorite) {
      // Sort by the net upvotes (upvotes - downvotes)
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA; // Higher score questions come first
    }

    return b.isFavorite - a.isFavorite; // Sort in descending order (highest score first)
  });
  questions.forEach((element) => {
    if (!element.isResolve && element.subject !== undefined) {
      displayQuestionAtUI(element);
    }
  });
}

function getQuestionsFromLocalStorage() {
  let questions = localStorage.getItem("questions");
  return questions ? JSON.parse(questions) : [];
}

function filterQuestions(searchTerm) {
  const questions = getQuestionsFromLocalStorage();
  console.log(questions);

  const filteredQuestions = questions.filter((question) => {
    const subject = question.subject.toLowerCase();
    const description = question.description.toLowerCase();
    console.log(
      `Filtering - Subject: ${subject}, Description: ${description}, SearchTerm: ${searchTerm}`
    );

    return (
      subject.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    );
  });
  console.log("filtered question", filteredQuestions);

  clearQuestionsList();
  filteredQuestions.forEach((question) => {
    displayQuestionAtUI(question);
  });
}

function clearQuestionsList() {
  questionList.innerHTML = "";
}

document.getElementById("search-question").addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();

  if (searchTerm === "") {
    renderQuestions();
  } else {
    filterQuestions(searchTerm);
  }
});

function upvoteQuestion(questionId) {
  let questions = getQuestionsFromLocalStorage();

  const question = questions.find((q) => q.id === questionId);

  if (question) {
    question.upvotes += 1;
    localStorage.setItem("questions", JSON.stringify(questions));
    renderQuestions();
  }
}
function downvoteQuestion(questionId) {
  let questions = getQuestionsFromLocalStorage();
  const question = questions.find((q) => q.id === questionId);

  if (question) {
    question.downvotes += 1;
    localStorage.setItem("questions", JSON.stringify(questions));
    renderQuestions();
  }
}
// function cleanLocalStorage() {
//   // Get questions from local storage
//   let questions = [];

//   // Filter out questions with undefined values

//   // Save the cleaned questions back to local storage
//   localStorage.setItem("questions", JSON.stringify(questions));

//   // Optionally re-render questions on the UI if needed
//   renderQuestions();
// }

function toggleFavoriteQuestion(questionId) {
  let questions = getQuestionsFromLocalStorage();
  const question = questions.find((q) => q.id === questionId);

  if (question) {
    question.isFavorite = !question.isFavorite;
    localStorage.setItem("questions", JSON.stringify(questions));
    renderQuestions();
  }
}

// // Call the function to clean local storage
// cleanLocalStorage();

window.onload = renderQuestions();
