# TutorPixie

One on One online tutoring platform to connect students from across the globe to quality tutors with a comprehensive dashboard to schedule classes and for invoicing.

---

## PROJECT OVERVIEW

### Database: PostgreSQL with Prisma ORM

- To store the details of the students, teachers, and admins.
- User Database, Session database, and billing & invoice database.
- PostgreSQL works for to be cheaper and more cost effective compared to MongoDB for this application.

### Backend: Express JS

- To run the backend server to serve API endpoints.

### Frontend: NextJS, ReactJS, TailwindCSS

- Use of NextJS for better SEO and server side components.
- For a smooth interactive UI for the users.
- Login functionality for students, teachers, and admins.
- Student, Teacher and Admin dashboards.
- My Classes tab with selected subjects as well as an option to add new subjects.
- Each subject will have its own tutor, class history, homework assignment, and request/cancel class option.
- Every class is logged and added to the student billing and teacher’s total fee for the end of the month.
- Admin panel with complete payment and class metrics.
- Admins should have the ability to generate student credentials and assign subjects, teachers, and class schedules.

### JWT Tokens

- For secure authentication and authorization.

### Google Meet Rest API: to schedule classes

- Since all classes happen on Google meet, the

### Payment Gateway: Stripe

- Since the billing will be for students around the world, we need a payment gateway that is compatible internationally, like Stripe.

### pdfMake/JsPDF:

- to export invoices and other metrics in a PDF format with dynamic content.

### Nodemailer:

- send invoices and other notifications to the students and teachers

### GrapQL:

- Analytics for admins to get summaries.

---

## TIMELINE

### Week 1 & 2

- Create low-fid and high-fid design for the basic pages for a project overview.
- Create basic frontend routing to pages
- JWT based Login functionality.
- Basic backend setup with User modal, routes and controllers.
- Create basic endpoints and authentication middlewares.

### Week 3 & 4

- Create dashboard for students, teachers and admins.
- Create CRUD endpoints for session, user and billing.
- Make all basic frontend pages.
- Work with google meet API for class scheduling
- Make frontend pages dynamic by fetching and displaying data from frontend with edit functionality for the same.

### Week 5 & 6

- Handle billing and invoicing.
- Integrate Stripe payment gateway for international billing.
- Role based authentication for frontend pages and backend APIs.
- Final testing and debugging.
- Hosting

---
