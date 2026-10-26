import { useAuth } from '../context/useAuth'

function TeamCard({ team, onEdit, onDelete }) {
  const { user } = useAuth()
  const captains = team.members.filter(m => m.isCaptain)
  const userIsCaptain = team.members.some(
    m => m.name === user.fullName && m.isCaptain
  )

  return (
    <article className="team-card">
      <div className="team-card__header">
        <h3 className="team-card__title">{team.name}</h3>
        {userIsCaptain && (
          <span className="team-card__badge" title="Вы капитан этой команды">
            主将
          </span>
        )}
      </div>

      <div className="team-card__stats">
        <span>
          <strong>{team.members.length}</strong> участник(ов)
        </span>
        <span className="team-card__dot">·</span>
        <span>
          <strong>{captains.length}</strong> капитан(ов)
        </span>
      </div>

      <div className="team-card__captains">
        <span className="team-card__label">Капитаны:</span>
        {captains.map(c => (
          <span key={c.id} className="team-card__captain">
            {c.name}
          </span>
        ))}
      </div>

      {userIsCaptain ? (
        <div className="team-card__actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => onEdit(team)}
          >
            Редактировать
          </button>
          <button
            className="btn btn--danger-ghost"
            type="button"
            onClick={() => onDelete(team)}
          >
            Удалить
          </button>
        </div>
      ) : (
        <p className="team-card__hint">
          Только капитаны могут редактировать команду
        </p>
      )}
    </article>
  )
}

export default TeamCard