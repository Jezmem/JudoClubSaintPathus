# Judo Club Saint Pathus - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

### Register
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "06 12 34 56 78",
  "address": "123 Rue de la Paix",
  "dateOfBirth": "1990-01-01"
}
```

### Login
```http
POST /api/login_check
Content-Type: application/json

{
  "username": "admin@judoclubsaintpathus.fr",
  "password": "admin123"
}
```

### Get Profile
```http
GET /api/profile
Authorization: Bearer {token}
```

### Update Profile
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "06 12 34 56 78"
}
```

## News Endpoints

### Get All News
```http
GET /api/news?page=1&limit=10&category=Actualités&upcoming=false
```

### Get Single News
```http
GET /api/news/{id}
```

### Create News (Admin only)
```http
POST /api/news
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Nouvelle actualité",
  "content": "Contenu de l'actualité...",
  "excerpt": "Extrait de l'actualité",
  "category": "Actualités",
  "important": true,
  "author": "Admin",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "eventDate": "2024-12-01 10:00:00"
}
```

### Update News (Admin only)
```http
PUT /api/news/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Titre modifié",
  "content": "Contenu modifié..."
}
```

### Delete News (Admin only)
```http
DELETE /api/news/{id}
Authorization: Bearer {admin_token}
```

## Gallery Endpoints

### Get All Gallery Items
```http
GET /api/gallery?page=1&limit=20&category=Entraînements&type=photo
```

### Get Single Gallery Item
```http
GET /api/gallery/{id}
```

### Create Gallery Item (Admin only)
```http
POST /api/gallery
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Nouvelle photo",
  "type": "photo",
  "url": "https://example.com/photo.jpg",
  "description": "Description de la photo",
  "category": "Entraînements",
  "alt": "Texte alternatif",
  "active": true
}
```

### Update Gallery Item (Admin only)
```http
PUT /api/gallery/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Titre modifié",
  "active": false
}
```

### Delete Gallery Item (Admin only)
```http
DELETE /api/gallery/{id}
Authorization: Bearer {admin_token}
```

## Schedule Endpoints

### Get All Schedules
```http
GET /api/schedules?dayOfWeek=monday&level=kids
```

### Get Single Schedule
```http
GET /api/schedules/{id}
```

### Create Schedule (Admin only)
```http
POST /api/schedules
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "dayOfWeek": "monday",
  "startTime": "17:30",
  "endTime": "18:30",
  "level": "kids",
  "description": "Baby Judo (4-6 ans)",
  "price": "25.00",
  "instructorId": 1
}
```

### Update Schedule (Admin only)
```http
PUT /api/schedules/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": "30.00",
  "description": "Description modifiée"
}
```

### Delete Schedule (Admin only)
```http
DELETE /api/schedules/{id}
Authorization: Bearer {admin_token}
```

## Instructor Endpoints

### Get All Instructors
```http
GET /api/instructors
```

### Get Single Instructor
```http
GET /api/instructors/{id}
```

### Create Instructor (Admin only)
```http
POST /api/instructors
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Jean Moreau",
  "bio": "Ancien compétiteur international...",
  "beltRank": "5e Dan",
  "photoUrl": "https://example.com/photo.jpg"
}
```

### Update Instructor (Admin only)
```http
PUT /api/instructors/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "bio": "Biographie modifiée..."
}
```

### Delete Instructor (Admin only)
```http
DELETE /api/instructors/{id}
Authorization: Bearer {admin_token}
```

## Registration Endpoints

### Get Registrations
```http
GET /api/registrations?page=1&limit=20&status=pending
Authorization: Bearer {token}
```
*Note: Users see only their registrations, admins see all*

### Get Single Registration
```http
GET /api/registrations/{id}
Authorization: Bearer {token}
```

### Create Registration
```http
POST /api/registrations
Authorization: Bearer {token}
Content-Type: application/json

{
  "scheduleId": 1,
  "experience": "debutant",
  "newsletter": true,
  "medicalCertificateFile": "path/to/certificate.pdf"
}
```

### Update Registration
```http
PUT /api/registrations/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "validated",
  "notes": "Inscription validée"
}
```
*Note: Only admins can update status and notes*

### Delete Registration (Admin only)
```http
DELETE /api/registrations/{id}
Authorization: Bearer {admin_token}
```

## Contact Message Endpoints

### Get All Contact Messages (Admin only)
```http
GET /api/contact-messages?page=1&limit=20&status=unread
Authorization: Bearer {admin_token}
```

### Get Single Contact Message (Admin only)
```http
GET /api/contact-messages/{id}
Authorization: Bearer {admin_token}
```
*Note: Automatically marks message as read*

### Create Contact Message (Public)
```http
POST /api/contact-messages
Content-Type: application/json

{
  "name": "Marie Dubois",
  "email": "marie@example.com",
  "phone": "06 12 34 56 78",
  "subject": "inscription",
  "message": "Bonjour, je souhaiterais des informations..."
}
```

### Update Message Status (Admin only)
```http
PATCH /api/contact-messages/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "replied"
}
```

### Delete Contact Message (Admin only)
```http
DELETE /api/contact-messages/{id}
Authorization: Bearer {admin_token}
```

## Event Endpoints

### Get All Events
```http
GET /api/events?upcoming=true&type=competition
```

### Get Single Event
```http
GET /api/events/{id}
```

### Create Event (Admin only)
```http
POST /api/events
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Championnat régional",
  "description": "Championnat régional toutes catégories",
  "date": "2024-11-03 08:00:00",
  "location": "Gymnase Pierre de Coubertin, Meaux",
  "type": "competition",
  "imageUrl": "https://example.com/event.jpg"
}
```

### Update Event (Admin only)
```http
PUT /api/events/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Titre modifié",
  "date": "2024-11-04 09:00:00"
}
```

### Delete Event (Admin only)
```http
DELETE /api/events/{id}
Authorization: Bearer {admin_token}
```

## Response Formats

### Success Response
```json
{
  "id": 1,
  "title": "Example",
  "createdAt": "2024-01-15 10:30:00"
}
```

### Paginated Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Error Response
```json
{
  "errors": ["Error message 1", "Error message 2"]
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Demo Credentials

### Admin
- Email: `admin@judoclubsaintpathus.fr`
- Password: `admin123`

### User
- Email: `user@example.com`
- Password: `user123`