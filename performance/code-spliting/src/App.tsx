import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { lazy, Suspense } from 'react';
// import { About, Contact, FAQ, Profile, Login } from './pages'

const Profile = lazy(() => import('./pages/Profile'));
const About   = lazy(() => import('./pages/About'  ));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ    = lazy(() => import('./pages/FAQ'   ));
const Login   = lazy(() => import('./pages/Login'  ));


export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='login' element={<Suspense fallback={<>...</>}> <Login /></Suspense>} />
      <Route path='/*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}

export const PrivateRoutes = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='profile' element={<Suspense fallback={<>...</>}> <Profile /></Suspense>} />
        <Route path='about' element={<Suspense fallback={<>...</>}> <About /></Suspense>} />
        <Route path='contact' element={<Suspense fallback={<>...</>}> <Contact /></Suspense>} />
        <Route path='faqs' element={<Suspense fallback={<>...</>}> <FAQ /></Suspense>} />
        <Route path='/*' element={<Navigate to='/profile' replace />} />
      </Routes>
    </>
  )
}


const isAuthenticated = true;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {
          (isAuthenticated)
            ? <Route path="/*" element={<PrivateRoutes />} />
            : <Route path="/*" element={<PublicRoutes />} />
        }
      </Routes>
    </BrowserRouter>
  )
}
export default App