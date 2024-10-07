function getQuestionId() {
  const storageKey = "_questionIdCount_";

  const currId = localStorage.getItem(storageKey) || 1;

  localStorage.setItem(storageKey, parseInt(currId) + 1);

  return parseInt(currId);
}
