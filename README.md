<<<<<<< HEAD
# P01NT - Albanian Sports Federation Platform

![P01NT Logo](https://img.shields.io/badge/P01NT-Sports-d53240?style=for-the-badge)

A centralized hub for Albanian sports federations. Stay updated with the latest news, match schedules, athlete information, and statistics across Football, Basketball, Volleyball, and Taekwondo.

## 🏆 Features

- **Multi-Federation Support**: FSHF (Football), FSHB (Basketball), FSHV (Volleyball), ATF (Taekwondo)
- **Trainer-Only Login**: Secure login for seeded federation coaches
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

   # Seed 27 real Albanian federation coaches
   npm run db:seed
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

## 👥 Access Model

- **Trainer only** login is enabled via `/api/login`
- **Registration disabled** (`/register` returns 404)
- Successful login redirects to `/dashboard/team/:teamId`

## 👨‍🏫 Seeded Coach Credentials (27)

| Federation | Coach | Email | Password | Team | Gender |
|----------|-------|-------|----------|------|--------|
| FSHF Football | Sylvio Mendes Campos Junior | sylvio@fshf.al | Kombetarja2024 | Kombëtarja | male |
| FSHF Football | Alban Bushi | alban@fshf.al | U212024Bushi | U21 | male |
| FSHF Football | Edi Martini | edi@fshf.al | Vllaznia2024 | KF Vllaznia | male |
| FSHF Football | Edlir Tetova | edlir@fshf.al | Egnatia2024 | KF Egnatia | male |
| FSHF Football | Ivan Gvozdenović | ivan@fshf.al | Elbasani2024 | AF Elbasani | male |
| FSHF Football | Oltijon Kernaja | oltijon@fshf.al | Partizani2024 | KF Partizani | male |
| FSHF Football | Ilir Dana | ilir@fshf.al | Dinamo2024 | FK Dinamo City | male |
| FSHF Football | Orges Shehi | orges@fshf.al | Tirana2024 | KF Tirana | male |
| FSHF Football | Enkeleid Dobi | enkeleid@fshf.al | Teuta2024 | KF Teuta | male |
| FSHF Football | Armir Grima | armir@fshf.al | FemraKomb2024 | Kombëtarja | female |
| FSHF Football | Daniela Kodra | daniela@fshf.al | U19Femra2024 | U19 | female |
| FSHB Basketball | Maris Mahmuti | maris@fshb.al | TiranaBasket2024 | KB Tirana | male |
| FSHB Basketball | Roni Gjecaj | roni@fshb.al | VllazniaBasket2024 | KB Vllaznia | male |
| FSHB Basketball | Besim Dervishaj | besim@fshb.al | TeutaBasket2024 | KB Teuta | male |
| FSHB Basketball | Artur Kasaj | artur@fshb.al | Apolonia2024 | KB Apolonia | male |
| FSHB Basketball | Olsi Muca | olsi@fshb.al | TiranaFemra2024 | KB Tirana (femra) | female |
| FSHB Basketball | Valbona Sako | valbona@fshb.al | Flamurtari2024 | Flamurtari Basket (femra) | female |
| FSHB Basketball | Ingrit Kraja | ingrit@fshb.al | VllazniaFemra2024 | Vllaznia Basket (femra) | female |
| FSHV Volleyball | Arben Sako | arben@fshv.al | Kombetare2024 | Kombëtare KV Tirana | male |
| FSHV Volleyball | Ylli Tomori | ylli@fshv.al | PartizaniVoll2024 | KV Partizani | male |
| FSHV Volleyball | Artan Kalaja | artan@fshv.al | VllazniaVoll2024 | KV Vllaznia | male |
| FSHV Volleyball | Parit Uruci | parit@fshv.al | Erzeni2024 | KV Erzeni | male |
| FSHV Volleyball | Adrian Gorenca | adrian@fshv.al | FemraKombVoll2024 | Kombëtare KV Tirana (femra) | female |
| FSHV Volleyball | Andi Lundra | andi@fshv.al | PartizaniFemra2024 | KV Partizani (femra) | female |
| FSHV Volleyball | Erjols Haxhillari | erjols@fshv.al | Skenderbeu2024 | KV Skënderbeu (femra) | female |
| FSHV Volleyball | Besnik Lisha | besnik@fshv.al | Pogradec2024 | KV Pogradeci (femra) | female |
| FSHTV Taekwondo | Arjola Kasaj | arjola@fshtv.al | Taekwondo2024 | Tirana Taekwondo Club | female |

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

