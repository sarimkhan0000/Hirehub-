\# HireHub — Full-Stack Job Portal \& Applicant Tracking System (ATS)



HireHub is a full-stack web application built to streamline the recruitment process for employers and job seekers. Developed using \*\*Java 21 \& Spring Boot\*\*, \*\*React.js (Vite)\*\*, and \*\*MySQL\*\*, it supports role-based job posting, PDF resume uploads, and an interactive ATS dashboard.



\## Key Features

\- \*\*Job Management:\*\* Create, view, and manage job listings in real time.

\- \*\*Resume Upload \& Storage:\*\* Candidates can apply to jobs with PDF resumes directly stored and served by the backend.

\- \*\*Recruiter ATS Dashboard:\*\* Track applicants and update candidate statuses (\*\*Pending\*\*, \*\*Shortlisted\*\*, \*\*Rejected\*\*).

\- \*\*Modern Responsive UI:\*\* Features a clean interface with custom Dark and Light mode support.



\## Tech Stack

\- \*\*Backend:\*\* Java 21, Spring Boot, Spring Data JPA, Spring Security, Maven

\- \*\*Frontend:\*\* React.js (Vite), JavaScript (ES6+), CSS3

\- \*\*Database:\*\* MySQL



\## Project Structure

\- `hirehub-backend/` — Spring Boot REST API (Controllers, Entities, JPA Repositories)

\- `hirehub-frontent/` — React + Vite Frontend UI

\- `uploads/` — Resume storage directory



\## How to Run Locally

1\. Clone the repository: `git clone https://github.com/sarimkhan0000/Hirehub-.git`

2\. Backend: Go to `hirehub-backend`, configure MySQL in `application.properties`, and run `./mvnw spring-boot:run`

3\. Frontend: Go to `hirehub-frontent` and run `npm install` followed by `npm run dev`

