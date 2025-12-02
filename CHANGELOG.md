# Changelog

All notable changes to the StayBold project will be documented in this file.

## [Unreleased]

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
- Endpoints: GET/POST /api/habits, GET /api/habits/<year>/<month>
- CORS enabled for frontend communication
- Data persists to data.json file
