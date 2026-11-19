import { startTransition, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Braces, ChartNoAxesCombined, Compass, GraduationCap, LayoutGrid, Menu, Palette, X } from 'lucide-react'
import { priceLabel } from './format'
import { dashboardPath, useAuth } from './auth'

export function Notice({ error, success }) {
  return <>{error && <div className="alert alert-danger" role="alert">{error}</div>}
    {success && <div className="alert alert-success" role="status">{success}</div>}</>
}

export function Resource({ resource, children }) {
  if (resource.error) return <><Notice error={resource.error} /><button className="btn btn-outline-primary" onClick={resource.reload}>Try again</button></>
  if (!resource.data) return <p className="loading" role="status"><span className="spinner-border spinner-border-sm" /> Loading…</p>
  return children(resource.data)
}

export function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)
  return <header className="site-header">
    <div className="container nav-shell">
      <Link className="brand" to="/" onClick={close}><span className="brand-icon"><BookOpen size={21} /></span> LearnHub</Link>
      <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-links" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="site-links" aria-label="Main navigation" className={open ? 'nav-links open' : 'nav-links'}>
        <div className="nav-main"><NavLink end to="/" onClick={close}>Home</NavLink><NavLink to="/courses" onClick={close}>Courses</NavLink>
          {user && <NavLink to={dashboardPath(user)} onClick={close}>Dashboard</NavLink>}
        </div>
        <div className="nav-account">{user ? <>
          <span className="account-name">{user.name}</span>
          <button className="btn btn-outline-primary" onClick={() => startTransition(() => {
            logout()
            close()
            navigate('/', { replace: true })
          })}>Sign out</button>
        </> : <>
          <NavLink to="/login" onClick={close}>Log in</NavLink>
          <Link className="btn btn-primary" to="/register" onClick={close}>Get started</Link>
        </>}</div>
      </nav>
    </div>
  </header>
}

export function Footer() {
  return <footer className="site-footer"><div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
    <Link className="brand" to="/"><span className="brand-icon"><BookOpen size={19} /></span> LearnHub</Link>
    <Link to="/courses">Course catalog</Link>
  </div></footer>
}

export function CourseCard({ course }) {
  const category = course.category.toLowerCase()
  const tech = /develop|tech|program|web|software/.test(category)
  const design = /design|art|creativ/.test(category)
  const business = /data|business|market/.test(category)
  const Icon = tech ? Braces : design ? Palette : business ? ChartNoAxesCombined : Compass
  const theme = tech ? 'tech' : design ? 'design' : business ? 'business' : 'general'
  return <article className="course-card">
    <div className={'course-art ' + theme} aria-hidden="true"><Icon size={44} strokeWidth={1.45} /></div>
    <div className="course-card-body">
      <span className="category">{course.category}</span>
      <h3><Link to={'/courses/' + course._id}>{course.title}</Link></h3>
      <p className="course-summary">{course.description}</p>
      <div className="course-card-footer"><span><GraduationCap size={17} /> {course.instructor?.name || 'LearnHub'}</span><strong>{priceLabel(course.price)}</strong></div>
    </div>
  </article>
}

export function Empty({ children }) {
  return <div className="empty-state"><LayoutGrid size={26} /><p>{children}</p></div>
}
