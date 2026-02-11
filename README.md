# CampFire

CampFire is a community-driven, full-stack discussion platform built around time-bound groups called **camps**.

The system is designed to support focused conversations by limiting the lifespan of communities and controlling posting behavior. CampFire follows a **MERN stack architecture**, with a React-based frontend and a scalable Node.js backend.

Camps are intentionally temporary, enabling automatic cleanup, reduced long-term noise, and more meaningful interactions.


🌐 Live Demo: https://campfire-1.onrender.com

## Overview

CampFire allows users to create or join camps, publish posts within those camps, and participate in real-time discussions. Each camp has a defined lifecycle, after which it expires automatically.

The backend enforces lifecycle rules, permissions, and rate limits, while the frontend provides an interactive and responsive user experience for browsing camps, posting content, and engaging in discussions.

## Features

* Camp creation, joining, and lifecycle management
* Post creation, editing, deletion, and retrieval
* Real-time messaging using WebSockets
* Authentication and user validation for HTTP and socket connections
* Soft deletes and safe data cleanup strategies
* Cursor-based pagination for scalable reads
* Centralized error handling
* Interactive UI built with React

## Technology Stack (MERN)

### Frontend

* React
* JavaScript
* REST & WebSocket integration

### Backend

* Node.js
* Express
* MongoDB
* Socket.IO

## Status

This project is under active development. Features, APIs, and internal behavior may change as the system evolves.
