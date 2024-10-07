const submit = document.getElementById("submit");

const subject = document.getElementById("subject");
const desc = document.getElementById("description");
const questionDiv = document.getElementById("questionDiv");

submit.addEventListener("click", () => {
  const sub = subject.value;
  const question = desc.value;

  addQuestion({ sub, question });
  subject.value = "";
  desc.value = "";
});
