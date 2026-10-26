const HANKO = {
  open: '空',
  few: '少',
  sold: '満',
}

function QuizCard({ quiz, onRegister }) {
  return (
    <article className="card">
      <div className="card__cover" style={{ background: quiz.cover }}>
        <span className="card__genre">{quiz.genre}</span>
        <span className={`badge badge--${quiz.status}`}>
          <span className="badge__hanko" aria-hidden="true">
            {HANKO[quiz.status] || '？'}
          </span>
          {quiz.statusText}
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
            disabled={quiz.status === 'sold'}
            onClick={() => onRegister(quiz.id)}
          >
            {quiz.status === 'sold' ? 'Мест нет' : 'Регистрация'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default QuizCard