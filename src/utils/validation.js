import { quizzes } from '../data/quizzes'
import { isQuizSelectable } from './quizStatus'

export function validate(formData) {
  const errors = {}

  // Квизы: хотя бы один
  if (formData.quizIds.length === 0) {
    errors.quizIds = 'Выберите хотя бы один квиз'
  } else {
    // ← НОВОЕ: проверяем, что все выбранные квизы существуют и доступны
    const unavailable = formData.quizIds
      .map(id => quizzes.find(q => q.id === id))
      .filter(q => !q || !isQuizSelectable(q))

    if (unavailable.length > 0) {
      errors.quizIds =
        unavailable.length === 1
          ? 'Один из выбранных квизов недоступен для регистрации'
          : 'Некоторые выбранные квизы недоступны для регистрации'
    }
  }

  // Команда: обязательна
  if (!formData.teamId) {
    errors.teamId = 'Выберите команду'
  }

  // ФИО: не пустое
  if (!formData.fullName.trim()) {
    errors.fullName = 'Укажите ФИО'
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = 'ФИО слишком короткое'
  }

  // Телефон: 11 цифр (7 + 10)
  const phoneDigits = formData.phone.replace(/\D/g, '')
  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите полный номер телефона'
  }

  // Email: простая регулярка
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Некорректный email'
  }

  // Количество участников: 1–12
  if (
    !Number.isInteger(formData.participantsCount) ||
    formData.participantsCount < 1 ||
    formData.participantsCount > 12
  ) {
    errors.participantsCount = 'От 1 до 12 человек'
  }

  // Согласие на ПД
  if (!formData.personalDataConsent) {
    errors.personalDataConsent = 'Необходимо согласие на обработку данных'
  }

  return errors
}