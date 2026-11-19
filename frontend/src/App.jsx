import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import { Account, Protected, StatusPage } from './Account'
import { CourseDetails, Courses, Home } from './Catalog'
import { Footer, Header } from './components'
import { AdminDashboard, InstructorDashboard, StudentDashboard } from './Dashboards'

export default function App() {
  return <BrowserRouter><AuthProvider>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" tabIndex={-1}><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/login" element={<Account key="login" />} />
      <Route path="/register" element={<Account key="register" register />} />
      <Route path="/dashboard/student" element={<Protected role="student"><StudentDashboard /></Protected>} />
      <Route path="/dashboard/instructor" element={<Protected role="instructor"><InstructorDashboard /></Protected>} />
      <Route path="/dashboard/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
      <Route path="/unauthorized" element={<StatusPage unauthorized />} />
      <Route path="*" element={<StatusPage />} />
    </Routes></main>
    <Footer />
  </AuthProvider></BrowserRouter>
}
