import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchPlans, updatePlan } from '../api/quizPlans'
import { quizzes as allQuizzes } from '../data/quizzes'
import { downloadIcs } from '../utils/ics'
import QuizCard from '../components/QuizCard'

function PlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchPlans()
      .then(data => {
        if (cancelled) return
        const found = data.find(p => p.id === Number(id))
        if (!found) {
          setStatus('not-found')
          return
        }
        setPlan(found)
        setStatus('success')
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Не удалось загрузить подборку')
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [id, reloadToken])

  async function handleRemoveQuiz(quizId) {
    if (!plan) return
    setRemovingId(quizId)
    try {
      const nextQuizIds = plan.quizIds.filter(qid => qid !== quizId)
      const updated = await updatePlan(plan.id, { quizIds: nextQuizIds })
      setPlan(updated)
    } catch (err) {
      setError(err.message || 'Не удалось убрать квиз')
    } finally {
      setRemovingId(null)
    }
  }

  function handleDownload() {
    if (!plan) return
    const planQuizzes = plan.quizIds
      .map(qid => allQuizzes.find(q => q.id === qid))
      .filter(q => q && q.dateISO)
    if (planQuizzes.length === 0) return
    downloadIcs(planQuizzes, `${plan.name}.ics`, plan.name)
  }

  function handleRegisterClick(quizId) {
    navigate(`/register?quizId=${quizId}`)
  }

  if (status === 'loading') {
    return (
      <main className="container" style={{ paddingTop: '32px' }}>
        <p style={{ color: 'var(--muted)' }}>Загружаем подборку...</p>
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="container" style={{ paddingTop: '32px' }}>
        <div className="teams-empty">
          <p>Подборка не найдена.</p>
          <Link to="/account" className="btn btn--ghost">
            ← В личный кабинет
          </Link>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="container" style={{ paddingTop: '32px' }}>
        <div className="error-banner">
          <strong>Ошибка</strong>
          {error}
        </div>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => {
            setStatus('loading')
            setError('')
            setReloadToken(t => t + 1)
          }}
        >
          Попробовать снова
        </button>
      </main>
    )
  }

  const planQuizzes = plan.quizIds
    .map(qid => allQuizzes.find(q => q.id === qid))
    .filter(Boolean)

  return (
    <main className="container" style={{ paddingTop: '32px' }}>
      <button
        className="btn btn--ghost"
        type="button"
        onClick={() => navigate('/account')}
      >
        ← В личный кабинет
      </button>

      <div className="plan-header">
        <div>
          <h1 className="plan-header__title">{plan.name}</h1>
          <p className="plan-header__subtitle">
            {planQuizzes.length} квизов · создана {plan.createdAt}
          </p>
        </div>
        <button
          className="btn btn--gold"
          type="button"
          onClick={handleDownload}
          disabled={planQuizzes.length === 0}
        >
          Скачать .ics
        </button>
      </div>

      {planQuizzes.length === 0 ? (
        <div className="teams-empty">
          <p>В этой подборке пока нет квизов.</p>
          <Link to="/" className="btn btn--primary">Найти квиз</Link>
        </div>
      ) : (
        <>
          <div className="plan-quizzes">
            {planQuizzes.map(quiz => (
              <div key={quiz.id} className="plan-quiz-wrapper">
                <QuizCard quiz={quiz} onRegister={handleRegisterClick} />
                <button
                  className="plan-quiz-remove"
                  type="button"
                  onClick={() => handleRemoveQuiz(quiz.id)}
                  disabled={removingId === quiz.id}
                  title="Убрать из подборки"
                >
                  {removingId === quiz.id ? '...' : '×'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

export default PlanPage