# AWAKE - AI Chat Assistant

A conversational AI chat application with intelligent routing between different AI models.

## Deployment to Vercel

### Prerequisites
1. A Vercel account
2. Gemini API key from Google AI Studio
3. Neon database (optional, uses in-memory storage by default)

### Environment Variables
Set these in your Vercel project settings:

```bash
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_database_url (optional)
NODE_ENV=production
```

### Deploy Steps

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

2. **Set Environment Variables**
   - In your Vercel dashboard, go to Settings > Environment Variables
   - Add `GEMINI_API_KEY` with your Google AI Studio API key
   - Add `DATABASE_URL` if using Neon database (optional)

3. **Deploy**
   - Push to your main branch
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app-name.vercel.app`

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual API keys

# Run development server
npm run dev
```

### Features
- Intelligent AI routing between Gemini Pro and Flash models
- Clean black and white design
- Real-time chat interface
- Conversation history
- Responsive design

### Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini API
- **Database**: Neon PostgreSQL (optional)
- **Deployment**: Vercel