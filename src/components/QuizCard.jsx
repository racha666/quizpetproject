import { useState } from 'react'
import { getQuizBadge, getQuizAction } from '../utils/quizStatus'
import AddToPlanDialog from './AddToPlanDialog'
import { buildGoogleCalendarUrl } from '../utils/googleCalendar'

function QuizCard({ quiz, onRegister }) {
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const badge = getQuizBadge(quiz)
  const action = getQuizAction(quiz)
  const badgeTitle =
    quiz.lifecycle === 'cancelled' && quiz.cancellationReason
      ? quiz.cancellationReason
      : undefined

  const gcalUrl = buildGoogleCalendarUrl(quiz)

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

        <div className="card__actions">
          {gcalUrl && (
            <a
              className="card__icon-btn"
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Добавить в Google Calendar"
              aria-label="Добавить в Google Calendar"
            >
              📅
            </a>
          )}
          <button
            className="card__icon-btn"
            type="button"
            onClick={() => setPlanDialogOpen(true)}
            title="Добавить в подборку"
            aria-label="Добавить в подборку"
          >
            ＋
          </button>
        </div>
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
          <div className="card__footer-info">
            <span
              className="card__difficulty"
              title={`Сложность: ${quiz.difficulty} из 5`}
            >
              <span className="card__difficulty-label">Сложность:</span>
              {'★'.repeat(quiz.difficulty)}
              {quiz.difficulty < 5 && (
                <span className="card__difficulty-dim">
                  {' '}({quiz.difficulty}/5)
                </span>
              )}
            </span>
            <span className={`card__price ${quiz.free ? 'card__price--free' : ''}`}>
              {quiz.price}
              {!quiz.free && <small> / человек</small>}
            </span>
          </div>
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

      {planDialogOpen && (
        <AddToPlanDialog
          quiz={quiz}
          onClose={() => setPlanDialogOpen(false)}
        />
      )}
    </article>
  )
}

export default QuizCard