import { templates as initialTemplates } from '../data/templates'

let store = JSON.parse(JSON.stringify(initialTemplates))

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchTemplates() {
  await delay(400)
  return JSON.parse(JSON.stringify(store))
}

export async function createTemplate(data) {
  await delay(500)
  const created = { id: Date.now(), ...data }
  store = [...store, created]
  return created
}

export async function updateTemplate(id, data) {
  await delay(500)
  store = store.map(t => (t.id === id ? { ...t, ...data } : t))
  return store.find(t => t.id === id)
}

export async function deleteTemplate(id) {
  await delay(300)
  store = store.filter(t => t.id !== id)
  return { success: true }
}