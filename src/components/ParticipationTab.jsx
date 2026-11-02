import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchParticipations, uploadResults } from '../api/participations'   // ← добавили uploadResults
import { quizzes } from '../data/quizzes'
import ConfirmDialog from './ConfirmDialog'                                  // ← НОВОЕ
import ParticipationCardSkeleton from './ParticipationCardSkeleton'

// ← НОВОЕ: словарь статусов участия (не путать со статусами квиза из quizStatus.js)
const STATUS = {
  planned:   { kanji: '予', text: 'Предстоит', className: 'participation-status--planned'   },
  completed: { kanji: '済', text: 'Завершён',  className: 'participation-status--completed' },
  cancelled: { kanji: '否', text: 'Отменён',   className: 'participation-status--cancelled' },
  'no-show': { kanji: '欠', text: 'Не пришёл', className: 'participation-status--noshow'    },
}

function ParticipationCard({ participation }) {
  //Принудительно вызвать ошибку
  /*
  if (participation.id === 1) {
    throw new Error('Тест Error Boundary')
  }
  */
  const quiz = quizzes.find(q => q.id === participation.quizId) || null
  const status = STATUS[participation.status] || STATUS.planned

  // ← НОВОЕ: состояние панели капитана
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('idle')   // 'idle' | 'uploading' | 'error'
  const [uploadError, setUploadError] = useState('')

  const canUpload =
    participation.isCaptain && participation.status === 'completed'

  async function handleConfirmUpload() {
    setUploadStatus('uploading')
    setUploadError('')
    try {
      // мок-заглушка: сейчас всегда бросает «пока недоступно»
      await uploadResults(participation.id, { source: 'manual' })
      // когда бэк появится — здесь обновим participation.results
    } catch (err) {
      setUploadError(err.message || 'Не удалось загрузить результаты')
      setUploadStatus('error')
    } finally {
      setDialogOpen(false)
    }
  }

  return (
    <article className="participation-card">
      <header className="participation-card__header">
        <h4 className="participation-card__title">
          {quiz ? quiz.title : 'Квиз недоступен'}
        </h4>
        <span className={`participation-status ${status.className}`}>
          <span className="participation-status__hanko" aria-hidden="true">
            {status.kanji}
          </span>
          {status.text}
        </span>
      </header>

      {quiz && (
        <div className="participation-card__meta">
          <div className="participation-card__row">
            <span aria-hidden="true">📅</span>
            <span>{quiz.date}</span>
          </div>
          <div className="participation-card__row">
            <span aria-hidden="true">🏢</span>
            <span>{quiz.organizer}</span>
          </div>
          <div className="participation-card__row">
            <span aria-hidden="true">📍</span>
            <span>{quiz.place}</span>
          </div>
        </div>
      )}

      <div className="participation-card__team">
        {participation.teamName ? (
          <>
            <span className="participation-card__label">Команда:</span>
            <span>{participation.teamName}</span>
            {participation.isCaptain && (
              <span
                className="participation-card__captain-badge"
                title="Вы были капитаном"
              >
                主将
              </span>
            )}
          </>
        ) : (
          <span className="participation-card__label">Без команды (соло)</span>
        )}
      </div>

      {participation.status === 'completed' && participation.place != null && (
        <div className="participation-card__place">
          🏆 {participation.place} место
        </div>
      )}

      {participation.status === 'cancelled' && participation.cancellationReason && (
        <div className="participation-card__reason">
          {participation.cancellationReason}
        </div>
      )}

      <details className="participation-card__details">
        <summary className="participation-card__summary">
          Подробнее
        </summary>
        <div className="participation-card__expanded">
          <div className="participation-card__section">
            <h5 className="participation-card__section-title">Состав</h5>
            <ol className="participation-card__members-list">
              {participation.members.map((member, i) => (
                <li key={i}>{member}</li>
              ))}
            </ol>
          </div>

          {participation.status === 'completed' && (
            <div className="participation-card__section">
              <h5 className="participation-card__section-title">Результаты</h5>
              {participation.results ? (
                <span>Результаты доступны</span>
              ) : (
                <span className="participation-card__results-empty">
                  Результаты пока не загружены. Организатор загрузит их после квиза.
                </span>
              )}
            </div>
          )}

          {/* ← НОВОЕ: панель капитана */}
          {canUpload && (
            <div className="participation-card__captain-panel">
              {uploadStatus === 'error' && uploadError && (
                <div className="participation-card__upload-error">
                  {uploadError}
                </div>
              )}
              <button
                className="btn btn--ghost btn--block"
                type="button"
                onClick={() => setDialogOpen(true)}
                disabled={uploadStatus === 'uploading'}
              >
                Загрузить результаты
              </button>
            </div>
          )}
        </div>
      </details>

      {/* ← НОВОЕ: диалог подтверждения */}
      {dialogOpen && (
        <ConfirmDialog
          title="Загрузить результаты?"
          message={`Результаты для «${quiz ? quiz.title : 'квиза'}» будут загружены. Это действие нельзя отменить.`}
          confirmLabel="Загрузить"
          loadingLabel="Загружаем..."
          onConfirm={handleConfirmUpload}
          onCancel={() => setDialogOpen(false)}
          isLoading={uploadStatus === 'uploading'}
        />
      )}
    </article>
  )
}

// ← НОВОЕ: склонение «1 участие / 2 участия / 5 участий»
function pluralizeParticipations(n) {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return 'участий'
  if (last > 1 && last < 5) return 'участия'
  if (last === 1) return 'участие'
  return 'участий'
}

function ParticipationTab() {
  const [participations, setParticipations] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)   // ← НОВОЕ: триггер перезагрузки

  useEffect(() => {
    let cancelled = false

    fetchParticipations()
      .then(data => {
        if (cancelled) return
        setParticipations(data)
        setStatus('success')
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Не удалось загрузить участия')
        setStatus('error')
      })

    return () => { cancelled = true }
  }, [reloadToken])   // ← НОВОЕ: перезапуск при retry

  function handleRetry() {
    setStatus('loading')
    setError('')
    setReloadToken(t => t + 1)
  }

  // ── Состояния ────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div>
        <div className="teams-header">
          <div>
            <h3 className="teams-header__title">Мои участия</h3>
            <p className="teams-header__subtitle">Загрузка...</p>
          </div>
        </div>
        <div className="participations-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <ParticipationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <div className="error-banner">
          <strong>Ошибка загрузки</strong>
          {error}
        </div>
        <button className="btn btn--ghost" type="button" onClick={handleRetry}>
          Попробовать снова
        </button>
      </div>
    )
  }

  if (!participations || participations.length === 0) {
    return (
      <div className="teams-empty">
        <p>Здесь появятся квизы, на которые вы зарегистрируетесь.</p>
        <Link to="/" className="btn btn--primary">Найти квиз</Link>
      </div>
    )
  }

  // ── Успех: делим на предстоящие / прошедшие ─────────────
  const upcoming = participations.filter(p => p.status === 'planned')
  const past = participations.filter(p => p.status !== 'planned')

  return (
    <div>
      <div className="teams-header">
        <div>
          <h3 className="teams-header__title">Мои участия</h3>
          <p className="teams-header__subtitle">
            {participations.length} {pluralizeParticipations(participations.length)}
          </p>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h3 className="participation-section__title">Предстоящие</h3>
          <div className="participations-grid">
            {upcoming.map(p => (
              <ParticipationCard key={p.id} participation={p} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="participation-section__title">Прошедшие</h3>
          <div className="participations-grid">
            {past.map(p => (
              <ParticipationCard key={p.id} participation={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ParticipationTab