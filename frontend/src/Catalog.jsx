import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Check, Layers, Search } from 'lucide-react'
import { api, errorMessage } from './api'
import { useAuth } from './auth'
import { CourseCard, Empty, Notice, Resource } from './components'
import { priceLabel } from './format'
import { useResource } from './useResource'

function Grid({ courses }) {
  return <div className="course-grid">{courses.map(course => <CourseCard key={course._id} course={course} />)}</div>
}

export function Home() {
  const courses = useResource('/courses')
  const { user } = useAuth()
  return <>
    <section className="hero"><div className="container hero-inner">
      <div>
        <h1>Learn something<br /> <em>worth keeping.</em></h1>
        <p>Explore instructor-led courses, work through lessons at your own pace, and pick up right where you left off.</p>
        <div className="d-flex flex-wrap gap-3"><Link className="btn btn-primary btn-lg" to="/courses">Explore courses</Link>
          {!user && <Link className="btn btn-outline-primary btn-lg" to="/register">Create an account</Link>}
        </div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="art-orbit" /><div className="art-tile art-back"><Layers size={34} /></div>
        <div className="art-tile art-front"><BookOpen size={86} strokeWidth={1.2} /><i /><i /><i /></div>
        <div className="art-tile art-check"><Check size={29} /></div>
      </div>
    </div></section>
    <section className="container section-space">
      <div className="section-heading"><div><h2>Featured courses</h2><p>Discover the latest courses from LearnHub instructors.</p></div><Link className="btn btn-outline-primary" to="/courses">View all courses</Link></div>
      <Resource resource={courses}>{data => data.length ? <Grid courses={data.slice(0, 3)} /> : <Empty>Courses will appear here when instructors publish them.</Empty>}</Resource>
    </section>
  </>
}

export function Courses() {
  const resource = useResource('/courses')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  return <section className="container section-space">
    <div className="page-heading"><h1>Explore courses</h1><p>Find the right course for what you want to learn.</p></div>
    <Resource resource={resource}>{courses => {
      const categories = [...new Set(courses.map(course => course.category))].sort()
      const visible = courses.filter(course => (!category || course.category === category) &&
        [course.title, course.description, course.category, course.instructor?.name].some(value => value?.toLowerCase().includes(search.trim().toLowerCase())))
      return <>
        <div className="filter-bar">
          <div className="filter-field">
            <label htmlFor="course-search">Search courses</label>
            <div className="search-field"><Search size={19} /><input id="course-search" className="form-control" placeholder="Search by title, topic, or instructor" value={search} onChange={event => setSearch(event.target.value)} /></div>
          </div>
          <div className="filter-field">
            <label htmlFor="course-category">Category</label>
            <select id="course-category" className="form-select" value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select>
          </div>
        </div>
        <p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'course' : 'courses'}</p>
        {visible.length ? <Grid courses={visible} /> : <Empty>No courses match your filters.</Empty>}
      </>
    }}</Resource>
  </section>
}

export function CourseDetails() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const resource = useResource('/courses/' + id)
  return <div className="container section-space"><Link className="back-link" to="/courses">All courses</Link>
    <Resource resource={resource}>{course => <CourseOverview key={id + ':' + (user?._id || '')} course={course} user={user} loading={loading} />}</Resource>
  </div>
}

function CourseOverview({ course, user, loading }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const status = useResource(user?.role === 'student' ? '/enroll/' + course._id : null)
  async function enroll() {
    setBusy(true)
    setError('')
    try {
      await api.post('/enroll', { courseId: course._id })
      setEnrolled(true)
      setSuccess('Enrollment successful.')
    } catch (error) {
      setError(errorMessage(error))
      if (error.response?.status === 409) setEnrolled(true)
    } finally { setBusy(false) }
  }
  return <div className="details-grid"><div>
    <div className="page-heading"><span className="category">{course.category}</span><h1>{course.title}</h1><p>Instructor: {course.instructor?.name || 'LearnHub'}</p></div>
    <h2>About this course</h2><p className="preserve-text">{course.description}</p>
    <h2 className="mt-5">Lessons</h2>
    {course.lessons.length ? <ol className="lesson-list">{course.lessons.map(lesson => <li key={lesson._id}>{lesson.title}</li>)}</ol> : <p className="text-secondary">Lessons have not been added yet.</p>}
  </div><aside className="panel enroll-panel">
    <BookOpen size={28} /><h2>{priceLabel(course.price)}</h2>
    <p>{course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}</p>
    <Notice error={error} success={success} />
    {loading ? <p role="status">Checking session…</p> : !user ? <Link className="btn btn-primary" to="/login" state={{ from: '/courses/' + course._id }}>Sign in to enroll</Link>
      : user.role === 'student' ? enrolled || status.data?.enrolled ? <Link className="btn btn-primary" to="/dashboard/student">Go to my learning</Link>
        : <button className="btn btn-primary" disabled={busy} onClick={enroll}>{busy ? 'Enrolling…' : 'Enroll in course'}</button>
        : <p className="text-secondary mb-0">Enrollment is available to students.</p>}
  </aside></div>
}
