function TemplateCard({ template, teams, onEdit, onDelete }) {
  const team = teams.find(t => t.id === template.teamId)

  return (
    <article className="template-card">
      <div className="template-card__header">
        <h3 className="template-card__title">{template.name}</h3>
        {template.hasBirthdayPerson && (
          <span
            className="template-card__badge"
            title="С именинником"
            aria-label="С именинником"
          >
            🎂
          </span>
        )}
      </div>

      <div className="template-card__meta">
        <div className="template-card__row">
          <span className="template-card__label">Команда</span>
          <span className="template-card__value">{team ? team.name : '— не выбрана —'}</span>
        </div>
        <div className="template-card__row">
          <span className="template-card__label">Участников</span>
          <span className="template-card__value">{template.participantsCount}</span>
        </div>
        {template.comment && (
          <div className="template-card__row">
            <span className="template-card__label">Комментарий</span>
            <span className="template-card__value template-card__value--truncate">
              {template.comment}
            </span>
          </div>
        )}
      </div>

      <div className="template-card__actions">
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => onEdit(template)}
        >
          Редактировать
        </button>
        <button
          className="btn btn--danger-ghost"
          type="button"
          onClick={() => onDelete(template)}
        >
          Удалить
        </button>
      </div>
    </article>
  )
}

export default TemplateCard