import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // React вызывает этот метод, когда дочерний компонент бросает ошибку при рендере.
  // Возвращаем новое состояние — компонент перерисуется с fallback-UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Логируем — здесь потом можно отправлять в Sentry (когда будет)
    console.error('ErrorBoundary поймал ошибку:', error, errorInfo)
  }

  // Автосброс при смене resetKey (например, при навигации на другую страницу)
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__inner">
            <div className="error-boundary__icon" aria-hidden="true">⚠</div>
            <h2 className="error-boundary__title">Что-то пошло не так</h2>
            <p className="error-boundary__text">
              Произошла непредвиденная ошибка. Попробуйте ещё раз или обновите страницу.
            </p>
            <div className="error-boundary__actions">
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </button>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={this.handleReset}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary