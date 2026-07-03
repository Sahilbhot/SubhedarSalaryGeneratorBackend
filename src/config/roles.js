'use strict';

// Role definitions used across auth guards and validation.
//   admin   → global access, all branches, manages users & branches
//   manager → scoped to their branch, operational access
//   staff   → scoped to their branch, limited access
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

const ALL_ROLES = Object.values(ROLES);

// Roles that must be tied to a specific branch (admin is global).
const BRANCH_SCOPED_ROLES = [ROLES.MANAGER, ROLES.STAFF];

module.exports = { ROLES, ALL_ROLES, BRANCH_SCOPED_ROLES };
