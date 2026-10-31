import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'

function Layout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <ErrorBoundary resetKey={location.pathname}>
        <Outlet />
      </ErrorBoundary>
      <Footer />
    </>
  )
}

export default Layout