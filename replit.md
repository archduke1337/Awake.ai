# Overview

AWAKE is a conversational AI chat application that implements an intelligent routing system to direct queries to different AI models. The application features a React frontend with a clean, modern interface and an Express.js backend that handles AI routing logic. The system uses a PostgreSQL database with Drizzle ORM for data persistence, storing conversations and messages. The application is built with TypeScript and uses shadcn/ui components for the user interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built as a Single Page Application (SPA) using React with TypeScript. The application uses Vite as the build tool and development server, providing fast hot module replacement during development. The UI framework is based on shadcn/ui components, which are built on top of Radix UI primitives and styled with Tailwind CSS.

**Key Design Decisions:**
- **Component Library**: Uses shadcn/ui for consistent, accessible components
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming

**Directory Structure:**
- `client/src/components/` - Reusable UI components including chat interface and sidebar
- `client/src/pages/` - Route-level components (home, not-found)
- `client/src/hooks/` - Custom React hooks for mobile detection and toast notifications
- `client/src/lib/` - Utility functions and query client configuration

## Backend Architecture

The server is built with Express.js and follows a service-oriented architecture. The main application handles HTTP requests, with specialized services for AI routing and data storage.

**Key Components:**
- **Express Server**: Main application server handling REST API endpoints
- **AI Router Service**: Intelligently routes queries to appropriate AI models based on content analysis
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database persistence
- **Route Handlers**: RESTful endpoints for conversations and query processing

**API Endpoints:**
- `GET /api/conversations` - Retrieve all conversations
- `GET /api/conversations/:id` - Get specific conversation with messages
- `POST /api/conversations` - Create new conversation
- `POST /api/query` - Main endpoint for processing AI queries

## Data Storage

The application uses Drizzle ORM with PostgreSQL for production data persistence, while maintaining a fallback in-memory storage implementation for development scenarios.

**Database Schema:**
- **Conversations Table**: Stores conversation metadata with auto-generated UUIDs
- **Messages Table**: Stores individual messages linked to conversations with role, content, and AI model information

**Design Benefits:**
- Type-safe database operations through Drizzle ORM
- Automatic schema migrations with drizzle-kit
- Support for metadata storage to track AI routing decisions

## AI Integration

The AI router service implements intelligent query routing based on content analysis. Currently configured to use OpenRouter as the primary AI service provider.

**Routing Logic:**
- Analyzes incoming messages for code-related keywords
- Routes different query types to appropriate AI models
- Stores routing metadata for analytics and debugging
- Implements fallback responses for service failures

## Authentication & Authorization

Currently, the application does not implement user authentication, operating as a single-user system. Session management is handled through HTTP cookies for conversation persistence.

# External Dependencies

## Primary Services
- **Neon Database**: PostgreSQL database hosting for production data storage
- **OpenRouter**: AI model API service providing access to various language models including OpenAI's GPT-4

## Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database schema management and migrations
- **Replit**: Development environment integration with custom plugins

## Key Libraries
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Lightweight React router
- **Zod**: Runtime type validation for API schemas

## UI Components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities

The application is designed to be easily deployable on platforms like Replit, with configuration for both development and production environments through environment variables.