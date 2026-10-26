const USER_KEY = 'quizpetproject:user'

export function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    // Если в хранилище битый JSON или что-то ещё — не падаем, возвращаем null
    return null
  }
}

export function saveUser(user) {
  try {
    if (user === null) {
      localStorage.removeItem(USER_KEY)
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  } catch {
    // Если localStorage недоступен (приватный режим, переполнение) — молча игнорируем
  }
}