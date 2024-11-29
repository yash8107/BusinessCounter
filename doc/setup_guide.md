# BusinessCounter Setup Guide

## Prerequisites
- Node.js (Latest LTS version)
- PostgreSQL (Latest version)
- npm or yarn package manager

## Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/yash8107/BusinessCounter.git
cd BusinessCounter
```

2. **Install Dependencies**
```bash
npm install
```

3. **Database Setup**
- Install PostgreSQL if not already installed
- Create a new database named 'Business-counter-db'
- Configure database connection:
  - Create a `.env` file in the root directory with the following content:
    ```env
    DB_NAME=Business-counter-db
    DB_USER=postgres
    DB_PASS=1234
    DB_HOST=localhost
    JWT_SECRET=your_jwt_secret_here
    PORT=3000
    ```

4. **Database Configuration**
The project uses Sequelize as ORM. Database configuration is in `src/config/config.json`:
```json
{
  "development": {
    "username": "postgres",
    "password": "1234",
    "database": "Business-counter-db",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

5. **Initialize Database**
The application will automatically:
- Create necessary tables
- Set up initial roles (SUPER_ADMIN, ADMIN, USER)
- Create a default super admin account

Default Super Admin credentials:
- Email: superadmin@businesscounter.com
- Password: SuperAdmin@123

## Project Structure
```
BusinessCounter/
├── doc/                    # Documentation files
├── src/
│   ├── config/            # Database and other configurations
│   ├── controller/        # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── seeders/          # Database seeders
├── .env                   # Environment variables
├── package.json          # Project dependencies
└── server.js             # Application entry point
```

## Running the Application

1. **Development Mode**
```bash
npm start
```
This will start the server using nodemon for development.

2. **Production Mode**
```bash
node server.js
```

The server will start on http://localhost:3000 (or the PORT specified in .env)

## Testing API Endpoints
- Import the Postman collection from `BusinessCounter.postman_collection.json`
- Set up environment variables in Postman
- Use the collection to test various endpoints

## Troubleshooting

1. **Database Connection Issues**
- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists

2. **JWT Token Issues**
- Verify JWT_SECRET in .env
- Check token expiration
- Ensure proper token format in requests

3. **Server Start Issues**
- Check if port is already in use
- Verify all dependencies are installed
- Check for syntax errors in recent changes

## Additional Resources
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
