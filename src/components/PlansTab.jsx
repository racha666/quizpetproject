import { useState, useEffect } from 'react'
import { fetchPlans } from '../api/quizPlans'
import { quizzes } from '../data/quizzes'
import PlansTabSkeleton from './PlansTabSkeleton'
import { Link } from 'react-router-dom'

function PlansTab() {
  const [plans, setPlans] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchPlans()
      .then(data => {
        if (cancelled) return
        setPlans(data)
        setStatus('success')
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Не удалось загрузить подборки')
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [reloadToken])

  function handleRetry() {
    setStatus('loading')
    setError('')
    setReloadToken(t => t + 1)
  }

  if (status === 'loading') {
    return (
      <div>
        <div className="teams-header">
          <div>
            <h3 className="teams-header__title">Мои подборки</h3>
            <p className="teams-header__subtitle">Загрузка...</p>
          </div>
        </div>
        <div className="teams-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <PlansTabSkeleton key={i} />
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

  if (!plans || plans.length === 0) {
    return (
      <div className="teams-empty">
        <p>Подборок пока нет. Добавляйте квизы кнопкой «＋» на карточке.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="teams-header">
        <div>
          <h3 className="teams-header__title">Мои подборки</h3>
          <p className="teams-header__subtitle">{plans.length} подборок</p>
        </div>
      </div>

      <div className="teams-grid">
        {plans.map(plan => {
          const planQuizzes = plan.quizIds
            .map(id => quizzes.find(q => q.id === id))
            .filter(Boolean)
          return (
          <Link
            key={plan.id}
            to={`/plan/${plan.id}`}
            className="team-card team-card--link"
          >
            <div className="team-card__header">
              <h4 className="team-card__title">{plan.name}</h4>
            </div>
            <div className="team-card__stats">
              <strong>{planQuizzes.length}</strong> квизов
            </div>
            <ul className="plan-card__list">
              {planQuizzes.slice(0, 3).map(q => (
                <li key={q.id}>{q.title}</li>
              ))}
              {planQuizzes.length > 3 && (
                <li className="plan-card__more">
                  и ещё {planQuizzes.length - 3}...
                </li>
              )}
            </ul>
          </Link>
          )
        })}
      </div>
    </div>
  )
}

export default PlansTab