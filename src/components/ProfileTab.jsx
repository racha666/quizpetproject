import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import { formatPhone } from '../utils/phone'
import { validateProfile } from '../utils/profileValidation'
import { updateProfile } from '../api/profile'

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phone: formatPhone(user.phone || ''),
    email: user.email,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'saving' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const errors = validateProfile(formData)
  const hasErrors = Object.keys(errors).length > 0

  // Автосброс зелёного баннера через 2.5 сек
  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => setStatus('idle'), 2500)
    return () => clearTimeout(t)
  }, [status])

  function startEditing() {
    // Сбрасываем форму к актуальным данным пользователя
    setFormData({
      fullName: user.fullName,
      phone: formatPhone(user.phone || ''),
      email: user.email,
    })
    setSubmitAttempted(false)
    setErrorMessage('')
    setStatus('idle')
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setSubmitAttempted(false)
    setErrorMessage('')
    setStatus('idle')
  }

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handlePhoneChange(value) {
    setFormData(prev => ({ ...prev, phone: formatPhone(value) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitAttempted(true)
    if (hasErrors) return

    setStatus('saving')
    setErrorMessage('')

    try {
      const updated = await updateProfile(formData)
      updateUser(updated)          // ← обновляем контекст
      setStatus('success')
      setIsEditing(false)           // ← возвращаемся в view mode
    } catch (err) {
      setErrorMessage(err.message || 'Не удалось сохранить данные')
      setStatus('error')
    }
  }

  function showError(field) {
    return submitAttempted && errors[field]
  }

  // ===== VIEW MODE =====
  if (!isEditing) {
    return (
      <div>
        {status === 'success' && (
          <div className="profile-success">
            <span aria-hidden="true">✓</span>
            Данные успешно сохранены
          </div>
        )}

        <div className="profile-card">
          <div className="profile-row">
            <span className="profile-row__label">ФИО</span>
            <span className="profile-row__value">{user.fullName}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row__label">Телефон</span>
            <span className="profile-row__value">{user.phone || '—'}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row__label">Email</span>
            <span className="profile-row__value">{user.email}</span>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn--primary" type="button" onClick={startEditing}>
            Редактировать
          </button>
        </div>
      </div>
    )
  }

  // ===== EDIT MODE =====
  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && errorMessage && (
        <div className="error-banner">
          <strong>Ошибка сохранения</strong>
          {errorMessage}
        </div>
      )}

      {submitAttempted && hasErrors && (
        <div className="form__summary">
          <strong>Проверьте форму:</strong>
          <ul>
            {Object.values(errors).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form__group">
        <label className="form__label form__label-required" htmlFor="profile-name">
          ФИО
        </label>
        <input
          id="profile-name"
          className={`form__input ${showError('fullName') ? 'form__input--error' : ''}`}
          type="text"
          value={formData.fullName}
          onChange={e => handleFieldChange('fullName', e.target.value)}
          disabled={status === 'saving'}
        />
        {showError('fullName') && <p className="form__error">{errors.fullName}</p>}
      </div>

      <div className="form__group">
        <label className="form__label form__label-required" htmlFor="profile-phone">
          Телефон
        </label>
        <input
          id="profile-phone"
          className={`form__input ${showError('phone') ? 'form__input--error' : ''}`}
          type="tel"
          inputMode="tel"
          value={formData.phone}
          onChange={e => handlePhoneChange(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          disabled={status === 'saving'}
        />
        {showError('phone') && <p className="form__error">{errors.phone}</p>}
      </div>

      <div className="form__group">
        <label className="form__label form__label-required" htmlFor="profile-email">
          Email
        </label>
        <input
          id="profile-email"
          className={`form__input ${showError('email') ? 'form__input--error' : ''}`}
          type="email"
          value={formData.email}
          onChange={e => handleFieldChange('email', e.target.value)}
          disabled={status === 'saving'}
        />
        {showError('email') && <p className="form__error">{errors.email}</p>}
      </div>

      <div className="form__actions">
        <button
          className="btn btn--ghost"
          type="button"
          onClick={cancelEditing}
          disabled={status === 'saving'}
        >
          Отмена
        </button>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? (
            <>
              <span className="btn__spinner" aria-hidden="true"></span>
              Сохраняем...
            </>
          ) : (
            'Сохранить'
          )}
        </button>
      </div>
    </form>
  )
}

export default ProfileTab