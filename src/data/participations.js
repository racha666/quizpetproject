// src/data/participations.js
//
// «Участие» — это снимок: что было на момент квиза.
// Часть полей денормализована (teamName, members) — чтобы не терять историю,
// если команду переименуют или из неё уйдут участники.
//
// Поля квиза (title, date, organizer, place) НЕ дублируются — берём через quizId
// из src/data/quizzes.js. Если квиз удалят — UI покажет «квиз недоступен».
//
// results: null — вариант C: как будут заполняться результаты, пока не решено.

export const participations = [
  {
    id: 1,
    quizId: 7,                                // «Клинок, рассекающий демонов»
    teamId: 1,                                // «Ночные сакуры»
    teamName: 'Ночные сакуры',                // снимок названия
    members: ['Иванов Иван', 'Петров Пётр', 'Сидорова Анна'], // снимок состава
    isCaptain: true,                          // был ли текущий юзер капитаном
    status: 'completed',                      // planned | completed | cancelled | no-show
    place: 3,                                 // занятое место в рейтинге (null если нет)
    results: null,                            // ← вариант C: пока не загружены
    cancellationReason: null,
  },
  {
    id: 2,
    quizId: 8,                                // Сёдзё-квиз (отменён)
    teamId: 1,
    teamName: 'Ночные сакуры',
    members: ['Иванов Иван', 'Петров Пётр'],
    isCaptain: true,
    status: 'cancelled',
    place: null,
    results: null,
    cancellationReason: 'Организатор заболел, новая дата — TBA',
  },
  {
    id: 3,
    quizId: 2,                                // «Атака Титанов» — предстоящий
    teamId: 2,
    teamName: 'Титаны и К',
    members: ['Иванов Иван', 'Смирнов Олег'],
    isCaptain: false,                         // участвую, но не капитан
    status: 'planned',
    place: null,
    results: null,
    cancellationReason: null,
  },
  {
    id: 4,
    quizId: 1,                                // «Наруто» — прошёл, но не пришёл
    teamId: null,                             // соло-участие (без команды)
    teamName: null,
    members: ['Иванов Иван'],
    isCaptain: false,
    status: 'no-show',
    place: null,
    results: null,
    cancellationReason: null,
  },
]