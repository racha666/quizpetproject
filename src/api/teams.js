import { teams as initialTeams } from '../data/teams'

// In-memory «сервер». В реальности — fetch к API.
let store = JSON.parse(JSON.stringify(initialTeams))

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchTeams() {
  await delay(500)
  return JSON.parse(JSON.stringify(store))
}

export async function createTeam(data) {
  await delay(600)
  const newTeam = {
    id: Date.now(),
    name: data.name,
    members: data.members,
    template: { participantsCount: data.members.length, comment: '' },
  }
  store = [...store, newTeam]
  return newTeam
}

export async function updateTeam(id, data) {
  await delay(600)
  store = store.map(t =>
    t.id === id
      ? { ...t, name: data.name, members: data.members }
      : t
  )
  return store.find(t => t.id === id)
}

export async function deleteTeam(id) {
  await delay(400)
  store = store.filter(t => t.id !== id)
  return { success: true }
}