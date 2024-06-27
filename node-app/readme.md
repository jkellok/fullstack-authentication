## Description
This is a simple node-app example of the main project having the user management on own backend instead of inside other services.

## Installation

### Backend:
```
cd server
npm install
docker-compose up
```
Create .env file with the following 
```
SUPABASE_URL="https://bmfjjujhrtssdmcbnrio.supabase.co" 

SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZmpqdWpocnRzc2RtY2JucmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMjQ5NTIsImV4cCI6MjAzMDkwMDk1Mn0.rashuYNVgwqWxtIQmLYfQiaOHIeNfUSDR8C1pzQNn3U" 

SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZmpqdWpocnRzc2RtY2JucmlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTMyNDk1MiwiZXhwIjoyMDMwOTAwOTUyfQ.JomUWqQkzSwllPMWdXEItaazElV57zWAVRUovrbj_l8" 

PORT=3003 
```
Run the backend
```
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Usage
Users can sign up and login from the links. Upon logging in users can see example pages depending on their role, Layout page from the main project as a example of connecting to supabase database and finally a countries where users can see and add countries to the supabase database and admins can also delete them.