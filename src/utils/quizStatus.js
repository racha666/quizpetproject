// src/utils/quizStatus.js
export const BADGE = {
  open:      { kanji: '空', text: 'Открыт',    className: 'badge--ok'     },
  few:       { kanji: '少', text: 'Мест мало', className: 'badge--warn'   },
  sold:      { kanji: '満', text: 'Мест нет',  className: 'badge--muted'  },   // ← было: badge--danger
  completed: { kanji: '済', text: 'Завершён',  className: 'badge--muted'  },
  cancelled: { kanji: '否', text: 'Отменён',   className: 'badge--danger' },
}

export function getQuizBadge(quiz) {
  if (quiz.lifecycle === 'completed') return BADGE.completed
  if (quiz.lifecycle === 'cancelled') return BADGE.cancelled
  return BADGE[quiz.availability] || BADGE.open
}

export function getQuizAction(quiz) {
  if (quiz.lifecycle === 'completed') return { label: 'Завершён',    disabled: true }
  if (quiz.lifecycle === 'cancelled') return { label: 'Отменён',     disabled: true }
  if (quiz.availability === 'sold')   return { label: 'Мест нет',    disabled: true }
  return { label: 'Регистрация', disabled: false }
}

export function isQuizSelectable(quiz) {
  return quiz.lifecycle === 'scheduled' && quiz.availability !== 'sold'
}

export function getQuizUnavailableReason(quiz) {
  if (quiz.lifecycle === 'completed') return 'завершён'
  if (quiz.lifecycle === 'cancelled') return 'отменён'
  if (quiz.availability === 'sold')   return 'мест нет'
  return ''
}