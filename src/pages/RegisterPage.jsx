import { useState, useEffect } from 'react'                          // ← НОВОЕ: useEffect
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isQuizSelectable, getQuizUnavailableReason } from '../utils/quizStatus'
import { quizzes } from '../data/quizzes'
import { captainTeams } from '../data/teams'
import { currentUser } from '../data/currentUser'
import { formatPhone } from '../utils/phone'
import { validate } from '../utils/validation'
import { submitRegistration } from '../api/registrations'
import { fetchTemplates } from '../api/templates'                    // ← НОВОЕ
import { useAuth } from '../context/useAuth'                         // ← НОВОЕ

const INITIAL_FORM = {
  quizIds: [],
  teamId: '',
  fullName: currentUser.fullName,
  phone: formatPhone(currentUser.phone),
  email: currentUser.email,
  participantsCount: 1,
  comment: '',
  hasBirthdayPerson: false,
  personalDataConsent: false,
}

function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  // ← НОВОЕ: находим квиз из URL и предвыбираем только если он существует и доступен
  const initialQuizId = Number(searchParams.get('quizId'))
  const initialQuiz = quizzes.find(q => q.id === initialQuizId)
  const initialQuizIds =
    initialQuiz && isQuizSelectable(initialQuiz) ? [initialQuiz.id] : []
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    quizIds: initialQuizIds,   // ← было: initialQuizId ? [initialQuizId] : []
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)

  // ===== НОВОЕ: шаблоны =====
  const [templates, setTemplates] = useState(null) // null = ещё грузим
  const [templatesError, setTemplatesError] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [appliedTemplateName, setAppliedTemplateName] = useState('')

  // Загрузка шаблонов при монтировании (только если залогинен)
useEffect(() => {
  if (!user) return
  let cancelled = false

  fetchTemplates()
    .then(data => {
      if (cancelled) return
      setTemplates(data)
      setTemplatesError('')
    })
    .catch(err => {
      if (cancelled) return
      setTemplates([]) // чтобы не висел вечный null
      setTemplatesError(err.message || 'Не удалось загрузить шаблоны')
    })

  return () => {
    cancelled = true
  }
}, [user])

  // Автосброс баннера «Шаблон применён» через 4 секунды
  useEffect(() => {
    if (!appliedTemplateName) return
    const t = setTimeout(() => setAppliedTemplateName(''), 4000)
    return () => clearTimeout(t)
  }, [appliedTemplateName])

  function handleApplyTemplate(templateIdValue) {
    setSelectedTemplateId(templateIdValue)
    if (!templateIdValue) return

    const tpl = templates.find(t => t.id === Number(templateIdValue))
    if (!tpl) return

    setFormData(prev => {
      // Команда из шаблона применяется, только если она всё ещё доступна (капитан)
      const teamAvailable = tpl.teamId
        ? captainTeams.some(t => t.id === tpl.teamId)
        : false

      return {
        ...prev,
        teamId: teamAvailable ? String(tpl.teamId) : prev.teamId,
        participantsCount: tpl.participantsCount,
        comment: tpl.comment,
        hasBirthdayPerson: tpl.hasBirthdayPerson,
      }
    })
    setAppliedTemplateName(tpl.name)
  }
  // ===== /НОВОЕ =====

  const errors = validate(formData)
  const hasErrors = Object.keys(errors).length > 0

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handlePhoneChange(value) {
    setFormData(prev => ({ ...prev, phone: formatPhone(value) }))
  }

  function handleTeamChange(teamIdValue) {
    const team = captainTeams.find(t => t.id === Number(teamIdValue))
    setFormData(prev => ({
      ...prev,
      teamId: teamIdValue,
      participantsCount: team ? team.template.participantsCount : 1,
      comment: team ? team.template.comment : '',
    }))
    // Ручная смена команды «переопределяет» шаблон
    setSelectedTemplateId('')                                       // ← НОВОЕ
  }

  function handleQuizToggle(quizId) {
    setFormData(prev => ({
      ...prev,
      quizIds: prev.quizIds.includes(quizId)
        ? prev.quizIds.filter(id => id !== quizId)
        : [...prev.quizIds, quizId],
    }))
  }

async function handleSubmit(e) {
  e.preventDefault()
  setSubmitAttempted(true)
  if (hasErrors) return

  // ← НОВОЕ: последний барьер — если в quizIds просочился недоступный квиз
  const unavailable = formData.quizIds
    .map(id => quizzes.find(q => q.id === id))
    .filter(q => q && !isQuizSelectable(q))

  if (unavailable.length > 0) {
    setErrorMessage(
      `Недоступны для регистрации: ${unavailable.map(q => q.title).join(', ')}`
    )
    setStatus('error')
    return
  }

  setStatus('submitting')
  setErrorMessage('')

    try {
      const result = await submitRegistration(formData)
      setSuccessData(result)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'Не удалось зарегистрироваться')
      setStatus('error')
    }
  }

  function handleReset() {
    setStatus('idle')
    setSubmitAttempted(false)
    setSuccessData(null)
    setErrorMessage('')
    setSelectedTemplateId('')                                       // ← НОВОЕ
    setAppliedTemplateName('')                                      // ← НОВОЕ
  }

  function showError(field) {
    return submitAttempted && errors[field]
  }

  const isSubmitting = status === 'submitting'

  // ===== Экран успеха (без изменений) =====
  if (status === 'success' && successData) {
    return (
      <main className="container" style={{ paddingTop: '32px' }}>
        <div className="success">
          <div className="success__icon">✓</div>
          <h2 className="success__title">Вы зарегистрированы!</h2>
          <p className="success__text">
            Мы отправили данные организатору. Дальше он свяжется с вами по указанному
            телефону или email.
          </p>

          <div className="success__list">
            <h4>Ваши регистрации</h4>
            {successData.registrations.map(reg => (
              <div key={reg.quizId} className="success__item">
                {reg.quizTitle}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--ghost" type="button" onClick={handleReset}>
              Зарегистрироваться ещё
            </button>
            <button className="btn btn--primary" type="button" onClick={() => navigate('/')}>
              К списку квизов
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ===== Форма =====
  return (
    <main className="container" style={{ paddingTop: '32px' }}>
      <button
        className="btn btn--ghost"
        type="button"
        onClick={() => navigate('/')}
        disabled={isSubmitting}
      >
        ← Назад к квизам
      </button>

      <h1 style={{ marginTop: '24px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
        Регистрация на квиз
      </h1>
      <p style={{ color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>
        Заполните форму — и мы зарегистрируем вас на выбранные квизы.
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {/* ===== НОВОЕ: баннер «шаблон применён» ===== */}
        {appliedTemplateName && (
          <div className="profile-success">
            <span aria-hidden="true">✓</span>
            Шаблон «{appliedTemplateName}» применён
          </div>
        )}

        {/* ===== НОВОЕ: селект шаблонов ===== */}
        {user && (
          <div className="form__group">
            <label className="form__label" htmlFor="template-apply">
              Применить шаблон
            </label>

            {templates === null && (
              <select className="form__select" disabled>
                <option>Загрузка шаблонов...</option>
              </select>
            )}

            {templatesError && (
              <p className="form__error">{templatesError}</p>
            )}

            {templates !== null && !templatesError && templates.length === 0 && (
              <p className="form__hint">
                У вас нет шаблонов. Создайте их в{' '}
                <a className="form__link" href="/account">личном кабинете</a> → «Шаблоны».
              </p>
            )}

            {templates !== null && !templatesError && templates.length > 0 && (
              <>
                <select
                  id="template-apply"
                  className="form__select"
                  value={selectedTemplateId}
                  onChange={e => handleApplyTemplate(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">— Не применять —</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="form__hint">
                  Заполнит команду, количество участников, комментарий и именинника.
                  Квизы и контакты останутся как есть.
                </p>
              </>
            )}
          </div>
        )}

        {/* Ошибка сервера */}
        {status === 'error' && errorMessage && (
          <div className="error-banner">
            <strong>Ошибка регистрации</strong>
            {errorMessage}
          </div>
        )}

        {/* Сводка ошибок */}
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

        {/* ===== Квизы ===== */}
        <div className="form__group">
          <label className="form__label form__label-required">
            Квиз {formData.quizIds.length > 0 && `(выбрано: ${formData.quizIds.length})`}
          </label>
          <div
            className="quiz-picker"
            style={showError('quizIds') ? { borderColor: 'var(--danger)' } : undefined}
          >
            {quizzes.map(quiz => (
              <label key={quiz.id} className="quiz-picker__item">
                <input
                  type="checkbox"
                  checked={formData.quizIds.includes(quiz.id)}
                  onChange={() => handleQuizToggle(quiz.id)}
                  disabled={!isQuizSelectable(quiz) || isSubmitting}
                />
                <div className="quiz-picker__text">
                  <div className="quiz-picker__title">{quiz.title}</div>
                  <div className="quiz-picker__meta">
                    {quiz.date} · {quiz.place} · {quiz.price}
                    {!isQuizSelectable(quiz) && ` · ${getQuizUnavailableReason(quiz)}`}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {showError('quizIds') && <p className="form__error">{errors.quizIds}</p>}
        </div>

        {/* ===== Команда ===== */}
        <div className="form__group">
          <label className="form__label form__label-required" htmlFor="team">
            Команда
          </label>
          <select
            id="team"
            className={`form__select ${showError('teamId') ? 'form__select--error' : ''}`}
            value={formData.teamId}
            onChange={e => handleTeamChange(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">— Выберите команду —</option>
            {captainTeams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          {showError('teamId') ? (
            <p className="form__error">{errors.teamId}</p>
          ) : (
            <p className="form__hint">Доступны только команды, в которых вы капитан.</p>
          )}
        </div>

        {/* ===== ФИО + Телефон ===== */}
        <div className="form__row">
          <div className="form__group">
            <label className="form__label form__label-required" htmlFor="fullName">
              ФИО
            </label>
            <input
              id="fullName"
              className={`form__input ${showError('fullName') ? 'form__input--error' : ''}`}
              type="text"
              value={formData.fullName}
              onChange={e => handleFieldChange('fullName', e.target.value)}
              disabled={isSubmitting}
            />
            {showError('fullName') && <p className="form__error">{errors.fullName}</p>}
          </div>

          <div className="form__group">
            <label className="form__label form__label-required" htmlFor="phone">
              Номер телефона
            </label>
            <input
              id="phone"
              className={`form__input ${showError('phone') ? 'form__input--error' : ''}`}
              type="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={e => handlePhoneChange(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              disabled={isSubmitting}
            />
            {showError('phone') && <p className="form__error">{errors.phone}</p>}
          </div>
        </div>

        {/* ===== Email + Кол-во ===== */}
        <div className="form__row">
          <div className="form__group">
            <label className="form__label form__label-required" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={`form__input ${showError('email') ? 'form__input--error' : ''}`}
              type="email"
              value={formData.email}
              onChange={e => handleFieldChange('email', e.target.value)}
              disabled={isSubmitting}
            />
            {showError('email') && <p className="form__error">{errors.email}</p>}
          </div>

          <div className="form__group">
            <label className="form__label form__label-required" htmlFor="participantsCount">
              Количество участников
            </label>
            <input
              id="participantsCount"
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
        </div>

        {/* ===== Комментарий ===== */}
        <div className="form__group">
          <label className="form__label" htmlFor="comment">
            Комментарий
          </label>
          <textarea
            id="comment"
            className="form__textarea"
            value={formData.comment}
            onChange={e => handleFieldChange('comment', e.target.value)}
            placeholder="Например: будем с тортиком 🎂"
            disabled={isSubmitting}
          />
        </div>

        {/* ===== Именинник ===== */}
        <label className="form__checkbox-row">
          <input
            type="checkbox"
            checked={formData.hasBirthdayPerson}
            onChange={e => handleFieldChange('hasBirthdayPerson', e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Есть именинник в команде</span>
        </label>

        {/* ===== Согласие ===== */}
        <div>
          <label className="form__checkbox-row">
            <input
              type="checkbox"
              checked={formData.personalDataConsent}
              onChange={e =>
                handleFieldChange('personalDataConsent', e.target.checked)
              }
              disabled={isSubmitting}
            />
            <span>
              Согласен на обработку персональных данных в соответствии с{' '}
              <a className="form__link" href="#" onClick={e => e.preventDefault()}>
                соглашением
              </a>
            </span>
          </label>
          {showError('personalDataConsent') && (
            <p className="form__checkbox-error">{errors.personalDataConsent}</p>
          )}
        </div>

        {/* ===== Действия ===== */}
        <div className="form__actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => navigate('/')}
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
                Отправляем...
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </div>
      </form>
    </main>
  )
}

export default RegisterPage