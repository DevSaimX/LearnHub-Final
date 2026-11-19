import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Users } from 'lucide-react'
import { useAuth } from './auth'
import { api, errorMessage } from './api'
import { Empty, Notice, Resource } from './components'
import { priceLabel } from './format'
import { useResource } from './useResource'

function useAction() {
  const [feedback, setFeedback] = useState({ error: '', success: '', busy: false })
  async function run(request, success, onSuccess) {
    setFeedback({ error: '', success: '', busy: true })
    try {
      const { data } = await request()
      onSuccess?.(data)
      setFeedback({ error: '', success, busy: false })
    } catch (error) {
      setFeedback({ error: errorMessage(error), success: '', busy: false })
    }
  }
  return { ...feedback, run }
}

function DashboardHeading({ title, children }) {
  const { user } = useAuth()
  return <div className="page-heading"><h1>{title}</h1><p>{children || 'Welcome, ' + user.name + '.'}</p></div>
}

export function StudentDashboard() {
  const resource = useResource('/my-courses')
  return <section className="container section-space">
    <DashboardHeading title="My learning" />
    <Resource resource={resource}>{records => records.length
      ? <div className="dashboard-stack">{records.map(record => <LearningCourse key={record._id} record={record} />)}</div>
      : <><Empty>Your enrolled courses will appear here.</Empty><Link className="btn btn-primary mt-3" to="/courses">Browse courses</Link></>}
    </Resource>
  </section>
}

function LearningCourse({ record }) {
  const { course } = record
  const [completion, setCompletion] = useState(record)
  const action = useAction()
  return <article className="panel">
    <span className="category">{course.category}</span><h2>{course.title}</h2>
    <div className="progress-heading"><span>Course progress</span><strong>{completion.progress}%</strong></div>
    <progress max={100} value={completion.progress} aria-label={course.title + ' progress'} />
    <Notice {...action} />
    {course.lessons.length ? <div className="lesson-stack">{course.lessons.map(lesson => {
      const done = completion.completedLessons.includes(lesson._id)
      return <details className="lesson" key={lesson._id}>
        <summary>{lesson.title} {done && <span className="completion">Completed</span>}</summary>
        <p className="preserve-text">{lesson.content}</p>
        <button type="button" className="btn btn-outline-primary" disabled={action.busy} onClick={() => action.run(
          () => api.put('/my-courses/' + course._id + '/lessons/' + lesson._id, { completed: !done }),
          'Progress saved.', setCompletion,
        )}>{done ? 'Mark incomplete' : 'Mark complete'}</button>
      </details>
    })}</div> : <p className="text-secondary mb-0">Lessons will appear when the instructor adds them.</p>}
  </article>
}

function CourseForm({ course, busy, onSave }) {
  function submit(event) {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    onSave({ ...form, price: Number(form.price) })
  }
  return <form className="form-stack" onSubmit={submit}>
    <label>Course title<input className="form-control" name="title" defaultValue={course?.title} required maxLength={120} /></label>
    <div className="field-row">
      <label>Category<input className="form-control" name="category" defaultValue={course?.category} required maxLength={60} /></label>
      <label>Price (USD)<input className="form-control" name="price" defaultValue={course?.price ?? 0} required type="number" min="0" max="100000" step="0.01" /></label>
    </div>
    <label>Description<textarea className="form-control" name="description" defaultValue={course?.description} required rows={4} maxLength={5000} /></label>
    <button className="btn btn-primary align-self-start" disabled={busy}>{busy ? 'Saving…' : course ? 'Save course' : 'Create course'}</button>
  </form>
}

function Lessons({ course, onChange }) {
  const [selected, setSelected] = useState('')
  const [formVersion, setFormVersion] = useState(0)
  const lesson = course.lessons.find(item => item._id === selected)
  const endpoint = '/courses/' + course._id + '/lessons'
  const action = useAction()
  function save(event) {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    action.run(() => lesson ? api.put(endpoint + '/' + selected, form) : api.post(endpoint, form),
      lesson ? 'Lesson updated.' : 'Lesson created.', () => {
        setSelected('')
        setFormVersion(value => value + 1)
        onChange()
      })
  }
  return <div>
    <h3>Lessons</h3>
    <Notice {...action} />
    {course.lessons.length > 0 && <ul className="manage-list">{course.lessons.map(item => <li key={item._id}>
      <span>{item.title}</span>
      <div className="management-actions">
        <button className="btn btn-outline-primary btn-sm" disabled={action.busy} onClick={() => setSelected(item._id)}>Edit<span className="visually-hidden"> {item.title}</span></button>
        <button className="btn btn-outline-danger btn-sm" disabled={action.busy} onClick={() => {
          if (window.confirm('Delete this lesson?')) action.run(() => api.delete(endpoint + '/' + item._id), 'Lesson deleted.', () => { setSelected(''); onChange() })
        }}>Delete<span className="visually-hidden"> {item.title}</span></button>
      </div>
    </li>)}</ul>}
    <form className="form-stack" key={selected + ':' + formVersion} onSubmit={save}>
      <label>Lesson title<input className="form-control" name="title" defaultValue={lesson?.title} required maxLength={120} /></label>
      <label>Lesson content<textarea className="form-control" name="content" defaultValue={lesson?.content} required rows={5} maxLength={20000} /></label>
      <div className="management-actions"><button className="btn btn-primary" disabled={action.busy}>{lesson ? 'Save lesson' : 'Add lesson'}</button>
        {lesson && <button type="button" className="btn btn-outline-primary" disabled={action.busy} onClick={() => setSelected('')}>Cancel</button>}</div>
    </form>
  </div>
}

function ManageCourses({ onChange }) {
  const courses = useResource('/managed-courses')
  const [selected, setSelected] = useState('')
  const action = useAction()
  function refresh() {
    courses.reload()
    onChange?.()
  }

  return <section className="dashboard-stack">
    <Resource resource={courses}>{records => {
      const course = records.find(item => item._id === selected)
      return <>
        <div className="panel">
          <div className="section-heading"><h2>Manage courses</h2>{selected !== 'new' && <button className="btn btn-primary" disabled={action.busy} onClick={() => setSelected('new')}>New course</button>}</div>
          <Notice {...action} />
          {records.length ? <ul className="manage-list">{records.map(item => <li key={item._id}>
            <div><Link to={'/courses/' + item._id}>{item.title}</Link><small>{item.category} · {priceLabel(item.price)} · {item.instructor?.name}</small></div>
            <div className="management-actions">
              <button className="btn btn-outline-primary btn-sm" disabled={action.busy} onClick={() => setSelected(item._id)}>Manage<span className="visually-hidden"> {item.title}</span></button>
              <button className="btn btn-outline-danger btn-sm" disabled={action.busy} onClick={() => {
                if (!window.confirm('Delete this course, its lessons, and its enrollments?')) return
                action.run(() => api.delete('/courses/' + item._id), 'Course deleted.', () => {
                  if (selected === item._id) setSelected('')
                  refresh()
                })
              }}>Delete<span className="visually-hidden"> {item.title}</span></button>
            </div>
          </li>)}</ul> : <Empty>No courses to manage yet.</Empty>}
        </div>
        {(course || selected === 'new') && <div className="panel editor" key={selected}>
          <div className="section-heading"><h2>{course ? 'Edit ' + course.title : 'Create a course'}</h2>
            <button className="btn btn-outline-primary" disabled={action.busy} onClick={() => setSelected('')}>Close editor</button></div>
          <CourseForm course={course} busy={action.busy} onSave={input => action.run(
            () => course ? api.put('/courses/' + course._id, input) : api.post('/courses', input),
            course ? 'Course updated.' : 'Course created.', data => { setSelected(data._id); refresh() },
          )} />
          {course && <><hr /><Lessons course={course} onChange={refresh} /></>}
        </div>}
      </>
    }}</Resource>
  </section>
}

export function InstructorDashboard() {
  return <div className="container section-space"><DashboardHeading title="Instructor dashboard" /><ManageCourses /></div>
}

function ManageUsers({ onChange }) {
  const { user: currentUser } = useAuth()
  const resource = useResource('/admin/users')
  const [selected, setSelected] = useState('')
  const action = useAction()
  function refresh() { resource.reload(); onChange() }

  return <section className="panel"><h2>Manage users</h2><Notice {...action} />
    <Resource resource={resource}>{users => {
      const user = users.find(item => item._id === selected)
      return <>
        <ul className="manage-list">{users.map(item => <li key={item._id}>
          <div><strong>{item.name}</strong><small>{item.email} · {item.role}</small></div>
          <div className="management-actions">
            <button className="btn btn-outline-primary btn-sm" disabled={action.busy} onClick={() => setSelected(item._id)}>Edit<span className="visually-hidden"> {item.name}</span></button>
            {item._id !== currentUser._id && <button className="btn btn-outline-danger btn-sm" disabled={action.busy} onClick={() => {
              if (window.confirm('Delete this account and its enrollments?')) action.run(
                () => api.delete('/admin/users/' + item._id), 'User deleted.', () => { setSelected(''); refresh() },
              )
            }}>Delete<span className="visually-hidden"> {item.name}</span></button>}
          </div>
        </li>)}</ul>
        {user && <form className="form-stack editor" key={user._id} onSubmit={event => {
          event.preventDefault()
          const input = Object.fromEntries(new FormData(event.currentTarget))
          action.run(() => api.put('/admin/users/' + user._id, input), 'User updated.', () => { setSelected(''); refresh() })
        }}>
          <h3>Edit {user.name}</h3>
          <label>Full name<input className="form-control" name="name" defaultValue={user.name} required maxLength={100} /></label>
          <label>Email address<input className="form-control" type="email" name="email" defaultValue={user.email} required maxLength={254} /></label>
          {user.role !== 'admin' && <label>Role<select className="form-select" name="role" defaultValue={user.role}><option value="student">Student</option><option value="instructor">Instructor</option></select></label>}
          <div className="management-actions"><button className="btn btn-primary" disabled={action.busy}>Save user</button>
            <button type="button" className="btn btn-outline-primary" disabled={action.busy} onClick={() => setSelected('')}>Cancel</button></div>
        </form>}
      </>
    }}</Resource>
  </section>
}

export function AdminDashboard() {
  const analytics = useResource('/admin/analytics')
  return <div className="container section-space">
    <DashboardHeading title="Admin dashboard">Manage users and courses and review platform activity.</DashboardHeading>
    <div className="dashboard-stack">
      <section><h2>Platform activity</h2>
        <Resource resource={analytics}>{data => <>
          <div className="stats-grid">
            {[[Users, 'Users', data.users], [BookOpen, 'Courses', data.courses], [GraduationCap, 'Enrollments', data.enrollments]].map(([Icon, label, value]) =>
              <div className="panel stat" key={label}><Icon size={22} /><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          <p className="role-counts">{data.roles.student} students · {data.roles.instructor} instructors · {data.roles.admin} admins</p>
        </>}</Resource>
      </section>
      <ManageUsers onChange={analytics.reload} />
      <ManageCourses onChange={analytics.reload} />
    </div>
  </div>
}
