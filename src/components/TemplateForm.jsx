import { useState } from 'react'
import { validateTemplate } from '../utils/templateValidation'

function TemplateForm({
  initialTemplate,
  teams,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}) {
  const [formData, setFormData] = useState(() => {
    if (initialTemplate) {
      return {
        name: initialTemplate.name,
        teamId: initialTemplate.teamId || '',
        participantsCount: initialTemplate.participantsCount,
        comment: initialTemplate.comment,
        hasBirthdayPerson: initialTemplate.hasBirthdayPerson,
      }
    }
    return {
      name: '',
      teamId: '',
      participantsCount: 4,
      comment: '',
      hasBirthdayPerson: false,
    }
  })

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const errors = validateTemplate(formData)
  const hasErrors = Object.keys(errors).length > 0

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitAttempted(true)
    if (hasErrors) return
    onSubmit({
      name: formData.name.trim(),
      teamId: formData.teamId === '' ? null : Number(formData.teamId),
      participantsCount: formData.participantsCount,
      comment: formData.comment,
      hasBirthdayPerson: formData.hasBirthdayPerson,
    })
  }

  function showError(field) {
    return submitAttempted && errors[field]
  }

  const isEdit = Boolean(initialTemplate)

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">
        {isEdit ? 'Редактирование шаблона' : 'Новый шаблон'}
      </h2>

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
        <label className="form__label form__label-required" htmlFor="template-name">
          Название шаблона
        </label>
        <input
          id="template-name"
          className={`form__input ${showError('name') ? 'form__input--error' : ''}`}
          type="text"
          value={formData.name}
          onChange={e => handleFieldChange('name', e.target.value)}
          placeholder="Например: С тортиком"
          disabled={isSubmitting}
        />
        {showError('name') && <p className="form__error">{errors.name}</p>}
        <p className="form__hint">
          Название нужно только для вас — чтобы отличать шаблоны друг от друга.
        </p>
      </div>

      {/* Команда */}
      <div className="form__group">
        <label className="form__label" htmlFor="template-team">
          Команда по умолчанию
        </label>
        <select
          id="template-team"
          className="form__select"
          value={formData.teamId}
          onChange={e => handleFieldChange('teamId', e.target.value)}
          disabled={isSubmitting}
        >
          <option value="">— Не выбрана —</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <p className="form__hint">
          Если выбрана — при регистрации команда подставится автоматически.
        </p>
      </div>

      {/* Участники */}
      <div className="form__group">
        <label
          className="form__label form__label-required"
          htmlFor="template-count"
        >
          Количество участников
        </label>
        <input
          id="template-count"
          className={`form__input ${showError('participantsCount') ? 'form__input--error' : ''}`}
          type="number"
          min="1"
          max="12"
          value={formData.participantsCount}
          onChange={e =>
            handleFieldChange('participantsCount', Number(e.target.value))
          }
          disabled={isSubmitting}
        />
        {showError('participantsCount') ? (
          <p className="form__error">{errors.participantsCount}</p>
        ) : (
          <p className="form__hint">От 1 до 12 человек.</p>
        )}
      </div>

      {/* Комментарий */}
      <div className="form__group">
        <label className="form__label" htmlFor="template-comment">
          Комментарий
        </label>
        <textarea
          id="template-comment"
          className="form__textarea"
          value={formData.comment}
          onChange={e => handleFieldChange('comment', e.target.value)}
          placeholder="Например: будем с тортиком 🎂"
          disabled={isSubmitting}
        />
      </div>

      {/* Именинник */}
      <label className="form__checkbox-row">
        <input
          type="checkbox"
          checked={formData.hasBirthdayPerson}
          onChange={e =>
            handleFieldChange('hasBirthdayPerson', e.target.checked)
          }
          disabled={isSubmitting}
        />
        <span>Есть именинник</span>
      </label>

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

export default TemplateForm