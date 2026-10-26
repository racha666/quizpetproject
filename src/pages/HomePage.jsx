import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizzes } from '../data/quizzes'
import Hero from '../components/Hero'
import FilterChips from '../components/FilterChips'
import QuizCard from '../components/QuizCard'

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  const filteredQuizzes = activeFilter === 'all'
    ? quizzes
    : quizzes.filter(q => q.theme === activeFilter)

  function handleRegisterClick(quizId) {
    navigate(`/register?quizId=${quizId}`)
  }

  return (
    <>
      <Hero />
      <FilterChips activeFilter={activeFilter} onChange={setActiveFilter} />

      <main className="container">
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
      </main>
    </>
  )
}

export default HomePage