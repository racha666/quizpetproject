import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlans, createPlan, deletePlan } from '../api/quizPlans'
import { quizzes } from '../data/quizzes'
import PlansTabSkeleton from './PlansTabSkeleton'
import CreatePlanDialog from './CreatePlanDialog'
import ConfirmDialog from './ConfirmDialog'

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function pluralize(n, [one, few, many]) {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}

function PlansTab() {
  const [plans, setPlans] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [createStatus, setCreateStatus] = useState('idle')
  const [createError, setCreateError] = useState('')

  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleteStatus, setDeleteStatus] = useState('idle')
  const [actionError, setActionError] = useState('')

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

  async function handleCreate(name) {
    setCreateStatus('creating')
    setCreateError('')
    try {
      const created = await createPlan({ name })
      setPlans(prev => [...prev, created])
      setCreateOpen(false)
    } catch (err) {
      setCreateError(err.message || 'Не удалось создать подборку')
    } finally {
      setCreateStatus('idle')
    }
  }

  async function handleConfirmDelete() {
    if (!deleteCandidate) return
    setDeleteStatus('deleting')
    setActionError('')
    try {
      await deletePlan(deleteCandidate.id)
      setPlans(prev => prev.filter(p => p.id !== deleteCandidate.id))
      setDeleteCandidate(null)
    } catch (err) {
      setActionError(err.message || 'Не удалось удалить подборку')
    } finally {
      setDeleteStatus('idle')
    }
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

  const countLabel = `${plans.length} ${pluralize(plans.length, ['подборка', 'подборки', 'подборок'])}`

  return (
    <div>
      <div className="teams-header">
        <div>
          <h3 className="teams-header__title">Мои подборки</h3>
          <p className="teams-header__subtitle">{countLabel}</p>
        </div>
        <button
          className="btn btn--primary"
          type="button"
          onClick={() => { setCreateError(''); setCreateOpen(true) }}
        >
          + Создать подборку
        </button>
      </div>

      {actionError && (
        <div className="error-banner" style={{ marginBottom: 16 }}>
          <strong>Ошибка</strong>
          {actionError}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="teams-empty">
          <p>Подборок пока нет. Создайте первую или добавьте квиз кнопкой «＋» на карточке.</p>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => { setCreateError(''); setCreateOpen(true) }}
          >
            Создать подборку
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {plans.map(plan => {
            const planQuizzes = plan.quizIds
              .map(id => quizzes.find(q => q.id === id))
              .filter(Boolean)
            return (
              <div key={plan.id} className="plan-tab-card-wrapper">
                <Link
                  to={`/plan/${plan.id}`}
                  className="team-card team-card--link"
                >
                  <div className="team-card__header">
                    <h4 className="team-card__title">{plan.name}</h4>
                  </div>
                  <div className="team-card__stats">
                    <strong>{planQuizzes.length}</strong>{' '}
                    {pluralize(planQuizzes.length, ['квиз', 'квиза', 'квизов'])}
                    <span className="team-card__dot">·</span>
                    <span>{formatDate(plan.createdAt)}</span>
                  </div>
                  <ul className="plan-card__list">
                    {planQuizzes.length === 0 ? (
                      <li className="plan-card__empty">Пока пусто</li>
                    ) : (
                      <>
                        {planQuizzes.slice(0, 3).map(q => (
                          <li key={q.id}>{q.title}</li>
                        ))}
                        {planQuizzes.length > 3 && (
                          <li className="plan-card__more">
                            и ещё {planQuizzes.length - 3}...
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </Link>
                <button
                  className="plan-tab-remove"
                  type="button"
                  onClick={() => setDeleteCandidate(plan)}
                  title="Удалить подборку"
                  aria-label={`Удалить подборку «${plan.name}»`}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {createOpen && (
        <CreatePlanDialog
          onCreate={handleCreate}
          onCancel={() => setCreateOpen(false)}
          isSubmitting={createStatus === 'creating'}
          serverError={createError}
        />
      )}

      {deleteCandidate && (
        <ConfirmDialog
          title="Удалить подборку?"
          message={`Подборка «${deleteCandidate.name}» будет удалена. Квизы останутся в системе.`}
          confirmLabel="Удалить"
          loadingLabel="Удаляем..."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteCandidate(null)}
          isDanger
          isLoading={deleteStatus === 'deleting'}
        />
      )}
    </div>
  )
}

export default PlansTab