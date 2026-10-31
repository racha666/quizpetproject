import { getQuizBadge, getQuizAction } from '../utils/quizStatus'

function QuizCard({ quiz, onRegister }) {
  const badge = getQuizBadge(quiz)
  const action = getQuizAction(quiz)
  const badgeTitle =
    quiz.lifecycle === 'cancelled' && quiz.cancellationReason
      ? quiz.cancellationReason
      : undefined

  return (
    <article className="card">
      <div className="card__cover" style={{ background: quiz.cover }}>
        <span className="card__genre">{quiz.genre}</span>
        <span className={`badge ${badge.className}`} title={badgeTitle}>
          <span className="badge__hanko" aria-hidden="true">
            {badge.kanji}
          </span>
          {badge.text}
        </span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{quiz.title}</h3>
        <p className="card__desc">{quiz.desc}</p>

        <div className="card__tags">
          {quiz.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="card__meta">
          <div className="card__meta-row">
            <span>🕐</span>
            <span>{quiz.date}</span>
          </div>
          <div className="card__meta-row">
            <span>📍</span>
            <span>
              {quiz.place} ·{' '}
              <a
                className="card__place"
                href={quiz.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                на карте
              </a>
            </span>
          </div>
        </div>

        <div className="card__footer">
          <span className={`card__price ${quiz.free ? 'card__price--free' : ''}`}>
            {quiz.price}
            {!quiz.free && <small> / команда</small>}
          </span>
          <button
            className="btn btn--primary"
            type="button"
            disabled={action.disabled}
            onClick={() => onRegister(quiz.id)}
          >
            {action.label}
          </button>
        </div>
      </div>
    </article>
  )
}

export default QuizCard