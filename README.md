# CloudOps Platform

A small service status platform, built step by step as a DevOps learning project.

## What it is

A web page that shows the status of the platform's services, backed by a JSON API.

## Current version (v0.1)

- `GET /health` - health check endpoint
- `GET /api/services` - list of services and their status (in-memory data)
- `/` - web page that displays the service list

## Run it locally

Requirements: Node.js (developed with v24)

1. Install dependencies:
   `npm install`
2. Start the server:
   `npm start`
3. Open:
   - Web page: http://localhost:3000/
   - Health check: http://localhost:3000/health
   - API: http://localhost:3000/api/services

## Tech stack

Node.js, Express

## Project structure

- `server.js` - the API server with the `/health` and `/api/services` routes
- `public/index.html` - the frontend page

## Status

Early development. The Git history tells the story so far.
