# Interfriends Admin Web App — Functional Overview

This document summarizes admin-visible functionality based on routes, components, and services under `src/app`.

**App structure**
- Angular 12 app with hash-based routing (`useHash: true`).
- Admin features are implemented inside the `User` module and gated by `AuthUserGuard`.
- Role control is driven by `admin_type` stored in `localStorage` under `admin_type_interFriendAdmin`.
- Many screens show extra actions when `admin_type === '2'` (likely super admin).

**Admin area (User module)**
Base path: `/user` (requires `AuthUserGuard`)

Admin routes and pages
- `/user/dashboard` — Admin dashboard overview
- `/user/categoryList` — Category management list
- `/user/updateProfile` — Admin profile update
- `/user/changePassword` — Change password
- `/user/userList` — All users list
- `/user/userDetail/:userId` — User detail
- `/user/singleUserDetail/:userId/:groupId` — User detail within a group
- `/user/singleUserGroupList/:userId` — User’s groups
- `/user/userGroupList/:groupId` — Users in a group
- `/user/UserGroupAddList/:groupId` — Add users to group
- `/user/circleList/:groupID` — Circles under a group
- `/user/circleUserList/:groupId/:circleId` — Users in a circle
- `/user/circleUserGroupAddList/:groupId/:circleId` — Add users to circle
- `/user/waiting-list/:groupId/:circleId` — Circle waiting list
- `/user/groupList` — Group list
- `/user/groupCycleList/:groupId` — Group cycle list
- `/user/groupCycleUserList/:groupId/:userId/:firstname/:lastname/:email` — Cycle details (standard)
- `/user/groupCycleJNRUserList/:groupId/:userId/:lifeCycleType/:firstname/:lastname/:email` — Cycle details (JNR)
- `/user/groupHelpToBuyUserList/:groupId/:userId/:lifeCycleType/:firstname/:lastname/:email` — Cycle details (Help-to-Buy)
- `/user/groupCycleStatusHistory/:cycleId` — Cycle status history
- `/user/payoutList/:groupId/:userId/:firstname/:lastname/:email` — Payout list (standard)
- `/user/payoutJNRList/:groupId/:userId/:lifeCycleType` — Payout list (JNR)
- `/user/payoutHelpToBuyList/:groupId/:userId/:lifeCycleType` — Payout list (Help-to-Buy)
- `/user/payout-request` — Payout request handling
- `/user/safekeeping-cycle-request` — Safe-keeping cycle request handling
- `/user/safeKeepingList/:groupId/:userId` — Safe-keeping list
- `/user/safeKeepingWithdral` — Safe-keeping withdrawal requests
- `/user/loanList/:groupId/:userId` — Loan list
- `/user/LoanPayment/:groupId/:userId/:loanId` — Loan payment history
- `/user/loanStatusHistory/:loanId` — Loan status history
- `/user/emergencyLoanList/:groupId/:userId` — Emergency loan list
- `/user/emergencyLoanStatusHistory/:loanId` — Emergency loan status history
- `/user/miscellaneousList/:groupId/:userId` — Miscellaneous loan list
- `/user/miscellaneousPayment/:groupId/:userId/:loanId` — Miscellaneous loan payments
- `/user/miscellaneousLoanStatusHistory/:loanId` — Miscellaneous loan status history
- `/user/welfare/:groupId/:userId` — Welfare loan administration
- `/user/notesHistoryComponent/:cycleId` — Welfare notes history
- `/user/helpToBuyCar/:groupId/:userId` — Help-to-Buy car loans
- `/user/helpToBuyProperty/:groupId/:userId` — Help-to-Buy property loans
- `/user/helpToPayCarInsurane/:groupId/:userId` — Help-to-Pay car insurance loans
- `/user/helpToPaycc/:groupId/:userId` — Help-to-Pay credit card loans
- `/user/pfList/:groupId/:userId` — Provident fund list
- `/user/PfPercentList` — PF percent settings
- `/user/loanPercentList` — Loan percent settings
- `/user/propertyList` — Property list
- `/user/propertyAdd` — Add property
- `/user/propertyEdit/:propertyId` — Edit property
- `/user/investmentList/:groupId/:userId` — Investments list
- `/user/profitList/:groupId/:userId` — Profit list
- `/user/investmentRequest` — Investment requests
- `/user/notificationList` — Notification list
- `/user/adminNotifications` — Admin notification settings
- `/user/addbanner-messages` — Banner message management
- `/user/contact-management` — Contact submissions management
- `/user/intrested-users` — Interested users list
- `/user/recommendUserList` — Recommended users approval
- `/user/blockUser` — Block/unblock users
- `/user/defaultUser` — Mark default users
- `/user/outstanding-payments` — Outstanding payments view
- `/user/download-data` — Data export/download
- `/user/groupsOfuser` — Grouped users dashboard
- `/user/groupedUserDetail/:groupId` — Grouped user detail
- `/user/my-circle` — My circle (admin view)
- `/user/user-credit-score` — User credit score view
- `/user/privacyPolicy` — Update privacy policy
- `/user/termCondition` — Update terms & conditions
- `/user/agmDemoMap` — Demo map
- `/user/agmDemoDirection` — Demo directions
- `/user/agmDemoCordinates` — Demo coordinates
- `/user/agmSearchMap` — Demo map search
- `/user/subadminList` — Sub-admin management (list/add/edit/block)

**Access control**
- `AuthUserGuard` protects all admin routes.
- `admin_type` controls the visibility of privileged actions across many screens (e.g., block/unblock, edits, approvals).

**Core admin functional areas (from services and components)**
Authentication and admin session
- Login, logout, session storage, auto-auth on reload
- Role-based UI via `admin_type` stored in localStorage
- Firebase Cloud Messaging token registration

User and group administration
- User list, user details, block/unblock, default user flag
- Groups, circles, waiting lists, and memberships
- User-group assignments and grouped user analytics

Savings, cycles, and payouts
- Group cycles and cycle status history
- Savings detail lists across lifecycle types
- Payout lists and payout requests
- Safe-keeping lists and withdrawal/cycle requests

Loans and approvals
- Standard loans, welfare, emergency, and miscellaneous loans
- Loan payment history and status history
- Help-to-Buy and Help-to-Pay loan variants
- Admin risk and note handling on welfare loans

Investments and properties
- Property list/add/edit
- Investment lists, profits, and investment requests

Configuration and content
- Category management
- Percent settings (PF, loan)
- Banner message management
- Privacy policy and terms updates

Messaging and notifications
- Admin notification settings
- Notification list and counters

Support and lead management
- Contact management
- Interested users list
- Recommended users approval

Data export
- Download data export screen

**Integrations and platform features**
- Backend API base: `environment.apiUrl`
- Admin endpoints invoked via services like `loan.service`, `groupCycle.service`, `subadminList.service`, `userList.service`, `investment.service`, `property.service`, `safeKeeping.service`.
- Firebase Cloud Messaging + Service Worker (`firebase-messaging-sw.js`)
- UI libraries: Angular Material spinner, ngx-toastr, ngx-image-cropper, ngx-image-zoom, Google Maps

**Notes for rebuild (Admin)**
- The admin UI is deeply coupled to the same API responses used by the current Angular 12 app.
- Role behavior hinges on `admin_type` and shows/hides many admin-only actions.
- Hash routing (`/#/`) is used; adjust if moving to path routing.

**Rebuild timeline (Admin, Angular 20, from scratch)**
Assumptions
- Team: 2 frontend engineers + 1 QA (part-time)
- Backend APIs remain compatible or provide stable mocks
- Design assets are available or can be recreated from the current UI

Estimated schedule (10–12 weeks total)
1. Week 1: Discovery and setup
   - Confirm admin scope, permissions, API contracts, and data models
   - Create Angular 20 workspace, CI, linting, routing strategy
2. Weeks 2–3: Core shell and auth
   - App layout, navigation, guards, session handling
   - Role-based UI (admin_type) and basic dashboard
3. Weeks 4–5: User and group administration
   - User list/detail, block/default
   - Groups, circles, waiting lists, grouped user views
4. Weeks 6–7: Savings, cycles, payouts
   - Cycle lists/history, payout views and requests
   - Safe-keeping lists and withdrawal/cycle requests
5. Weeks 8–9: Loans and approvals
   - Loan lists, payments, status history
   - Welfare, emergency, miscellaneous, Help-to-Buy/Pay variants
6. Week 10: Investments and properties
   - Property list/add/edit, investments, profits, requests
7. Week 11: Config, content, notifications
   - Categories, percent settings, banners, privacy/terms
   - Admin notifications and contact management
8. Week 12: QA hardening and release
   - E2E checks, accessibility pass, performance, bug fixes
   - Release candidate and production rollout

Notes
- If API changes are required, add 2–4 weeks depending on backend availability.
- If designs need a full redesign, add 2–3 weeks for UI/UX.
