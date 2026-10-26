import { quizzes } from '../data/quizzes'

// Имитация серверной задержки
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Фейковая отправка регистрации. В будущем заменится на fetch('/api/registrations', ...)
export async function submitRegistration(formData) {
  await delay(1200) // имитация сети

  // Имитация ошибки сервера: если выбрано > 2 квизов — «сервер перегружен»
  if (formData.quizIds.length > 2) {
    throw new Error(
      'Сервер не смог обработать столько квизов сразу. Попробуйте выбрать не больше двух.'
    )
  }

  // Имитация успеха
  return {
    id: Date.now(),
    status: 'registered',
    submittedAt: new Date().toISOString(),
    registrations: formData.quizIds.map(quizId => {
      const quiz = quizzes.find(q => q.id === quizId)
      return {
        quizId,
        quizTitle: quiz ? quiz.title : `Квиз #${quizId}`,
        status: 'success',
      }
    }),
  }
}