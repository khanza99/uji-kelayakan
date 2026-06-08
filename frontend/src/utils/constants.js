export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const STORAGE_URL = 'http://localhost:8000/storage';

// Concert status
export const CONCERT_STATUS = {
  draft: { label: 'Draft', color: 'gray' },
  published: { label: 'Published', color: 'info' },
  ongoing: { label: 'Ongoing', color: 'warning' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
};

// Order status
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  expired: { label: 'Expired', color: 'gray' },
  refunded: { label: 'Refunded', color: 'info' },
};

// Ticket status
export const TICKET_STATUS = {
  active: { label: 'Active', color: 'success' },
  used: { label: 'Used', color: 'gray' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  refunded: { label: 'Refunded', color: 'info' },
};

// Payment status
export const PAYMENT_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  success: { label: 'Success', color: 'success' },
  failed: { label: 'Failed', color: 'danger' },
};

// Refund status
export const REFUND_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'danger' },
};

// Seat status
export const SEAT_STATUS = {
  available: { label: 'Available', color: 'success' },
  reserved: { label: 'Reserved', color: 'warning' },
  sold: { label: 'Sold', color: 'danger' },
  blocked: { label: 'Blocked', color: 'gray' },
};

// Document types
export const DOC_TYPES = {
  poster: 'Poster',
  flyer: 'Flyer',
  contract: 'Contract',
  other: 'Other',
};

// User roles
export const USER_ROLES = {
  superadmin: { label: 'Super Admin', color: 'danger' },
  staff: { label: 'Staff', color: 'warning' },
  user: { label: 'User', color: 'info' },
};

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
];
