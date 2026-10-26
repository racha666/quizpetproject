export function validateProfile(data) {
  const errors = {}

  if (!data.fullName.trim()) {
    errors.fullName = 'Укажите ФИО'
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'ФИО слишком короткое'
  }

  const phoneDigits = data.phone.replace(/\D/g, '')
  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите полный номер телефона'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Некорректный email'
  }

  return errors
}