export type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  category: string;
};

export type Account = {
  id: string;
  type: 'Savings' | 'Checking' | 'Investment';
  balance: number;
  accountNumber: string;
};

export const MOCK_USER = {
  name: 'Alexander Pierce',
  email: 'alex.pierce@codbank.com',
  memberSince: '2023-01-15',
  tier: 'Platinum Member',
};

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc_1', type: 'Checking', balance: 12450.75, accountNumber: '**** 4590' },
  { id: 'acc_2', type: 'Savings', balance: 45000.00, accountNumber: '**** 8812' },
  { id: 'acc_3', type: 'Investment', balance: 128400.20, accountNumber: '**** 3301' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', type: 'debit', amount: 85.00, description: 'Starbucks Coffee', date: '2024-03-10T09:30:00Z', category: 'Food & Dining' },
  { id: 'tx_2', type: 'credit', amount: 3500.00, description: 'Salary Deposit - Tech Corp', date: '2024-03-01T00:00:00Z', category: 'Income' },
  { id: 'tx_3', type: 'debit', amount: 1200.00, description: 'Monthly Rent Payment', date: '2024-03-01T08:00:00Z', category: 'Housing' },
  { id: 'tx_4', type: 'debit', amount: 45.20, description: 'Shell Gas Station', date: '2024-03-05T14:15:00Z', category: 'Transport' },
  { id: 'tx_5', type: 'credit', amount: 150.00, description: 'Dividend Payment - VTI', date: '2024-03-08T10:00:00Z', category: 'Investment' },
];