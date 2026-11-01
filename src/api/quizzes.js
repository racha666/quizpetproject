// src/api/quizzes.js
import { quizzes as initial } from '../data/quizzes'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchQuizzes() {
  await delay(500)
  // shallow copy каждого объекта — защита от мутации initial
  return initial.map(q => ({ ...q, tags: [...q.tags] }))
}