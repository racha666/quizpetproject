import { useState, useEffect } from 'react'
import { fetchPlans, createPlan, updatePlan } from '../api/quizPlans'

function AddToPlanDialog({ quiz, onClose }) {
  const [plans, setPlans] = useState(null)
  const [status, setStatus] = useState('loading')   // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')
  const [checked, setChecked] = useState(new Set())  // id подборок, где есть квиз
  const [original, setOriginal] = useState(new Set()) // снимок для сравнения
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchPlans()
      .then(data => {
        if (cancelled) return
        setPlans(data)
        const inPlans = new Set(
          data.filter(p => p.quizIds.includes(quiz.id)).map(p => p.id)
        )
        setChecked(inPlans)
        setOriginal(inPlans)
        setStatus('ready')
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Не удалось загрузить подборки')
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [quiz.id])

  function toggle(planId) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(planId)) next.delete(planId)
      else next.add(planId)
      return next
    })
  }

  async function handleCreate() {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    setError('')
    try {
      const created = await createPlan({ name, quizIds: [quiz.id] })
      setPlans(prev => [...prev, created])
      setChecked(prev => new Set(prev).add(created.id))
      setOriginal(prev => new Set(prev).add(created.id))
      setNewName('')
    } catch (err) {
      setError(err.message || 'Не удалось создать подборку')
    } finally {
      setCreating(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      // для каждой подборки, где состояние изменилось — update
      const changed = plans.filter(p => {
        const has = checked.has(p.id)
        const had = original.has(p.id)
        return has !== had
      })
      await Promise.all(
        changed.map(p => {
          const nextQuizIds = checked.has(p.id)
            ? [...p.quizIds, quiz.id]
            : p.quizIds.filter(id => id !== quiz.id)
          return updatePlan(p.id, { quizIds: nextQuizIds })
        })
      )
      onClose()
    } catch (err) {
      setError(err.message || 'Не удалось сохранить')
      setSaving(false)
    }
  }

  return (
    <div className="dialog-backdrop" onClick={saving ? undefined : onClose}>
      <div className="dialog dialog--wide" onClick={e => e.stopPropagation()}>
        <h3 className="dialog__title">В подборку</h3>
        <p className="dialog__message">
          «{quiz.title}»
        </p>

        {status === 'loading' && (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Загружаем подборки...</p>
        )}

        {status === 'error' && (
          <div className="error-banner">
            <strong>Ошибка</strong>
            {error}
          </div>
        )}

        {status === 'ready' && (
          <>
            <div className="add-to-plan__list">
              {plans.length === 0 && (
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                  У вас пока нет подборок. Создайте первую ниже.
                </p>
              )}
              {plans.map(p => (
                <label key={p.id} className="add-to-plan__item">
                  <input
                    type="checkbox"
                    checked={checked.has(p.id)}
                    onChange={() => toggle(p.id)}
                    disabled={saving}
                  />
                  <span>{p.name}</span>
                  <span className="add-to-plan__count">{p.quizIds.length}</span>
                </label>
              ))}
            </div>

            <div className="add-to-plan__create">
              <input
                type="text"
                className="form__input"
                placeholder="Новая подборка..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                disabled={creating || saving}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreate() } }}
              />
              <button
                className="btn btn--ghost"
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || creating || saving}
              >
                {creating ? 'Создаём...' : 'Создать'}
              </button>
            </div>

            {error && status === 'ready' && (
              <div className="participation-card__upload-error" style={{ marginTop: 8 }}>
                {error}
              </div>
            )}
          </>
        )}

        <div className="dialog__actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Отмена
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={handleSave}
            disabled={saving || status !== 'ready'}
          >
            {saving ? (
              <>
                <span className="btn__spinner" aria-hidden="true"></span>
                Сохраняем...
              </>
            ) : (
              'Готово'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddToPlanDialog