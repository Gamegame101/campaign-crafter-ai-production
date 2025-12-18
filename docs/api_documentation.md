# API Documentation - Campaign Crafter AI

## Overview

The Campaign Crafter AI provides comprehensive APIs for AI-powered marketing campaign generation, data management, and content creation. Built with Node.js Express and FastAPI, it offers production-ready endpoints for Thai marketing campaigns.

## Base URLs

**Functions Server (Main API):**
```
http://54.169.249.150:8002
```

**FastAPI Server:**
```
http://54.169.249.150:8000
```

**Frontend Application:**
```
http://54.169.249.150:3000
```

## Authentication

Currently, no authentication is required for demo purposes. In production, implement API key authentication.

## Database Endpoints

### Organizations

**GET** `/api/organizations`

Retrieve all organizations.

#### Response
```json
[
  {
    "id": "org1",
    "name": "TechFlow Solutions",
    "industry": "Technology",
    "description": "Leading technology solutions provider",
    "created_at": "2025-12-15T17:44:31.943Z"
  }
]
```

### Products

**GET** `/api/products`

Retrieve all products.

#### Response
```json
[
  {
    "id": "prod1",
    "organization_id": "org1",
    "name": "Smart Analytics Dashboard",
    "description": "AI-powered business analytics",
    "price": "15000.00",
    "category": "Software",
    "target_audience": "SME Business Owners",
    "features": ["Real-time data", "AI insights", "Custom reports"],
    "created_at": "2025-12-15T17:44:32.019Z"
  }
]
```

### Services

**GET** `/api/services`

Retrieve all services.

#### Response
```json
[
  {
    "id": "serv1",
    "organization_id": "org1",
    "name": "IT Consulting",
    "description": "Professional IT consultation services",
    "price": "5000.00",
    "duration": "1 month",
    "target_audience": "SME Business Owners",
    "features": ["Expert advice", "Custom solutions", "Ongoing support"],
    "created_at": "2025-12-15T17:44:32.019Z"
  }
]
```

### Campaigns

**GET** `/api/campaigns`

Retrieve all campaigns.

**GET** `/api/campaigns/:id`

Retrieve specific campaign by ID.

**POST** `/api/campaigns`

Create new campaign.

**PATCH** `/api/campaigns/:id`

Update existing campaign.

**DELETE** `/api/campaigns/:id`

Delete campaign.

#### Campaign Schema
```json
{
  "id": "uuid",
  "name": "string",
  "objective": "string",
  "target_audience": "string",
  "platforms": ["string"],
  "budget": "number",
  "start_date": "date",
  "end_date": "date",
  "content_strategy": "organic|paid|mixed",
  "posting_frequency": "daily|3-per-week|weekly",
  "campaign_data": "jsonb",
  "status": "draft|active|completed",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## AI Generation Endpoints

### Generate Campaign

**POST** `/api/v1/generate-campaign`

Generate marketing campaign content using AI.

#### Request Body

```json
{
  "name": "string",
  "objective": "string", 
  "target_audience": "string",
  "platforms": ["facebook", "instagram", "tiktok", "youtube", "line_oa", "x"],
  "budget": 50000,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "content_strategy": "organic|paid|mixed",
  "posting_frequency": "daily|3-per-week|weekly",
  "mode": "preview|full",
  "focus_type": "organization|product|service",
  "focus_data": {
    "name": "string",
    "description": "string"
  }
}
```

#### Response (Preview Mode)

```json
{
  "success": true,
  "data": {
    "campaign_summary": "สรุปแคมเปญ 2-3 ประโยค",
    "big_idea": "แนวคิดหลักของแคมเปญ",
    "key_messages": [
      "ข้อความหลัก 1",
      "ข้อความหลัก 2", 
      "ข้อความหลัก 3"
    ],
    "visual_direction": "แนวทางการออกแบบและภาพลักษณ์"
  }
}
```

#### Response (Full Mode)

```json
{
  "success": true,
  "data": {
    "campaign_summary": "สรุปแคมเปญ",
    "big_idea": "แนวคิดหลัก",
    "key_messages": ["ข้อความหลัก"],
    "visual_direction": "แนวทางการออกแบบ",
    "platform_content": {
      "facebook": [
        {
          "day": 1,
          "content": "เนื้อหาโพสต์",
          "hashtags": ["#tag1", "#tag2"],
          "image_description": "คำอธิบายภาพ"
        }
      ],
      "instagram": [...],
      "tiktok": [...],
      "youtube": [...],
      "line_oa": [...],
      "x": [...]
    },
    "estimated_reach": 50000,
    "estimated_engagement": 2.5,
    "estimated_conversions": 500
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Health & Monitoring

### Health Check

**GET** `/api/v1/health`

Check API server health status.

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### API Documentation

**GET** `/docs` (FastAPI Server)

Interactive Swagger UI documentation.

**GET** `/redoc` (FastAPI Server)

Interactive Swagger UI documentation.

**GET** `/redoc`

Alternative ReDoc documentation.

## Request Examples

### cURL Example

```bash
curl -X POST "http://54.169.249.150:8002/api/v1/generate-campaign" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "แคมเปญเปิดตัวสินค้าใหม่",
    "objective": "เพิ่มการรับรู้แบรนด์",
    "target_audience": "วัยทำงาน 25-40 ปี",
    "platforms": ["facebook", "instagram"],
    "budget": 50000,
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "content_strategy": "mixed",
    "posting_frequency": "daily",
    "mode": "preview"
  }'
```

### Python Example

```python
import requests

url = "http://54.169.249.150:8002/api/v1/generate-campaign"
data = {
    "name": "แคมเปญเปิดตัวสินค้าใหม่",
    "objective": "เพิ่มการรับรู้แบรนด์",
    "target_audience": "วัยทำงาน 25-40 ปี",
    "platforms": ["facebook", "instagram"],
    "budget": 50000,
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "content_strategy": "mixed",
    "posting_frequency": "daily",
    "mode": "preview"
}

response = requests.post(url, json=data)
result = response.json()
print(result)
```

### JavaScript Example

```javascript
const response = await fetch('http://54.169.249.150:8002/api/v1/generate-campaign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'แคมเปญเปิดตัวสินค้าใหม่',
    objective: 'เพิ่มการรับรู้แบรนด์',
    target_audience: 'วัยทำงาน 25-40 ปี',
    platforms: ['facebook', 'instagram'],
    budget: 50000,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    content_strategy: 'mixed',
    posting_frequency: 'daily',
    mode: 'preview'
  })
});

const result = await response.json();
console.log(result);
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input parameters |
| 422 | Validation Error - Request body validation failed |
| 500 | Internal Server Error - AI generation failed |

## Rate Limits

Currently no rate limits implemented. In production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Performance Metrics

### Current Performance
- **AI Generation**: 6-18 seconds (depending on mode)
- **Database Queries**: < 100ms
- **Static Assets**: < 50ms
- **Concurrent Users**: 100+ tested
- **Instance Type**: t4g.micro (ARM64)
- **Memory Usage**: ~512MB
- **CPU Credits**: Standard mode (cost-optimized)

### Response Times
- **Preview Mode**: 6-7 seconds
- **Full Campaign**: 17-18 seconds
- **Database APIs**: 50-100ms
- **Frontend Load**: 1-2 seconds

## Current Deployment

### Production URLs

- **Frontend**: http://54.169.249.150:3000
- **Functions API**: http://54.169.249.150:8002
- **FastAPI**: http://54.169.249.150:8000
- **Database**: PostgreSQL on port 5432

### Docker Services

```bash
# Check running services
docker ps

# View logs
docker logs campaign-crafter-ai-app-1
docker logs campaign-crafter-ai-functions-1
docker logs campaign-crafter-ai-db-1

# Restart services
docker compose restart
```

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Functions      │    │   Database      │
│   (React)       │───▶│   Server        │───▶│  (PostgreSQL)   │
│   Port 3000     │    │   Port 8002     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    OpenAI       │
                       │      API        │
                       └─────────────────┘
```

## Environment Variables

| Variable | Required | Description | Current Value |
|----------|----------|-------------|---------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI generation | Configured |
| `POSTGRES_HOST` | Yes | Database host | `db` (Docker) |
| `POSTGRES_PORT` | Yes | Database port | `5432` |
| `POSTGRES_DB` | Yes | Database name | `postgres` |
| `POSTGRES_USER` | Yes | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Yes | Database password | `postgres` |

## Monitoring

### Health Check Endpoint

Use `/api/v1/health` for monitoring and load balancer health checks.

### Logging

All requests are logged with:
- Request timestamp
- Response time
- Status code
- Error details (if any)

## Security Considerations

1. **API Key Management**: OpenAI API key stored in environment variables
2. **Input Validation**: Server-side validation for all inputs
3. **CORS**: Enabled for frontend integration
4. **Network Security**: AWS Security Groups configured
5. **Database**: PostgreSQL with connection pooling
6. **HTTPS**: Currently HTTP (demo), implement SSL for production

### Security Groups (AWS)
- **Port 22**: SSH access
- **Port 80**: HTTP
- **Port 3000**: Frontend
- **Port 8000**: FastAPI
- **Port 8002**: Functions Server
- **Port 5432**: Database (internal only)

## Testing & Validation

### Functional Tests
✅ **Database Layer**: 5 organizations, 8 products, 8 services  
✅ **API Layer**: All endpoints responding  
✅ **AI Generation**: Preview & full modes working  
✅ **Frontend**: React SPA loading properly  
✅ **Docker Services**: All containers healthy  

### Test URLs
- **Organizations**: http://54.169.249.150:8002/api/organizations
- **Products**: http://54.169.249.150:8002/api/products
- **Services**: http://54.169.249.150:8002/api/services
- **Campaigns**: http://54.169.249.150:8002/api/campaigns
- **AI Generation**: http://54.169.249.150:8002/api/v1/generate-campaign

## Support

### Troubleshooting
1. **Frontend Issues**: Check browser console for JavaScript errors
2. **API Issues**: Verify endpoints with curl or Postman
3. **Database Issues**: Check PostgreSQL connection and tables
4. **AI Issues**: Verify OpenAI API key and quota

### Monitoring
```bash
# Check service status
docker ps

# View real-time logs
docker logs -f campaign-crafter-ai-functions-1

# Database health
docker exec campaign-crafter-ai-db-1 pg_isready -U postgres
```

### Common Issues
- **Blank Pages**: Usually API connectivity issues
- **Slow AI Generation**: Normal for complex campaigns
- **Database Errors**: Check PostgreSQL container status
- **CORS Errors**: Verify API URLs in frontend code