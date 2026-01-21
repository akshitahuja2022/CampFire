# CampFire

CampFire is a backend service for a community-driven discussion platform built around time-bound groups called camps.

The system is designed to support focused conversations by limiting the lifespan of communities and controlling posting behavior. It provides APIs for camp management, posts, and real-time messaging, with an emphasis on clean domain modeling and scalability.

This repository currently contains the backend implementation.


## Overview

CampFire allows users to create or join camps, publish posts within those camps, and participate in real-time discussions. Camps are intentionally temporary, enabling automatic cleanup and reducing long-term noise.

The backend enforces lifecycle rules, permissions, and rate limits to maintain structured and meaningful interactions.


## Features

- Camp creation, joining, and lifecycle management
- Post creation, editing, deletion, and retrieval
- Real-time messaging using WebSockets
- Authentication and user validation for HTTP and socket connections
- Soft deletes and safe data cleanup strategies
- Cursor-based pagination for scalable reads
- Centralized error handling


## Technology

- Node.js
- Express
- MongoDB
- Socket.IO


## Status

This project is under active development. APIs and internal behavior may change as features evolve.
