import { useState } from 'react'

function CreatePlanDialog({ onCreate, onCancel, isSubmitting, serverError }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name)
  }

  return (
    <div className="dialog-backdrop" onClick={isSubmitting ? undefined : onCancel}>
      <form className="dialog" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className="dialog__title">Новая подборка</h3>
        <p className="dialog__message">Введите название. Квизы добавите позже — кнопкой «＋» на карточке.</p>
        <input
          type="text"
          className="form__input"
          placeholder="Например: Осень 2026"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
        {serverError && (
          <p className="form__error" style={{ marginTop: 8 }}>{serverError}</p>
        )}
        <div className="dialog__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn__spinner" aria-hidden="true"></span>
                Создаём...
              </>
            ) : (
              'Создать'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePlanDialog