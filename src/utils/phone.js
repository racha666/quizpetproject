export function formatPhone(value) {
  // 1. Достаём только цифры
  let digits = value.replace(/\D/g, '')

  // 2. Пусто — разрешаем полностью очистить поле
  if (digits.length === 0) return ''

  // 3. Отрезаем ведущую 7 или 8 (код страны)
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1)
  }

  // 4. Максимум 10 цифр (оператор + номер)
  digits = digits.slice(0, 10)

  // 5. Собираем обратно по кускам
  let result = '+7'
  if (digits.length > 0) result += ' (' + digits.slice(0, 3)
  if (digits.length > 3) result += ') ' + digits.slice(3, 6)
  if (digits.length > 6) result += '-' + digits.slice(6, 8)
  if (digits.length > 8) result += '-' + digits.slice(8, 10)

  return result
}