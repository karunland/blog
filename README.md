# Full-Stack Blog Application

A modern blog application built with .NET 9 backend and React frontend, featuring a rich user interface and interactive features.

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
    │   ├── store/         # Redux store configuration
    │   └── lib/           # Utility functions and API clients
```

## Backend (.NET 9)

### Prerequisites
- .NET 9 SDK
- PostgreSQL
- Email service gmail for now

### Setup and Running

1. Navigate to backend directory:
```bash
cd backend
```

2. Run the application:
```bash
dotnet run --project BlogApi.API
```

The API will be available at `https://localhost:5001` by default.


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

### Blog Management
- Create, read, update, and delete blog posts
- Rich text editor with image upload support
- Blog categories and tags
- SEO-friendly URLs with slugs

### User Features
- User authentication with JWT
- Email verification
- Google OAuth integration
- User profile management
- Profile picture upload and cropping

### Comments & Interaction
- Comment system on blog posts
- Emoji support in comments
- Real-time comment updates
- Comment moderation for authors

### UI/UX Features
- Responsive Material-UI design
- Dark/Light theme support
- Toast notifications
- Loading states and animations
- Mobile-friendly interface

### Security
- JWT authentication
- Protected API endpoints
- Secure password handling
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
