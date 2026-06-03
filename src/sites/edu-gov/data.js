// Seed data for the Northbrook Connect (NBC) prototype.
// Used to initialize the store on first load, and to reset the demo.

export const SEED_CITIZEN = {
  id: 'rq',
  firstName: 'Rowan',
  lastName: 'Quinn',
  email: 'rowan.quinn@example.com',
  phone: '(555) 240-1187',
  address: {
    line1: '418 Cedar Ridge Road',
    city: 'Northbrook',
    state: 'NB',
    zip: '98221',
  },
  dob: '1984-06-18',
};

export const SEED_CHILDREN = [
  {
    id: 'kid-maya',
    firstName: 'Maya',
    lastName: 'Quinn',
    dob: '2011-09-04',
    age: 14,
    grade: '9',
    schoolId: 'sch-nbh',
  },
  {
    id: 'kid-eli',
    firstName: 'Eli',
    lastName: 'Quinn',
    dob: '2016-02-22',
    age: 9,
    grade: '4',
    schoolId: 'sch-cbe',
  },
];

export const SEED_SCHOOLS = [
  {
    id: 'sch-cbe',
    name: 'Cedarbrook Elementary',
    grades: 'K–5',
    address: '120 Cedarbrook Lane, Northbrook, NB 98221',
    phone: '(555) 240-3300',
    principal: 'Dr. Anika Reyes',
    students: 412,
  },
  {
    id: 'sch-bwm',
    name: 'Birchwood Middle School',
    grades: '6–8',
    address: '2400 Birchwood Avenue, Northbrook, NB 98223',
    phone: '(555) 240-3450',
    principal: 'Mr. Tomás Webb',
    students: 638,
  },
  {
    id: 'sch-nbh',
    name: 'Northbrook High School',
    grades: '9–12',
    address: '1500 Evergreen Way, Northbrook, NB 98225',
    phone: '(555) 240-3600',
    principal: 'Dr. Priya Okafor',
    students: 1184,
  },
  {
    id: 'sch-wol',
    name: 'Westwood Online Academy',
    grades: 'K–12',
    address: 'Virtual · Northbrook State',
    phone: '(555) 240-3700',
    principal: 'Ms. Jordan Hale',
    students: 287,
  },
];

// Per-child grade records (subject, letter, percent, teacher)
export const SEED_GRADES = {
  'kid-maya': [
    { subject: 'English 9',          grade: 'A-', percent: 91, teacher: 'Mr. Holloway' },
    { subject: 'Algebra I',          grade: 'B+', percent: 88, teacher: 'Ms. Park' },
    { subject: 'World History',      grade: 'A',  percent: 94, teacher: 'Dr. Mendel' },
    { subject: 'Biology',            grade: 'B',  percent: 84, teacher: 'Mr. Acosta' },
    { subject: 'Spanish I',          grade: 'A',  percent: 95, teacher: 'Sra. Núñez' },
    { subject: 'PE / Health',        grade: 'A',  percent: 98, teacher: 'Coach Lyle' },
  ],
  'kid-eli': [
    { subject: 'Reading',            grade: 'A',  percent: 93, teacher: 'Ms. Trembley' },
    { subject: 'Math',               grade: 'A-', percent: 90, teacher: 'Ms. Trembley' },
    { subject: 'Science',            grade: 'B+', percent: 87, teacher: 'Mr. Ko' },
    { subject: 'Social Studies',     grade: 'A',  percent: 92, teacher: 'Ms. Trembley' },
    { subject: 'Art',                grade: 'A',  percent: 96, teacher: 'Ms. Vega' },
  ],
};

export const SEED_VEHICLES = [
  {
    id: 'veh-1',
    plate: 'NB 4F-7821',
    make: 'Subaru',
    model: 'Outback',
    year: 2019,
    registrationExpiresISO: '2026-09-30',
  },
  {
    id: 'veh-2',
    plate: 'NB 9K-2204',
    make: 'Toyota',
    model: 'Prius',
    year: 2022,
    registrationExpiresISO: '2027-02-15',
  },
];

export const SEED_BENEFITS = [];

export const SEED_PERMITS = [];

// NSU (Northbrook State University) course catalog
export const SEED_COURSES = [
  { id: 'crs-cs101', code: 'CS 101',  title: 'Intro to Computer Science',  credits: 4, instructor: 'Dr. Imani Cole',     days: 'MWF', time: '9:00–9:50 AM',   capacity: 120, enrolled: 88 },
  { id: 'crs-en210', code: 'EN 210',  title: 'American Literature',        credits: 3, instructor: 'Prof. Sasha Vidal',   days: 'TTh', time: '11:00–12:15 PM', capacity: 40,  enrolled: 32 },
  { id: 'crs-ma151', code: 'MA 151',  title: 'Calculus I',                 credits: 4, instructor: 'Dr. Pavel Ortiz',     days: 'MWF', time: '10:00–10:50 AM', capacity: 60,  enrolled: 55 },
  { id: 'crs-bi200', code: 'BI 200',  title: 'Cell Biology',               credits: 4, instructor: 'Dr. Helena Quan',     days: 'TTh', time: '1:00–2:15 PM',   capacity: 50,  enrolled: 41 },
  { id: 'crs-ps110', code: 'PS 110',  title: 'Intro to Public Policy',     credits: 3, instructor: 'Prof. Marcus Lin',    days: 'MW',  time: '2:00–3:15 PM',   capacity: 35,  enrolled: 18 },
  { id: 'crs-ar105', code: 'AR 105',  title: 'Drawing Foundations',        credits: 3, instructor: 'Prof. Yuki Tanaka',   days: 'TTh', time: '9:00–11:00 AM',  capacity: 24,  enrolled: 24 },
  { id: 'crs-en101', code: 'EN 101',  title: 'College Composition',        credits: 3, instructor: 'Dr. Naomi Briggs',    days: 'MWF', time: '12:00–12:50 PM', capacity: 25,  enrolled: 16 },
  { id: 'crs-hi240', code: 'HI 240',  title: 'Pacific Northwest History',  credits: 3, instructor: 'Prof. Dale Hunter',   days: 'TTh', time: '3:30–4:45 PM',   capacity: 45,  enrolled: 22 },
];

export const SEED_ENROLLMENTS = [];

// Convenience: full initial state shape used by the store.
export function buildInitialState() {
  return {
    isAuthenticated: false,
    citizen: SEED_CITIZEN,
    children: SEED_CHILDREN,
    schools: SEED_SCHOOLS,
    grades: SEED_GRADES,
    vehicles: SEED_VEHICLES,
    benefits: SEED_BENEFITS,
    permits: SEED_PERMITS,
    courses: SEED_COURSES,
    enrollments: SEED_ENROLLMENTS,
    voterRegistered: false,
  };
}
