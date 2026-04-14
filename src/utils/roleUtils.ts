export const normalizeRole = (role?: string | null) => (role || '').trim().toLowerCase();

export const isManagerRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'manager' || normalizedRole === 'admin';
};

export const isMemberRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'member' || normalizedRole === 'worker';
};
