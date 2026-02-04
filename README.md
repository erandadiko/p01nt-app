# P01NT - Albanian Sports Federation Platform

![P01NT Logo](https://img.shields.io/badge/P01NT-Sports-d53240?style=for-the-badge)

A centralized hub for Albanian sports federations. Stay updated with the latest news, match schedules, athlete information, and statistics across Football, Basketball, Volleyball, and Taekwondo.

## 🏆 Features

- **Multi-Federation Support**: FSHF (Football), FSHB (Basketball), FSHV (Volleyball), ATF (Taekwondo)
- **Role-Based Access**: Trainers, Players, and Sport Lovers with different permissions
- **Real-Time Updates**: Live match scores and news feeds
- **Responsive Design**: Mobile-first approach with modern UI
- **Data Scraping**: Automated data collection from federation websites

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based with role selection
- **Styling**: Custom color scheme (#d53240, #0b3156, #747c98)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd p01nt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb p01nt

   # Run Prisma migrations
   npx prisma migrate dev --name init

   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
p01nt/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── federation/    # Federation pages
│   │   ├── login/         # Auth pages
│   │   └── register/
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── data/              # Static data files
│   ├── lib/               # Utility functions
│   └── scrapers/          # Web scrapers
├── public/                # Static assets
└── package.json
```

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#d53240` | Buttons, highlights, accents |
| Dark Blue | `#0b3156` | Headers, navigation, text |
| Grayish Blue | `#747c98` | Secondary text, borders |
| White | `#ffffff` | Backgrounds |
| Light Gray | `#f5f7fa` | Page backgrounds |

## 👥 User Roles

1. **Trainer** - Manage teams and players
2. **Player** - View personal stats and profile
3. **Sport Lover** - Browse news, matches, and athletes

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/teams` | GET/POST | Team management |
| `/api/players` | GET/POST | Player management |
| `/api/matches` | GET/POST | Match management |
| `/api/news` | GET/POST | News management |
| `/api/scrape` | POST | Trigger data scraping |

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Push Prisma schema
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run scrape       # Run scrapers
```

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm run start
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Albanian sports
