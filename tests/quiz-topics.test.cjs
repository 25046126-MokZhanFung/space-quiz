const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const html = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const dataStart = script.indexOf("const questions = [");
const dataEnd = script.indexOf("const startView =");
const quizData = new Function(
  `${script.slice(dataStart, dataEnd)} return { questions, topics, getQuestionsForTopic };`
)();
const shuffleStart = script.indexOf("function shuffleQuestions(");
const shuffleEnd = script.indexOf("\n    function renderTopicOptions()", shuffleStart);
const shuffleQuestions = new Function(`${script.slice(shuffleStart, shuffleEnd)}; return shuffleQuestions;`)();

test("all topics includes every existing question in its original order", () => {
  assert.deepEqual(quizData.getQuestionsForTopic("all"), quizData.questions);
});

test("topic runs contain only questions assigned to that topic", () => {
  const expectedCounts = {
    planets: 5,
    "stars-galaxies": 2,
    "space-science": 2,
    "space-exploration": 1
  };

  for (const [topic, expectedCount] of Object.entries(expectedCounts)) {
    const questions = quizData.getQuestionsForTopic(topic);
    assert.equal(questions.length, expectedCount, `${topic} question count`);
    assert.ok(questions.every(question => question.topic === topic), `${topic} questions are correctly tagged`);
  }
});

test("every question belongs to a selectable topic", () => {
  const selectableTopics = Object.keys(quizData.topics).filter(topic => topic !== "all");

  for (const question of quizData.questions) {
    assert.ok(selectableTopics.includes(question.topic), `${question.question} has a selectable topic`);
  }
});

test("each run shuffles a copy and keeps every question with its answer data", () => {
  const originalQuestions = quizData.questions.slice();
  const firstRun = shuffleQuestions(quizData.questions, quizData.questions, () => 0);

  assert.equal(firstRun.length, originalQuestions.length);
  assert.equal(new Set(firstRun).size, originalQuestions.length);
  assert.notDeepEqual(firstRun, originalQuestions);
  assert.deepEqual(quizData.questions, originalQuestions);
  assert.ok(firstRun.every(question => quizData.questions.includes(question)));
});

test("a repeated shuffle changes the order without changing a topic's questions", () => {
  const topicQuestions = quizData.getQuestionsForTopic("planets");
  const firstRun = shuffleQuestions(topicQuestions, topicQuestions, () => 0);
  const nextRun = shuffleQuestions(topicQuestions, firstRun, () => 0);

  assert.equal(nextRun.length, topicQuestions.length);
  assert.equal(new Set(nextRun).size, topicQuestions.length);
  assert.notDeepEqual(nextRun, firstRun);
  assert.deepEqual(quizData.getQuestionsForTopic("planets"), topicQuestions);
});
