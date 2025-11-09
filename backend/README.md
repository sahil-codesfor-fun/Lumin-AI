# Byte-wise Backend (Scaffold)

This is a scaffold Node.js + Express backend to replace Supabase usage in the frontend.

## Quick start

1. Copy `.env.sample` to `.env` and fill values.
2. Run the SQL in `database.sql` to create tables.
3. Install dependencies:
   ```
   npm install
   ```
4. Start server:
   ```
   npm start
   ```
5. Health check: GET http://localhost:5000/health

## Notes
- JWT auth is used. Frontend should store token (localStorage) and include `Authorization: Bearer <token>` header.
- AI endpoints use OpenAI; set OPENAI_KEY in `.env`.
