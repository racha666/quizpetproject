// src/utils/ics.js
// Генератор .ics (iCalendar) для экспорта квизов в Google/Apple/Outlook.
// Формат: https://datatracker.ietf.org/doc/html/rfc5545

function pad(n) {
  return String(n).padStart(2, '0')
}

// '2026-10-25T19:00' → '20261025T190000'
function toIcsDate(isoLocal) {
  const [datePart, timePart] = isoLocal.split('T')
  const [y, m, d] = datePart.split('-')
  const [h, min] = timePart.split(':')
  return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`
}

// Экранирование спецсимволов по RFC 5545
function escapeIcs(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function eventFor(quiz) {
  const start = toIcsDate(quiz.dateISO)
  // +2 часа на квиз (типичная длительность)
  const endDate = new Date(quiz.dateISO)
  endDate.setHours(endDate.getHours() + 2)
  const end = toIcsDate(
    endDate.toISOString().slice(0, 16).replace('T', 'T').slice(0, 16)
  )

  return [
    'BEGIN:VEVENT',
    `UID:quiz-${quiz.id}@quizbaze.local`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(quiz.title)}`,
    `DESCRIPTION:${escapeIcs(quiz.desc)}`,
    `LOCATION:${escapeIcs(`${quiz.place}, ${quiz.address}`)}`,
    `URL:${quiz.mapUrl}`,
    'END:VEVENT',
  ].join('\r\n')
}

export function buildIcs(quizzes, calendarName = 'QuizBaze') {
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QuizBaze//QuizPlan//RU',
    `X-WR-CALNAME:${escapeIcs(calendarName)}`,
  ]
  const footer = ['END:VCALENDAR']
  return [...header, ...quizzes.map(eventFor), ...footer].join('\r\n')
}

export function downloadIcs(quizzes, filename = 'quizbaze.ics', calendarName) {
  const ics = buildIcs(quizzes, calendarName)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}