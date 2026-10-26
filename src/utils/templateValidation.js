export function validateTemplate(data) {
  const errors = {}

  if (!data.name.trim()) {
    errors.name = 'Укажите название шаблона'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Название слишком короткое'
  }

  if (
    !Number.isInteger(data.participantsCount) ||
    data.participantsCount < 1 ||
    data.participantsCount > 12
  ) {
    errors.participantsCount = 'От 1 до 12 человек'
  }

  return errors
}