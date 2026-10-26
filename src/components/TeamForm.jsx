import { useState } from 'react'
import { validateTeam } from '../utils/teamValidation'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function makeEmptyMember(isCaptain = false) {
  return { id: makeId(), name: '', isCaptain }
}

function TeamForm({ initialTeam, onSubmit, onCancel, isSubmitting, serverError }) {
  const [formData, setFormData] = useState(() => {
    if (initialTeam) {
      return {
        name: initialTeam.name,
        members: initialTeam.members.map(m => ({ ...m })),
      }
    }
    // Новая команда: один участник, сразу капитан
    return {
      name: '',
      members: [makeEmptyMember(true)],
    }
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = validateTeam(formData)
  const hasErrors = Object.keys(errors).length > 0

  function handleNameChange(value) {
    setFormData(prev => ({ ...prev, name: value }))
  }

  function handleMemberNameChange(memberId, value) {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, name: value } : m
      ),
    }))
  }

  function handleMemberCaptainToggle(memberId) {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, isCaptain: !m.isCaptain } : m
      ),
    }))
  }

  function handleAddMember() {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, makeEmptyMember(false)],
    }))
  }

  function handleRemoveMember(memberId) {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId),
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitAttempted(true)
    if (hasErrors) return
    onSubmit({ name: formData.name.trim(), members: formData.members })
  }

  function showError(field) {
    return submitAttempted && errors[field]
  }

  const isEdit = Boolean(initialTeam)

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">{isEdit ? 'Редактирование команды' : 'Новая команда'}</h2>

      {serverError && (
        <div className="error-banner">
          <strong>Ошибка сохранения</strong>
          {serverError}
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

      {/* Название */}
      <div className="form__group">
        <label className="form__label form__label-required" htmlFor="team-name">
          Название команды
        </label>
        <input
          id="team-name"
          className={`form__input ${showError('name') ? 'form__input--error' : ''}`}
          type="text"
          value={formData.name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="Например: Отряд «Наруто»"
          disabled={isSubmitting}
        />
        {showError('name') && <p className="form__error">{errors.name}</p>}
      </div>

      {/* Участники */}
      <div className="form__group">
        <div className="form__label-row">
          <span className="form__label form__label-required">Участники</span>
          <span className="form__hint">Отметьте капитанов чекбоксом</span>
        </div>

        <div className="member-list">
          {formData.members.map((member, index) => (
            <div key={member.id} className="member-row">
              <span className="member-row__num">{index + 1}</span>
              <input
                className="form__input member-row__input"
                type="text"
                value={member.name}
                onChange={e => handleMemberNameChange(member.id, e.target.value)}
                placeholder="ФИО участника"
                disabled={isSubmitting}
              />
              <label className="member-row__captain">
                <input
                  type="checkbox"
                  checked={member.isCaptain}
                  onChange={() => handleMemberCaptainToggle(member.id)}
                  disabled={isSubmitting}
                />
                <span>Капитан</span>
              </label>
              <button
                className="member-row__remove"
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                disabled={isSubmitting || formData.members.length === 1}
                title={
                  formData.members.length === 1
                    ? 'Должен быть хотя бы один участник'
                    : 'Удалить участника'
                }
                aria-label="Удалить участника"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn--ghost member-list__add"
          type="button"
          onClick={handleAddMember}
          disabled={isSubmitting}
        >
          + Добавить участника
        </button>

        {showError('members') && <p className="form__error">{errors.members}</p>}
        {showError('captains') && <p className="form__error">{errors.captains}</p>}

        <p className="form__hint" style={{ marginTop: 8 }}>
          Капитанов может быть несколько — они смогут регистрировать команду на квизы
          и редактировать её.
        </p>
      </div>

      <div className="form__actions">
        <button
          className="btn btn--ghost"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="btn__spinner" aria-hidden="true"></span>
              Сохраняем...
            </>
          ) : isEdit ? (
            'Сохранить'
          ) : (
            'Создать'
          )}
        </button>
      </div>
    </form>
  )
}

export default TeamForm