# Full-Stack Blog Application

A modern blog application built with .NET 9 backend and React frontend.

## Project Structure

```
├── backend/                 # .NET 9 Backend
│   ├── BlogApi.API         # API Controllers and endpoints
│   ├── BlogApi.Core        # Core entities and interfaces
│   ├── BlogApi.Application # Application logic and DTOs
│   └── BlogApi.Infrastructure # Data access and external services
└── web/                    # React Frontend
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── pages/         # Page components
    │   ├── styles/        # CSS styles
    │   └── lib/           # Utility functions and API clients
```

## Backend (.NET 9)

### Prerequisites
- .NET 9 SDK
- SQL Server (currently inmemory database active)

### Setup and Running

1. Navigate to backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run --project BlogApi.API
```

The API will be available at `https://localhost:5001` by default.

### API Endpoints

- `GET /api/blog` - Get all blogs (paginated)
- `GET /api/blog/detail` - Get blog details by slug
- `POST /api/blog` - Create new blog
- `POST /api/blog/update` - Update existing blog
- `DELETE /api/blog` - Delete blog by slug

## Frontend (React)

### Prerequisites
- Node.js 18+
- npm

### Setup and Running

1. Navigate to frontend directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Features

- Blog post creation and management
- User authentication and authorization
- Responsive design
- Rich text editing
- Category management
- Search and filtering

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- Backend workflow: Builds, tests, and publishes the .NET application
- Frontend workflow: Builds and tests the React application

Workflows are triggered on pushes and pull requests to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 