# 📍 Location Management Application

A full-stack web application that allows authenticated users to manage and visualize location data on an interactive map.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🌟 Features

- ✅ **User Authentication** - Secure JWT-based registration and login
- ✅ **Interactive Map** - Real-time location visualization using React Leaflet
- ✅ **Manual Entry** - Add locations with name and coordinates
- ✅ **Bulk Upload** - Upload multiple locations via ZIP file
- ✅ **User Isolation** - Each user sees only their own locations
- ✅ **Protected Routes** - Automatic redirect for unauthenticated users
- ✅ **Instant Updates** - No page refresh required when adding locations
- ✅ **Duplicate Prevention** - Validates against existing locations

## 📸 Screenshots

### Login Page
![Screenshot of the user interface](images\loginpage.png)

### Map View
![Screenshot of the map interface](images\mapview.png)

### Upload Interface
![Screenshot of the upload interface](images\fileupload.png)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Leaflet** - Interactive maps
- **Axios** - API requests
- **Zustand** - State management
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **JSZip** - ZIP file processing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/location-app.git
cd location-app
```

### 2. Database Setup
```bash
# Start PostgreSQL and open psql
psql -U postgres

# Create database
CREATE DATABASE location_app;

# Connect to database
\c location_app

# Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_user_id ON locations(user_id);

# Exit psql
\q
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add to `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/location_app
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
PORT=5000
NODE_ENV=development
```
```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 🎮 Usage

### Registration
1. Navigate to `/register`
2. Fill in username, email, and password
3. Click "Register"
4. You'll be redirected to login page

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the map page

### Adding Locations Manually
1. Go to Map page
2. Fill in the form:
   - **Name:** Location name
   - **Latitude:** -90 to 90
   - **Longitude:** -180 to 180
3. Click "Add Location"
4. Location appears instantly on the map!

### Uploading Locations (ZIP)
1. Go to Upload page
2. Prepare a `.txt` file with this format:
Name, Latitude, Longitude
Suria KLCC,3.157324409,101.7121981
Zoo Negara,3.21054160,101.75920504
KLCC Park,3.1534,101.7126
3. Compress the `.txt` file into a `.zip`
4. Upload the ZIP file
5. Success popup appears for 3 seconds
6. Automatically redirects to map with new locations

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)

### Locations (Protected)
- `GET /api/locations` - Get all user's locations
- `POST /api/locations` - Add new location
- `POST /api/locations/upload` - Upload ZIP file with locations

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐳 Docker Support (Optional)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@imransadiq-hub](https://github.com/imransadiq-hub)
- Email: imransadiq75@gmail.com

## 🙏 Acknowledgments

- [React Leaflet](https://react-leaflet.js.org/) for the mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- Hexon Data for the assessment opportunity

## 📞 Support

For support, email imransadiq75@gmail.com or open an issue on GitHub.

---

**Made with ❤️ for Hexon Data Technical Assessment**