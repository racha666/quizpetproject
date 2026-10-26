import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import ProfileTab from '../components/ProfileTab'
import TeamsTab from '../components/TeamsTab'
import TemplatesTab from '../components/TemplatesTab'

const TABS = [
  { key: 'profile', label: 'Профиль' },
  { key: 'teams', label: 'Команды' },
  { key: 'templates', label: 'Шаблоны' },
]

function AccountPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="container" style={{ paddingTop: '32px' }}>
      <span className="katakana">アカウント</span>
      <h1 style={{ fontFamily: 'var(--font-display)' }}>Личный кабинет</h1>
      <p style={{ color: 'var(--muted)', marginTop: 8 }}>
        {user.fullName} · {user.email}
      </p>

      <div className="filters" style={{ marginTop: 24, padding: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`chip ${activeTab === tab.key ? 'chip--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 24,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'teams' && <TeamsTab />}
        {activeTab === 'templates' && <TemplatesTab />}
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/" className="btn btn--ghost">← К списку квизов</Link>
      </div>
    </main>
  )
}

export default AccountPage