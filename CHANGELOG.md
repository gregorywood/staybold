# Changelog

All notable changes to the StayBold project will be documented in this file.

## [Unreleased]

### 2025-12-03

#### Features Added
- Added notes field to habit tracking modal with textarea input
- Notes display as 📝 icon on calendar when present
- Added "today" CSS class to highlight current day
- Changed alcohol display from beer emoji to text labels (Few drinks, Tipsy, Drunk, Hammered, Black out)
- "No drinks" days show text label + green background

#### Deployment
- Deployed backend to Render at https://staybold.onrender.com
- Added gunicorn for production WSGI server
- Updated frontend API_URL to production endpoint
- Frontend deployed to personal domain
- Note: .htaccess password protection to be added

#### Bug Fixes
- Fixed duplicate "today" variable declaration
- Reordered indicators display: emojis first, then alcohol text label

### 2025-12-02

#### Initial Setup
- Created project folder structure (frontend/, backend/, data.json)
- Added README.md with project overview
- Added CHANGELOG.md for tracking progress
- Initialized git repository

#### Frontend
- Built mobile-first calendar view with vertical day rows
- Implemented modal for logging daily habits (alcohol, exercise, drugs)
- Added month navigation (back/forward through months)
- Added weekend class markers (sat/sun) for styling flexibility
- Added light green background for "no drinks" days
- Greyed out future days (non-interactive)
- Greyed out days before app start date (non-interactive)
- Disabled navigation buttons at boundary months (start month and current month)
- Note: APP_START_DATE is currently hardcoded to November 9, 2025. When multi-user auth is added, this will need to be per-user.

#### Backend
- Built Flask API with JSON file storage
- Endpoints: GET/POST /api/habits, GET /api/habits/<year>/<month>, DELETE /api/habits/<date>
- CORS enabled for frontend communication
- Data persists to data.json file
