export function validateTeam(data) {
  const errors = {}

  if (!data.name.trim()) {
    errors.name = 'Укажите название команды'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Название слишком короткое'
  }

  if (data.members.length === 0) {
    errors.members = 'Добавьте хотя бы одного участника'
  } else {
    const emptyNames = data.members.filter(m => !m.name.trim())
    if (emptyNames.length > 0) {
      errors.members = 'У всех участников должны быть имена'
    }

    const captains = data.members.filter(m => m.isCaptain)
    if (captains.length === 0) {
      errors.captains = 'Назначьте хотя бы одного капитана'
    }
  }

  return errors
}