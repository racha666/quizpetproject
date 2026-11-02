import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchQuizzes } from '../api/quizzes'
import Hero from '../components/Hero'
import FiltersBar from '../components/FiltersBar'         // ← было FilterChips
import QuizCard from '../components/QuizCard'
import QuizCardSkeleton from '../components/QuizCardSkeleton'

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [quizzes, setQuizzes] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
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

  function handleRetry() {
    setStatus('loading')
    setError('')
    setReloadToken(t => t + 1)
  }

  function handleRegisterClick(quizId) {
    navigate(`/register?quizId=${quizId}`)
  }

  const filteredQuizzes = !quizzes
    ? []
    : quizzes
        .filter(q => activeFilter === 'all' || q.difficulty === activeFilter)
        .filter(q => {
          const ql = searchQuery.trim().toLowerCase()
          if (!ql) return true
          return (
            q.title.toLowerCase().includes(ql) ||
            q.organizer.toLowerCase().includes(ql) ||
            q.tags.some(t => t.toLowerCase().includes(ql))
          )
        })

  return (
    <>
      <Hero />
      <FiltersBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredQuizzes.length}
        totalCount={quizzes ? quizzes.length : 0}
      />

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
                {searchQuery.trim()
                  ? `По запросу «${searchQuery}» ничего не найдено 😔`
                  : 'По этому фильтру квизов пока нет 😔'}
              </p>
            )}
          </>
        )}
      </main>
    </>
  )
}

export default HomePage