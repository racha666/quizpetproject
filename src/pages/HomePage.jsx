import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchQuizzes } from '../api/quizzes'                          // ← было: import { quizzes } from '../data/quizzes'
import Hero from '../components/Hero'
import FilterChips from '../components/FilterChips'
import QuizCard from '../components/QuizCard'
import QuizCardSkeleton from '../components/QuizCardSkeleton'          // ← НОВОЕ

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [quizzes, setQuizzes] = useState(null)                         // ← НОВОЕ
  const [status, setStatus] = useState('loading')                      // ← НОВОЕ
  const [error, setError] = useState('')                               // ← НОВОЕ
  const [reloadToken, setReloadToken] = useState(0)                    // ← НОВОЕ
  const navigate = useNavigate()

  useEffect(() => {                                                    // ← НОВОЕ
    let cancelled = false

    fetchQuizzes()
      .then(data => {
        if (cancelled) return
        setQuizzes(data)
        setStatus('success')
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Не удалось загрузить квизы')
        setStatus('error')
      })

    return () => { cancelled = true }
  }, [reloadToken])

  function handleRetry() {                                             // ← НОВОЕ
    setStatus('loading')
    setError('')
    setReloadToken(t => t + 1)
  }

  function handleRegisterClick(quizId) {
    navigate(`/register?quizId=${quizId}`)
  }

  const filteredQuizzes = !quizzes                                     // ← НОВОЕ: безопасный fallback пока null
    ? []
    : activeFilter === 'all'
      ? quizzes
      : quizzes.filter(q => q.theme === activeFilter)

  return (
    <>
      <Hero />
      <FilterChips activeFilter={activeFilter} onChange={setActiveFilter} />

      <main className="container">
        {status === 'loading' && (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <QuizCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <>
            <div className="error-banner">
              <strong>Ошибка загрузки</strong>
              {error}
            </div>
            <button className="btn btn--ghost" type="button" onClick={handleRetry}>
              Попробовать снова
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="grid">
              {filteredQuizzes.map(quiz => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onRegister={handleRegisterClick}
                />
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
                По этому фильтру квизов пока нет 😔
              </p>
            )}
          </>
        )}
      </main>
    </>
  )
}

export default HomePage