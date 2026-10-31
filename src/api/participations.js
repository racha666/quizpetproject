// src/api/participations.js
import { participations as initial } from '../data/participations'

let store = [...initial]

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchParticipations() {
  await delay(500)
  // shallow copy каждого объекта — защита от мутации store
  return store.map(p => ({ ...p, members: [...p.members] }))
}

// Вариант C: реальная загрузка результатов пока не реализована.
// Функция-заглушка для будущей панели капитана (7.12.4) и бэка.
// Параметры принимаем, чтобы сохранить контракт с будущей реализацией
// и вызовами из UI — когда бэк появится, сигнатура не поменяется.
export async function uploadResults(participationId, payload) {
  // ← НОВОЕ: сообщаем ESLint'у, что параметры намеренно не используются
  void participationId
  void payload

  await delay(800)
  throw new Error('Загрузка результатов пока недоступна')
}