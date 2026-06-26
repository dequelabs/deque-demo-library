import { Link } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { useStore } from './store.jsx';
import { fmtDate } from './format.js';

/**
 * Citizen dashboard (post-login).
 * Greets the signed-in citizen and surfaces live counts for each
 * service area, recent activity, and a profile snippet.
 */
export default function Account() {
  const { citizen } = useAuth();
  const { state } = useStore();

  const cards = [
    {
      to: '/edu-gov/schools',
      title: 'K-12 schools',
      blurb: `${state.children.length} children · ${state.schools.length} schools`,
      cta: 'Manage family',
    },
    {
      to: '/edu-gov/university',
      title: 'State university',
      blurb: `${state.enrollments.length} courses registered · ${state.courses.length} in catalog`,
      cta: 'Browse courses',
    },
    {
      to: '/edu-gov/services',
      title: 'State services',
      blurb: `${state.vehicles.length} vehicles · ${state.benefits.length} benefit applications`,
      cta: 'Open services',
    },
    {
      to: '/edu-gov/city',
      title: 'City services',
      blurb: `${state.permits.length} permits · voter ${state.voterRegistered ? 'registered' : 'not registered'}`,
      cta: 'Open city',
    },
  ];

  const activity = [
    state.enrollments[0] && {
      label: 'Registered for a university course',
      when: fmtDate(state.enrollments[0].registeredISO),
    },
    state.permits[0] && {
      label: `Submitted ${state.permits[0].kind} permit application`,
      when: fmtDate(state.permits[0].submittedISO),
    },
    state.benefits[0] && {
      label: `Submitted ${state.benefits[0].program} application`,
      when: fmtDate(state.benefits[0].submittedISO),
    },
    state.voterRegistered && {
      label: 'Updated voter registration',
      when: 'Recently',
    },
    {
      label: 'Signed in to Northbrook Connect',
      when: 'Today',
    },
  ].filter(Boolean);

  return (
    <>
      {/* PHASE-2 a11y issue NB-IGT-005 (Headings IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          Second <h1> on the page ("Welcome to Northbrook Connect") in
          addition to the existing "Welcome back, …" page <h1>. The
          Headings IGT verifies there is exactly one top-level heading;
          axe surfaces this as Needs Review by default. */}
      <h1 style={{ margin: '0 0 8px', fontSize: 22, color: 'var(--brand-deep)' }}>
        Welcome to Northbrook Connect
      </h1>

      <div className="page-head">
        <div>
          <h1>Welcome back, {citizen.firstName}.</h1>
          <p className="subtitle">Here is a quick look at your services.</p>
          {/* PHASE-2 a11y issue NB-IGT-012 (Images IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              State seal <img alt=""> placed next to identity content
              (the citizen greeting). Visually the seal communicates
              official identity but it's marked decorative. The Images
              IGT asks SEs to verify whether alt="" is appropriate for
              the surrounding context. */}
          <img src="/nbps-seal.svg" alt="" width="32" height="32" style={{ verticalAlign: 'middle', marginLeft: 8 }} />
        </div>
        <div>
          <Link className="btn btn-outline" to="/edu-gov">Public site</Link>
          {/* PHASE-2 a11y issue NB-036 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
              Icon-only "Settings" cog button has NO text / aria-label.
              axe-core `button-name` fires Critical (WCAG 4.1.2). SLED
              pattern: dashboard headers ship with utility icon buttons
              after a visual-density pass strips their text labels. */}
          <button type="button" style={{ background: 'none', border: 'none', marginLeft: 8, padding: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1c.5.5 1.2.6 1.8.3.6-.3 1-.9 1-1.5V3a2 2 0 1 1 4 0v.1c0 .6.4 1.2 1 1.5.6.3 1.3.2 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1c-.6 0-1.2.4-1.5 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* PHASE-2 a11y issue NB-037 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Profile completeness" <div role="meter"> with NO aria-label.
          axe-core `aria-meter-name` fires Critical (WCAG 1.1.1). SLED
          pattern: account dashboards visualise profile completeness
          using meters but the textual label sits separately. */}
      <div role="meter" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: '#e5e7eb', maxWidth: 360, marginBottom: 16 }}>
        <div style={{ width: '75%', height: '100%', background: '#0a66c2' }} />
      </div>

      {/* PHASE-2 a11y issue NB-038 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Jump to section" <select> has NO label or aria-label. axe-core
          `select-name` fires Critical (WCAG 4.1.2). SLED pattern:
          in-page jump menus rely on placeholder option text instead of
          a programmatic label. */}
      <div style={{ marginBottom: 16 }}>
        <select defaultValue="">
          <option value="" disabled>Jump to section…</option>
          <option value="services">Your services</option>
          <option value="activity">Recent activity</option>
          <option value="profile">Profile</option>
        </select>
      </div>

      {/* PHASE-2 a11y issue NB-039 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Show announcements" <button role="switch"> has no inner text
          and no aria-label. axe-core `aria-toggle-field-name` fires
          Serious (WCAG 4.1.2). SLED pattern: toggle controls rendered
          as a pure CSS pill with text removed during a UI refresh. */}
      <button type="button" role="switch" aria-checked="false" style={{ width: 36, height: 18, background: '#e5e7eb', border: 'none', borderRadius: 9, marginBottom: 16 }}></button>

      <section aria-labelledby="services-h" style={{ marginBottom: 32 }}>
        <h2 id="services-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
          Your services
        </h2>
        {/* PHASE-2 a11y issue NB-040 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stat label uses a light grey #b0b0b0 on white (~2.6:1).
            axe-core `color-contrast` fires Serious (WCAG 1.4.3). SLED
            pattern: "small meta" labels under a stat receive a grey
            colour that fails AA when audited. */}
        <p style={{ color: '#b0b0b0', background: '#ffffff', fontSize: 13 }}>
          Updated moments ago.
        </p>

        {/* PHASE-2 a11y issue NB-041 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Tablist <div role="tablist"> contains <div> children that
            lack role="tab". axe-core `aria-required-children` fires
            Critical (WCAG 1.3.1). SLED pattern: custom tab UIs that
            don't follow the WAI-ARIA Authoring Practices pattern. */}
        <div role="tablist" aria-label="Service filter" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '4px 8px', border: '1px solid var(--border)' }}>All</div>
          <div style={{ padding: '4px 8px', border: '1px solid var(--border)' }}>K-12</div>
          <div style={{ padding: '4px 8px', border: '1px solid var(--border)' }}>City</div>
        </div>

        {/* PHASE-2 a11y issue NB-042 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty quick-link <a> (icon-only) with NO accessible name.
            axe-core `link-name` fires Critical (WCAG 2.4.4). SLED
            pattern: "quick links" row implemented as icon tiles whose
            aria-labels were never added. */}
        <a href="/edu-gov/account" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', width: 20, height: 20, border: '1px solid var(--border)', marginBottom: 12 }}></a>
        <div className="service-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {cards.map((c, idx) => (
            /* PHASE-2 a11y issue NB-IGT-017 (Reading Order IGT) — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
               Applies style={{ order: -1 }} to the LAST service card so
               it visually renders FIRST in the grid while remaining last
               in the DOM. The Reading Order IGT walks SEs through
               verifying DOM vs visual order parity. */
            <Link
              key={c.to}
              to={c.to}
              className="service-card"
              style={idx === cards.length - 1 ? { order: -1 } : undefined}
            >
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <span className="count">{c.cta} &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PHASE-2 a11y issue NB-190 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
          "Quick actions" rendered as a styled <div> (22 px / 700 /
          brand-deep / left-aligned) — visually a section heading but
          semantically not. axe DevTools Pro Advanced `heading-markup`
          AI/CV rule detects the visual heading pattern. Serious
          (WCAG 1.3.1). Realistic SLED pattern: dashboard sub-sections
          styled by CSS instead of using semantic heading markup. */}
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-deep)', margin: '0 0 8px' }}>
        Quick actions
      </div>
      <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', fontSize: 14 }}>
        The three most common things citizens do from here.
      </p>

      <section aria-labelledby="activity-h" style={{ marginBottom: 32 }}>
        <h2 id="activity-h" style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--brand-deep)' }}>
          Recent activity
        </h2>
        {/* PHASE-2 a11y issue NB-043 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Inline activity icon <svg role="img"> with NO <title> /
            aria-label. axe-core `svg-img-alt` fires Serious (WCAG
            1.1.1). SLED pattern: activity feeds add type-icons that
            aren't decorative but lack accessible names. */}
        <svg role="img" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
        {/* PHASE-2 a11y issue NB-044 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `lang="qz"` is not a valid BCP-47 subtag. axe-core
            `valid-lang` fires Serious (WCAG 3.1.2). SLED pattern: an
            editor adds a quoted phrase in another language but mistypes
            the lang code. */}
        <span lang="qz" style={{ fontStyle: 'italic' }}>Bonjour</span>
        {/* PHASE-2 a11y issue NB-045 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Empty <span role="tooltip">. axe-core `aria-tooltip-name`
            fires Serious (WCAG 4.1.2). SLED pattern: hovercards mounted
            empty for hydration. */}
        <span role="tooltip" id="acct-tip" />
        {/* PHASE-2 a11y issue NB-046 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Stray <dd> outside any <dl>. axe-core `dlitem` fires
            Serious (WCAG 1.3.1). SLED pattern: orphaned description
            element left after a partial markup refactor. */}
        <dd style={{ display: 'none' }}>Activity description</dd>
        <ul className="activity-strip">
          {activity.map((a, i) => (
            <li key={i}>
              <span>{a.label}</span>
              <span className="when">{a.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="profile" aria-labelledby="profile-h" className="card">
        <div className="card-head">
          <h2 id="profile-h">Profile</h2>
          <Link className="btn-link" to="/edu-gov/account">Edit</Link>
        </div>
        {/* PHASE-2 a11y issue NB-047 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            Custom search field uses <div role="searchbox" contentEditable>
            with NO aria-label / aria-labelledby. axe-core
            `aria-input-field-name` fires Moderate (WCAG 4.1.2). SLED
            pattern: profile pages add contentEditable "search this
            profile" widgets without a programmatic name. */}
        <div role="searchbox" contentEditable="true" suppressContentEditableWarning style={{ border: '1px solid var(--border)', padding: 6, borderRadius: 4, marginBottom: 12 }}></div>

        {/* PHASE-2 a11y issue NB-048 — see NORTHBROOK_ACCESSIBILITY_ISSUES.md
            `aria-discribedby` (mis-spelled) — should be
            `aria-describedby`. axe-core `aria-valid-attr` fires
            Critical (WCAG 4.1.2). SLED pattern: copy-paste typos in
            attribute names that survive linting if the project does
            not run jsx-a11y. */}
        <p id="profile-note" aria-discribedby="profile-note" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Your profile info is shared across all Northbrook services.
        </p>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 16px', margin: 0, fontSize: 14 }}>
          <dt style={{ color: 'var(--text-muted)' }}>Name</dt>
          <dd style={{ margin: 0 }}>{citizen.firstName} {citizen.lastName}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Email</dt>
          <dd style={{ margin: 0 }}>{citizen.email}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Phone</dt>
          <dd style={{ margin: 0 }}>{citizen.phone}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Address</dt>
          <dd style={{ margin: 0 }}>
            {citizen.address.line1}, {citizen.address.city}, {citizen.address.state} {citizen.address.zip}
          </dd>
        </dl>
      </section>
    </>
  );
}
