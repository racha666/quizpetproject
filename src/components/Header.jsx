import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link className="logo" to="/">
          <span className="logo__mark">⛩️</span>
          <span className="logo__text">
            <span>Ani</span>Quiz
            <span className="logo__katakana">クイズ</span>
          </span>
        </Link>

        <label className="city-select">
          <span>📍</span>
          <select aria-label="Город" defaultValue="msk">
            <option value="msk">Москва</option>
            <option value="spb">Санкт-Петербург</option>
            <option value="ekb">Екатеринбург</option>
            <option value="nsk">Новосибирск</option>
            <option value="kzn">Казань</option>
          </select>
        </label>

        <nav className="nav" aria-label="Основная навигация">
          <Link className="nav__link nav__link--accent" to="/">Игрокам</Link>
          <a className="nav__link" href="#">Организаторам</a>
          <a className="nav__link" href="#">Вопросы</a>
        </nav>

        {user ? (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => setMenuOpen(v => !v)}
            >
              {user.fullName} ▾
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--card)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                minWidth: 200,
                padding: 6,
                zIndex: 100,
                boxShadow: 'var(--shadow)',
              }}>
                <Link
                  to="/account"
                  className="nav__link"
                  style={{ display: 'block' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Личный кабинет
                </Link>
                <button
                  type="button"
                  className="nav__link"
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link className="btn btn--primary" to="/login">
            Войти
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header