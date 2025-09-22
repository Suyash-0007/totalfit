
# TotalFit

## Overview
TotalFit is a full-stack fitness and health management platform that integrates Google Fit, AI-driven recommendations, and athlete data management. It is designed to help users track their health, receive personalized suggestions, and manage performance data efficiently.

## Features
- **Google Fit Integration:** Sync and analyze health data from Google Fit.
- **AI Recommendations:** Get personalized fitness and health suggestions powered by a Python ML microservice.
- **Athlete Management:** Track athlete profiles, career, injuries, performance, and finance.
- **Gamification:** Badges and live status to boost user engagement.
- **Secure Authentication:** Google OAuth and protected routes.
- **Global Search:** Quickly find athletes, coaches, and data.

## Tech Stack
### Frontend
- **Next.js** (React, SSR/SSG)
- **TypeScript**
- **Custom UI Components** (Buttons, Cards, Dialogs, etc.)
- **Context API** for state management
- **PostCSS** for CSS processing

### Backend
- **Node.js**
- **TypeScript**
- **Prisma ORM** (PostgreSQL/MySQL/SQLite)
- **RESTful API**
- **Business Logic Services**

### Machine Learning Service
- **Python**
- **Flask/FastAPI** (for ML microservice)
- **requirements.txt** for dependencies

### Miscellaneous
- **ESLint** for linting
- **Firebase** for authentication (optional)
- **Markdown Documentation**

## Setup Instructions
1. Clone the repository:
	```sh
	git clone https://github.com/your-username/totalfit.git
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Set up environment variables as per documentation.
4. Start the development server:
	```sh
	npm run dev
	```
5. For ML service, set up Python environment and run:
	```sh
	pip install -r requirements.txt
	python ml_service/main.py
	```

## Folder Structure
- `src/app/` - Next.js pages and routing
- `src/components/` - Reusable UI components
- `server/` - Backend API and services
- `ml_service/` - Python ML microservice
- `public/` - Static assets

## Copyright
© 2025 TotalFit Team. All rights reserved.

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contributors
- Member 1: Frontend Specialist
- Member 2: Backend Specialist
- Member 3: ML/AI Specialist
- Member 4: DevOps/Integration Specialist

## Contact
For questions or support, open an issue or contact the team via GitHub.
