# Grocery Management System

A full-stack grocery booking system built with NestJS (Backend), Next.js (Frontend), and PostgreSQL.

## Features

### Admin
- **Manage Inventory**: Add, Update, View, and Remove grocery items.
- **Stock Control**: Update inventory levels for any item.
- **Dashboard**: View business statistics and orders.

### User
- **Browse**: View available grocery items with categories and search.
- **Book Orders**: Add multiple items to a basket and place an order in one go.
- **Order History**: Track previous bookings.

## Tech Stack
- **Frontend**: Next.js 14, Redux Toolkit, Framer Motion, Lucide Icons, Tailwind CSS.
- **Backend**: NestJS, TypeORM, Passport.js (JWT), Swagger.
- **Database**: PostgreSQL.
- **Containerization**: Docker & Docker Compose.

## How to Run

### Prerequisites
- Docker & Docker Compose installed.

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "Grocary Management"
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Seed the database** (Admin account & dummy data):
   In a new terminal, run:
   ```bash
   docker exec -it grocery_backend npm run seed
   ```

4. **Access the applications**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8971/api](http://localhost:8971/api)
   - **Swagger Docs**: [http://localhost:8971/api/docs](http://localhost:8971/api/docs)

### Admin Credentials (Seeded)
- **Email**: razzak172758@gmail.com
- **Password**: Admin1234