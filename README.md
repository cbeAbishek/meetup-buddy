# 🤝 Meetup BuddyThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



**A Centralized Meeting Platform with Multi-Platform Integrations**

## 🏆 Hackathon Project

This project was developed during a 24-hour hackathon **"Code O'Clock"** conducted by the AIDS Department at CIT College, Coimbatore. Our dedicated team of 4 members came together to create this innovative meeting management platform within the tight deadline, showcasing our collaborative skills and technical expertise.

## Getting Started



Meetup Buddy is a modern, centralized meeting management platform built with Next.js and powered by Inngest for reliable event processing. It provides seamless integration with multiple meeting platforms to streamline your virtual meeting experience.First, run the development server:



## ✨ Features```bash

npm install

- 🎯 **Centralized Meeting Management** - Manage all your meetings from one dashboard

- 🔗 **Multi-Platform Integration** - Connect with various meeting platformsnpm run dev

- ⚡ **Real-time Updates** - Powered by Inngest for reliable event processing

- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSSfor inngest 

- 🔐 **Secure Authentication** - Integrated with Supabase Authnpx inngest-cli@latest dev

- 📱 **Responsive Design** - Works seamlessly across all devices```

- 🌙 **Dark Mode Support** - Toggle between light and dark themes

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Tech Stack

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Frontend**: Next.js 15, React 19, TypeScript

- **Backend**: Supabase (Database & Auth)This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Event Processing**: Inngest

- **Styling**: Tailwind CSS, shadcn/ui## Learn More

- **Charts**: Recharts

- **Icons**: Lucide React, Tabler IconsTo learn more about Next.js, take a look at the following resources:



## 📋 Prerequisites- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Before you begin, ensure you have the following installed:

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- Node.js 18+ 

- npm or yarn## Deploy on Vercel

- Git

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 🛠️ Installation & Setup

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 1. Clone the Repository

```bash
git clone https://github.com/cbeAbishek/meetup-buddy.git
cd meetup-buddy
```

### 2. Install Dependencies

```bash
npm install --force
```

> **Note**: We use `--force` flag to resolve any peer dependency conflicts that might occur with the latest packages.

### 3. Environment Setup

Copy the example environment file and configure your environment variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://djupwolgdhxnrlsachnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXB3b2xnZGh4bnJsc2FjaG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODg2NTgsImV4cCI6MjA3NDM2NDY1OH0.iV5ZJgH__IUYXR9ZCFOZhXagin0vbs3DaQaktD4jnAA
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://djupwolgdhxnrlsachnq.storage.supabase.co/storage/v1/s3

# Inngest Configuration (add your Inngest keys)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Start Inngest Development Server

In a separate terminal, start the Inngest development server:

```bash
npx inngest-cli@latest dev
```

The application will be available at `http://localhost:3000`

## 🏃‍♂️ Quick Start

1. **Install dependencies**: `npm install --force`
2. **Setup environment**: Copy `env.example` to `.env.local` and update the values
3. **Start development**: `npm run dev`
4. **Start Inngest**: `npx inngest-cli@latest dev` (in separate terminal)
5. **Open browser**: Navigate to `http://localhost:3000`

## 📁 Project Structure

```
meetup-buddy/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── inngest/      # Inngest webhook endpoint
│   │   └── profile/      # Profile management
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   └── profile/         # Profile components
├── hooks/               # Custom React hooks
├── inngest/            # Inngest functions and client
├── lib/                # Utility libraries
│   ├── auth.ts         # Authentication utilities
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # General utilities
└── public/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Features in Detail

### Inngest Integration
The platform uses Inngest for reliable event processing, enabling:
- Asynchronous meeting notifications
- Reliable webhook processing
- Event-driven architecture
- Background job processing

### Multi-Platform Meeting Integration
Currently supports integration with:
- Zoom (coming soon)
- Google Meet (coming soon)
- Microsoft Teams (coming soon)
- Custom meeting platforms via API

### Supabase Backend
Leveraging Supabase for:
- User authentication and management
- Real-time database operations
- File storage for meeting assets
- Row-level security

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- 🐛 [Report a bug](https://github.com/cbeAbishek/meetup-buddy/issues)
- 💬 [Start a discussion](https://github.com/cbeAbishek/meetup-buddy/discussions)
- 📧 Email: support@meetup-buddy.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for the web
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Inngest](https://www.inngest.com/) - Event-driven queue platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Built with ❤️ by the illuminaty**