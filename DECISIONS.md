# Architectural Decisions & Technical Evaluation

This document outlines the engineering rationale, architectural patterns, design trade-offs, and scalability analysis for **Acowale Customer Feedback CRM**.

---

## Technology Stack Rationale

### 1. Why React?
* **Component Reusability**: React's component-based nature allows isolating complex elements like the star-rating system, debounced search filters, responsive sidebar drawer, and interactive Recharts graphs.
* **Reactive UI updates**: A CRM requires responsive interaction states (e.g. fast search feedback, star hover highlights, pagination flips). React's Virtual DOM ensures these state changes render smoothly.
* **Ecosystem Maturity**: React's ecosystem provides top-tier libraries (Vite, Framer Motion, React Hook Form, Tailwind CSS, Recharts) out of the box, facilitating rapid development without building complex abstractions from scratch.

### 2. Why Express?
* **Performance & Asynchrony**: Built on Node.js's event-driven, non-blocking I/O model, Express is ideal for handling concurrent REST requests (like public submissions and admin queries) with low resource overhead.
* **Middleware Paradigm**: Express allows writing modular middleware layers. This simplified the inclusion of security controls (Helmet), network traffic monitoring (Morgan), request sanitization (express-validator), and spam prevention (express-rate-limit).
* **Minimalist Approach**: Express does not force opinions on folder structure or ORM/ODM choice, allowing us to implement a clean, lightweight MVC directory model.

### 3. Why MongoDB?
* **Flexible Schema matching Customer Feedback**: Feedback messages can range from short compliments to extensive bug traces. Document stores permit structural updates (like adding nested metadata fields or system logs) without requiring complex schema migrations.
* **Native Geo/Search Indices**: MongoDB's text indexing makes multi-field query matching (`$or` matches over Name, Email, and Message text) fast and simple.
* **Horizontal Scalability**: MongoDB Atlas provides native sharding, replication sets, and auto-scaling, supporting easy growth from prototype to large-scale traffic.

---

## Architectural Layout

We adopted a standard decoupled **Client-Server MVC Architecture**.

### Backend MVC Directory Pattern:
* **Models**: Represents the schema structure (`Feedback.js`) with Mongoose validation rules.
* **Controllers**: Implements query parsing, database interactions, aggregation pipelines, and sorting/paging logic.
* **Routes**: Maps incoming HTTP requests to validators, rate limiters, and controllers.
* **Middlewares**: Enforces security headers, rate checks, and standardized error handling.
* **Validators**: Uses `express-validator` to inspect parameter integrity prior to database inserts.

### Frontend Component Pattern:
* **Services**: Modularized api triggers (`Axios` configured instances).
* **Context**: Global theme hooks (Light vs Dark mode switches).
* **Hooks**: Custom utilities (like `useDebounce`) to regulate search frequencies.
* **Pages/Layouts**: Clean segregation of presentation shells (Admin Layout, Public Portal) from content nodes.

---

## Trade-offs Made
1. **No Admin Authentication (Auth/RBAC)**: To fit the scope of a machine test, the `/admin` console routes and `/api/feedback` GET/DELETE endpoints are public, relying on rate limits rather than full JWT/OAuth security. *Trade-off details: Highly responsive dashboard for verification, but must be secured before enterprise production deployment.*
2. **Client-Side CSV Formatting**: Standard CSV conversion is executed on the frontend. *Trade-off details: Reduces backend CPU workload, but for collections exceeding 10,000 items, generating blobs in the browser could cause temporary client-side memory spikes.*
3. **Cursor vs Offset Pagination**: Implemented offset-based pagination (`skip` and `limit`). *Trade-off details: Simple to write and supports sorting by any field, but for extremely deep datasets (100k+ pages), Mongoose offset queries become slower as the database must traverse past records.*

---

## Scale Analysis (100,000+ Active Users)

### How would the application behave under high load?
1. **Express Server CPU/Event Loop Blockages**: Submitting feedback performs Mongoose schema validation. Under 100,000 active users, concurrent operations could lead to event loop lag.
2. **MongoDB Connection Starvation**: With standard configurations, Mongoose maintains a pool size of 10 connections. 100,000 concurrent write attempts would lead to request queues timing out.
3. **Recharts Browser Rendering Overhead**: The line charts plot daily counts. If we pull raw records or do not aggregate on the database server, the browser tab will crash due to plotting thousands of nodes.

### Scalability Improvements:
* **Database Optimization**:
  * Implement **Mongoose lean queries** (`.lean()`) for read operations (like loading the dashboard lists) to bypass Mongoose document hydration.
  * Create compound indexes on `{ category: 1, rating: 1, createdAt: -1 }` to support fast searches without memory sorts.
* **Server Performance**:
  * Set up clustering or deploy behind a load balancer (NGINX, AWS ALB) to distribute incoming requests across multiple Express instances.
  * Add a **Redis Caching layer** for `/api/analytics`. Since aggregate counts do not need millisecond-level real-time updates, caching stats for 5–10 minutes saves database reads.
* **Asynchronous Write Queues**:
  * Instead of writing feedback directly to MongoDB during the HTTP request lifecycle, publish the incoming feedback to a message broker (**RabbitMQ** or **Apache Kafka**). A worker pool can then process and batch-insert items to MongoDB, capping the database write stress.

---

## Roadmap: One More Week of Development
If given another week, I would focus on:
1. **User Authentication & RBAC**: Integrate JWT credentials, session cookie management, and MFA.
2. **Real-time Synchronization**: Use WebSockets (`socket.io`) to stream incoming feedback directly to the Admin Dashboard stats page in real time.
3. **Comprehensive Test Coverage**: Add unit tests using Jest/Supertest for API endpoints and component mock tests using Vitest/React Testing Library.

---

## Technical Challenges & AI Tools

### Hardest Technical Challenge
Ensuring the dashboard charts didn't break or show visual anomalies when the database had zero records or had gaps in the last 7 days. I solved this by implementing a timeline compilation algorithm in the `analyticsController` that dynamically maps dates from the past 7 days and populates a default count of `0` if no feedback was logged on a specific day.

### AI Assistance Evaluation
* **AI Tools Used**: Gemini 3.5 Flash.
* **Where AI Helped**: Formulating Mongoose aggregation pipelines for date-grouping and calculating category percentages in a single query.
* **Where AI Was Wrong**: Initially suggested utilizing client-side calculations for dashboard chart trends, which would run slowly as the feedback database grew in production. I corrected this by moving the date aggregation directly into MongoDB.
