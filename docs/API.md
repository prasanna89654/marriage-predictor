# API Documentation

This document describes the REST API endpoints for the Marriage Age Predictor application.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `http://your-ec2-ip:5000`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Health Check

Check if the API is running and healthy.

**GET** `/health`

#### Response

\`\`\`json
{
  "status": "OK",
  "message": "Marriage Predictor API is running"
}
\`\`\`

---

### Get All Predictions

Retrieve a list of all predictions made by users.

**GET** `/api/predictions`

#### Response

\`\`\`json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "date_of_birth": "1995-06-15",
      "place_of_birth": "New York",
      "current_job": "Software Engineer",
      "predicted_age": 28,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
\`\`\`

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | User's full name |
| `date_of_birth` | string | Birth date in YYYY-MM-DD format |
| `place_of_birth` | string | User's place of birth |
| `current_job` | string | User's current occupation |
| `predicted_age` | integer | Predicted marriage age |
| `created_at` | string | Timestamp when prediction was made |

---

### Create Prediction

Create a new marriage age prediction for a user.

**POST** `/api/predict`

#### Request Body

\`\`\`json
{
  "name": "Jane Smith",
  "date_of_birth": "1992-03-22",
  "place_of_birth": "Los Angeles",
  "current_job": "Designer",
  "body_count": 2,
  "is_perfume_used": true,
  "has_iphone": true,
  "has_bike": false
}
\`\`\`

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name |
| `date_of_birth` | string | Yes | Birth date (YYYY-MM-DD) |
| `place_of_birth` | string | Yes | Place of birth |
| `current_job` | string | Yes | Current occupation |
| `body_count` | integer | Yes | Number of past relationships |
| `is_perfume_used` | boolean | Yes | Whether user uses perfume |
| `has_iphone` | boolean | Yes | Whether user owns an iPhone |
| `has_bike` | boolean | Yes | Whether user owns a bike |

#### Job Options

- Software Engineer
- Doctor
- Teacher
- Artist
- Entrepreneur
- Student
- Unemployed
- Other

#### Response

\`\`\`json
{
  "success": true,
  "data": {
    "predicted_age": 26,
    "user_data": {
      "id": 1,
      "user_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Jane Smith",
      "date_of_birth": "1992-03-22",
      "place_of_birth": "Los Angeles",
      "current_job": "Designer",
      "body_count": 2,
      "is_perfume_used": true,
      "has_iphone": true,
      "has_bike": false,
      "predicted_age": 26,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
\`\`\`

## Error Responses

### 400 Bad Request

\`\`\`json
{
  "success": false,
  "message": "All fields are required"
}
\`\`\`

### 500 Internal Server Error

\`\`\`json
{
  "success": false,
  "message": "Failed to create prediction"
}
\`\`\`

## Prediction Algorithm

The marriage age prediction is based on several factors:

### Base Calculation
- Current age + random factor (2-9 years)

### Job Influence
- Software Engineer: -2 years
- Doctor: -1 year
- Teacher: 0 years
- Artist: +1 year
- Entrepreneur: -1 year
- Student: +3 years
- Unemployed: +4 years

### Lifestyle Factors
- **Body Count**:
  - 0 relationships: -1 year
  - 3-5 relationships: +1 year
  - 6+ relationships: +3 years
- **Uses Perfume**: -1 year (takes care of appearance)
- **Has iPhone**: -1 year (financially stable)
- **Has Bike**: +1 year (young at heart)

### Age Constraints
- Minimum: 18 years
- Maximum: 45 years

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and accepts requests from any origin in development. In production, configure CORS to only allow requests from your frontend domain.

## Examples

### cURL Examples

**Health Check:**
\`\`\`bash
curl http://localhost:5000/health
\`\`\`

**Get Predictions:**
\`\`\`bash
curl http://localhost:5000/api/predictions
\`\`\`

**Create Prediction:**
\`\`\`bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date_of_birth": "1990-01-01",
    "place_of_birth": "Test City",
    "current_job": "Software Engineer",
    "body_count": 1,
    "is_perfume_used": true,
    "has_iphone": true,
    "has_bike": false
  }'
\`\`\`

### JavaScript Examples

**Fetch Predictions:**
\`\`\`javascript
const response = await fetch('/api/predictions');
const data = await response.json();
console.log(data.data);
\`\`\`

**Create Prediction:**
\`\`\`javascript
const response = await fetch('/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test User',
    date_of_birth: '1990-01-01',
    place_of_birth: 'Test City',
    current_job: 'Software Engineer',
    body_count: 1,
    is_perfume_used: true,
    has_iphone: true,
    has_bike: false
  })
});

const result = await response.json();
console.log(result.data.predicted_age);
\`\`\`

---

**Need help? Check the troubleshooting guide or create an issue on GitHub.**
