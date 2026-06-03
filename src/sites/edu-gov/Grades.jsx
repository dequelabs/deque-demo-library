import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './store.jsx';

/**
 * Per-child grade portal.
 * Tabs let parents switch between children. Each tab shows a current-semester
 * grade table (subject, letter, percent, teacher) read from state.grades.
 */
export default function Grades() {
  const { state } = useStore();
  const [activeId, setActiveId] = useState(state.children[0]?.id || null);

  if (!state.children.length) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Grade portal</h1>
            <p className="subtitle">No children on your account yet.</p>
          </div>
        </div>
        <div className="card">
          <p>
            Once you add a child via{' '}
            <Link to="/edu-gov/schools/enroll">online enrollment</Link>, their
            current-semester grades will appear here.
          </p>
        </div>
      </>
    );
  }

  const active = state.children.find((c) => c.id === activeId) || state.children[0];
  const grades = state.grades[active.id] || [];
  const school = state.schools.find((s) => s.id === active.schoolId);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Grade portal</h1>
          <p className="subtitle">Current semester grades for your children.</p>
        </div>
      </div>

      <div role="tablist" aria-label="Choose a child" className="child-tabs">
        {state.children.map((c) => (
          <button
            key={c.id}
            id={`tab-${c.id}`}
            role="tab"
            type="button"
            aria-selected={c.id === active.id}
            aria-controls={`panel-${c.id}`}
            tabIndex={c.id === active.id ? 0 : -1}
            className="child-tab"
            onClick={() => setActiveId(c.id)}
          >
            {c.firstName} {c.lastName}
          </button>
        ))}
      </div>

      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
      >
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <h2>{active.firstName} {active.lastName}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Grade {active.grade} · {school?.name || 'School'}
            </span>
          </div>
          <p className="form-help" style={{ marginTop: 0 }}>
            Grades update nightly. Contact your child's teacher for questions.
          </p>
        </div>

        {grades.length === 0 ? (
          <div className="card">
            <p>No grades have been posted yet for the current semester.</p>
          </div>
        ) : (
          <table className="data-table">
            <caption>Current-semester grades for {active.firstName}</caption>
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Letter</th>
                <th scope="col">Percent</th>
                <th scope="col">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={i}>
                  <th scope="row" style={{ fontWeight: 600 }}>{g.subject}</th>
                  <td>{g.grade}</td>
                  <td>{g.percent}%</td>
                  <td>{g.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
