import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { currentUser } from '../data/currentUser'

function LoginPage() {
  const [email, setEmail] = useState(currentUser.email)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Введите корректный email')
      return
    }
    // Мок-вход: в реальности — запрос к бэку, получение токена
    login({
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      email,
    })
    navigate('/account')
  }

  return (
    <main className="container" style={{ paddingTop: '32px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>Вход в QuizPetProject</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
          Это мок-вход для пет-проекта. Пароль не нужен.
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate style={{ marginTop: 24 }}>
          <div className="form__group">
            <label className="form__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={`form__input ${error ? 'form__input--error' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
            />
            {error && <p className="form__error">{error}</p>}
          </div>

          <button className="btn btn--primary btn--block" type="submit">
            Войти
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage