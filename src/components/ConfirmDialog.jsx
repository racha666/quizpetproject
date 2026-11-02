import { useEffect } from 'react'

function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Подтвердить',
  loadingLabel = 'Загрузка...',   // ← НОВОЕ
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}) {
  // Закрытие по Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && !isLoading) onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel, isLoading])

  return (
    <div className="dialog-backdrop" onClick={isLoading ? undefined : onCancel}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <h3 className="dialog__title">{title}</h3>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={`btn ${isDanger ? 'btn--danger' : 'btn--primary'}`}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn__spinner" aria-hidden="true"></span>
                {loadingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog