import { quizPlans as initial } from '../data/quizPlans'

let store = [...initial]
let nextId = Math.max(...initial.map(p => p.id), 0) + 1

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchPlans() {
  await delay(500)
  return store.map(p => ({ ...p, quizIds: [...p.quizIds] }))
}

export async function createPlan({ name, quizIds = [] }) {
  await delay(400)
  const trimmed = (name || '').trim()
  if (!trimmed) throw new Error('Название подборки не может быть пустым')

  const plan = {
    id: nextId++,
    name: trimmed,
    quizIds: [...quizIds],
    createdAt: new Date().toISOString().slice(0, 10),
    ownerId: 'me',
  }
  store.push(plan)
  return { ...plan, quizIds: [...plan.quizIds] }
}

export async function updatePlan(id, patch) {
  await delay(400)
  const idx = store.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Подборка не найдена')

  if (patch.name !== undefined) {
    const trimmed = String(patch.name).trim()
    if (!trimmed) throw new Error('Название подборки не может быть пустым')
    patch = { ...patch, name: trimmed }
  }

  const updated = {
    ...store[idx],
    ...patch,
    quizIds: patch.quizIds ? [...patch.quizIds] : [...store[idx].quizIds],
  }
  store[idx] = updated
  return { ...updated, quizIds: [...updated.quizIds] }
}

export async function deletePlan(id) {
  await delay(400)
  const idx = store.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Подборка не найдена')
  store.splice(idx, 1)
  return true
}