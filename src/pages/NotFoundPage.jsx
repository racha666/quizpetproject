import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Такой страницы нет</p>
      <Link to="/" className="btn btn--primary" style={{ marginTop: 24, display: 'inline-flex' }}>
        На главную
      </Link>
    </main>
  )
}

export default NotFoundPage