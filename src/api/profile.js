function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function updateProfile(data) {
  await delay(800)
  // Имитация ошибки для демонстрации (можно удалить)
  if (data.email === 'error@example.com') {
    throw new Error('Этот email уже занят другим пользователем')
  }
  return data
}