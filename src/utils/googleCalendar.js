// Генератор ссылки «Добавить в Google Calendar» на один квиз.
// Формат: https://developers.google.com/calendar/api/guides/create-events#render

function toGCalDate(isoLocal) {
  // '2026-10-25T19:00' → '20261025T190000'
  return isoLocal.replace(/[-:]/g, '').replace('T', 'T') + '00'
}

export function buildGoogleCalendarUrl(quiz, durationHours = 2) {
  if (!quiz.dateISO) return null

  const start = toGCalDate(quiz.dateISO)
  const endDate = new Date(quiz.dateISO)
  endDate.setHours(endDate.getHours() + durationHours)
  const end = toGCalDate(
    `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
  )

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: quiz.title,
    dates: `${start}/${end}`,
    details: quiz.desc,
    location: `${quiz.place}, ${quiz.address}`,
    ctz: 'Europe/Moscow',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}