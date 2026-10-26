import { currentUser } from './currentUser'

export const teams = [
  {
    id: 1,
    name: 'Отряд «Наруто»',
    members: [
      { id: 1, name: currentUser.fullName, isCaptain: true },
      { id: 2, name: 'Петров Пётр Петрович', isCaptain: true }, // ← второй капитан (по ТЗ)
      { id: 3, name: 'Сидоров Сидор Сидорович', isCaptain: false },
      { id: 4, name: 'Смирнова Анна Сергеевна', isCaptain: false },
    ],
    template: {
      participantsCount: 4,
      comment: 'Будем с тортиком 🎂',
    },
  },
  {
    id: 2,
    name: 'Титаны',
    members: [
      { id: 5, name: currentUser.fullName, isCaptain: true },
      { id: 6, name: 'Кузнецов Максим Олегович', isCaptain: false },
      { id: 7, name: 'Морозова Ольга Викторовна', isCaptain: false },
    ],
    template: {
      participantsCount: 3,
      comment: '',
    },
  },
  {
    id: 3,
    name: 'Исекай-пати',
    members: [
      { id: 8, name: 'Пупкин Василий Иванович', isCaptain: true }, // ← не текущий пользователь
      { id: 9, name: 'Соколова Мария Андреевна', isCaptain: false },
    ],
    template: {
      participantsCount: 2,
      comment: '',
    },
  },
]

// Команды, где текущий пользователь — капитан (для формы регистрации)
export const captainTeams = teams.filter(t =>
  t.members.some(m => m.name === currentUser.fullName && m.isCaptain)
)