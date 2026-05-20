// Seed data for the DQBC prototype.
// Used to initialize the store on first load, and to reset the demo.

export const SEED_USER = {
  id: 'dq',
  firstName: 'Deke',
  lastName: 'Quinn',
  email: 'dq@deque.com',
  phone: '(555) 010-3829',
  address: {
    line1: '142 Park Avenue',
    line2: 'Apt 4B',
    city: 'Chicago',
    state: 'IL',
    zip: '60607',
  },
  notifications: {
    largeTransactions: true,
    cardSwipe: true,
    productNews: false,
    monthlyStatements: true,
  },
};

export const SEED_ACCOUNTS = [
  {
    id: 'chk',
    type: 'checking',
    name: 'Everyday Checking',
    last4: '1284',
    balance: 3128.42,
    apy: 0,
    openedISO: '2018-03-15',
  },
  {
    id: 'sav',
    type: 'savings',
    name: 'Smart Savings',
    last4: '9012',
    balance: 24890.18,
    apy: 4.25,
    openedISO: '2020-07-22',
  },
  {
    id: 'brk',
    type: 'brokerage',
    name: 'Brokerage',
    last4: '4471',
    balance: 20199.34,
    apy: 0,
    openedISO: '2021-11-08',
  },
];

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const SEED_TRANSACTIONS = [
  { id: 't1', accountId: 'chk', dateISO: today(),    merchant: 'Whole Foods Market',         category: 'Groceries',     amount: -84.21 },
  { id: 't2', accountId: 'chk', dateISO: today(),    merchant: 'Direct deposit — ACME Corp', category: 'Income',        amount: 3214.87 },
  { id: 't3', accountId: 'chk', dateISO: daysAgo(1), merchant: 'Comcast',                    category: 'Utilities',     amount: -98.00 },
  { id: 't4', accountId: 'sav', dateISO: daysAgo(3), merchant: 'Transfer from Checking',     category: 'Transfer',      amount: 500.00 },
  { id: 't5', accountId: 'chk', dateISO: daysAgo(3), merchant: 'Transfer to Smart Savings',  category: 'Transfer',      amount: -500.00 },
  { id: 't6', accountId: 'chk', dateISO: daysAgo(4), merchant: 'Apple',                      category: 'Subscriptions', amount: -9.99 },
  { id: 't7', accountId: 'chk', dateISO: daysAgo(6), merchant: 'Shell',                      category: 'Transport',     amount: -52.30 },
  { id: 't8', accountId: 'chk', dateISO: daysAgo(8), merchant: 'Sweetgreen',                 category: 'Dining',        amount: -16.45 },
  { id: 't9', accountId: 'sav', dateISO: daysAgo(10),merchant: 'Interest credit',            category: 'Income',        amount: 87.34 },
];

export const SEED_PAYEES = [
  { id: 'p1', name: 'ComEd',           accountNumber: '****-3344', category: 'Utilities' },
  { id: 'p2', name: 'AT&T Wireless',   accountNumber: '****-7821', category: 'Telecom'   },
  { id: 'p3', name: 'Chicago Water',   accountNumber: '****-1027', category: 'Utilities' },
  { id: 'p4', name: 'Liberty Mutual',  accountNumber: '****-9090', category: 'Insurance' },
];

export const SEED_SCHEDULED_PAYMENTS = [
  // populated by the user via Bills page
];

export const SEED_CARDS = [
  {
    id: 'c1',
    type: 'debit',
    network: 'Visa',
    last4: '1284',
    accountId: 'chk',
    locked: false,
    spendingLimit: 2500,
    expISO: '2028-04',
    nameOnCard: 'DEKE QUINN',
  },
  {
    id: 'c2',
    type: 'credit',
    network: 'Visa',
    last4: '6782',
    accountId: null,           // credit cards aren't tied to a deposit account
    locked: false,
    spendingLimit: 8000,
    expISO: '2027-09',
    nameOnCard: 'DEKE QUINN',
    creditBalance: 412.90,
    creditLimit: 8000,
  },
];

export const SEED_STATEMENTS = (() => {
  // 12 months of mock statements, one per account
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const yr = new Date().getFullYear();
  const out = [];
  let id = 1;
  ['chk', 'sav', 'brk'].forEach((acct) => {
    for (let i = 0; i < 12; i++) {
      out.push({
        id: 's' + id++,
        accountId: acct,
        period: `${months[i]} ${yr}`,
        startISO: `${yr}-${String(i + 1).padStart(2, '0')}-01`,
        endISO:   `${yr}-${String(i + 1).padStart(2, '0')}-28`,
        sizeKB: 80 + Math.floor(Math.random() * 60),
      });
    }
  });
  return out;
})();

// Convenience: full initial state shape used by the store.
export function buildInitialState() {
  return {
    isAuthenticated: false,
    user: SEED_USER,
    accounts: SEED_ACCOUNTS,
    transactions: SEED_TRANSACTIONS,
    payees: SEED_PAYEES,
    scheduledPayments: SEED_SCHEDULED_PAYMENTS,
    cards: SEED_CARDS,
    statements: SEED_STATEMENTS,
  };
}
