import { PrismaClient, Role, Sport } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type CoachSeed = {
  name: string;
  email: string;
  password: string;
  teamName: string;
  sport: Sport;
  gender: 'male' | 'female';
  federationName: string;
};

const coaches: CoachSeed[] = [
  { name: 'Sylvio Mendes Campos Junior', email: 'sylvio@fshf.al', password: 'Kombetarja2024', teamName: 'Kombëtarja', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Alban Bushi', email: 'alban@fshf.al', password: 'U212024Bushi', teamName: 'U21', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Edi Martini', email: 'edi@fshf.al', password: 'Vllaznia2024', teamName: 'KF Vllaznia', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Edlir Tetova', email: 'edlir@fshf.al', password: 'Egnatia2024', teamName: 'KF Egnatia', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Ivan Gvozdenović', email: 'ivan@fshf.al', password: 'Elbasani2024', teamName: 'AF Elbasani', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Oltijon Kernaja', email: 'oltijon@fshf.al', password: 'Partizani2024', teamName: 'KF Partizani', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Ilir Dana', email: 'ilir@fshf.al', password: 'Dinamo2024', teamName: 'FK Dinamo City', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Orges Shehi', email: 'orges@fshf.al', password: 'Tirana2024', teamName: 'KF Tirana', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Enkeleid Dobi', email: 'enkeleid@fshf.al', password: 'Teuta2024', teamName: 'KF Teuta', sport: 'football', gender: 'male', federationName: 'FSHF Football' },
  { name: 'Armir Grima', email: 'armir@fshf.al', password: 'FemraKomb2024', teamName: 'Kombëtarja', sport: 'football', gender: 'female', federationName: 'FSHF Football' },
  { name: 'Daniela Kodra', email: 'daniela@fshf.al', password: 'U19Femra2024', teamName: 'U19', sport: 'football', gender: 'female', federationName: 'FSHF Football' },
  { name: 'Maris Mahmuti', email: 'maris@fshb.al', password: 'TiranaBasket2024', teamName: 'KB Tirana', sport: 'basketball', gender: 'male', federationName: 'FSHB Basketball' },
  { name: 'Roni Gjecaj', email: 'roni@fshb.al', password: 'VllazniaBasket2024', teamName: 'KB Vllaznia', sport: 'basketball', gender: 'male', federationName: 'FSHB Basketball' },
  { name: 'Besim Dervishaj', email: 'besim@fshb.al', password: 'TeutaBasket2024', teamName: 'KB Teuta', sport: 'basketball', gender: 'male', federationName: 'FSHB Basketball' },
  { name: 'Artur Kasaj', email: 'artur@fshb.al', password: 'Apolonia2024', teamName: 'KB Apolonia', sport: 'basketball', gender: 'male', federationName: 'FSHB Basketball' },
  { name: 'Olsi Muca', email: 'olsi@fshb.al', password: 'TiranaFemra2024', teamName: 'KB Tirana (femra)', sport: 'basketball', gender: 'female', federationName: 'FSHB Basketball' },
  { name: 'Valbona Sako', email: 'valbona@fshb.al', password: 'Flamurtari2024', teamName: 'Flamurtari Basket (femra)', sport: 'basketball', gender: 'female', federationName: 'FSHB Basketball' },
  { name: 'Ingrit Kraja', email: 'ingrit@fshb.al', password: 'VllazniaFemra2024', teamName: 'Vllaznia Basket (femra)', sport: 'basketball', gender: 'female', federationName: 'FSHB Basketball' },
  { name: 'Arben Sako', email: 'arben@fshv.al', password: 'Kombetare2024', teamName: 'Kombëtare KV Tirana', sport: 'volleyball', gender: 'male', federationName: 'FSHV Volleyball' },
  { name: 'Ylli Tomori', email: 'ylli@fshv.al', password: 'PartizaniVoll2024', teamName: 'KV Partizani', sport: 'volleyball', gender: 'male', federationName: 'FSHV Volleyball' },
  { name: 'Artan Kalaja', email: 'artan@fshv.al', password: 'VllazniaVoll2024', teamName: 'KV Vllaznia', sport: 'volleyball', gender: 'male', federationName: 'FSHV Volleyball' },
  { name: 'Parit Uruci', email: 'parit@fshv.al', password: 'Erzeni2024', teamName: 'KV Erzeni', sport: 'volleyball', gender: 'male', federationName: 'FSHV Volleyball' },
  { name: 'Adrian Gorenca', email: 'adrian@fshv.al', password: 'FemraKombVoll2024', teamName: 'Kombëtare KV Tirana (femra)', sport: 'volleyball', gender: 'female', federationName: 'FSHV Volleyball' },
  { name: 'Andi Lundra', email: 'andi@fshv.al', password: 'PartizaniFemra2024', teamName: 'KV Partizani (femra)', sport: 'volleyball', gender: 'female', federationName: 'FSHV Volleyball' },
  { name: 'Erjols Haxhillari', email: 'erjols@fshv.al', password: 'Skenderbeu2024', teamName: 'KV Skënderbeu (femra)', sport: 'volleyball', gender: 'female', federationName: 'FSHV Volleyball' },
  { name: 'Besnik Lisha', email: 'besnik@fshv.al', password: 'Pogradec2024', teamName: 'KV Pogradeci (femra)', sport: 'volleyball', gender: 'female', federationName: 'FSHV Volleyball' },
  { name: 'Arjola Kasaj', email: 'arjola@fshtv.al', password: 'Taekwondo2024', teamName: 'Tirana Taekwondo Club', sport: 'taekwondo', gender: 'female', federationName: 'FSHTV Taekwondo' },
];

async function main() {
  console.log('Seeding federations, trainers, and teams...');

  const federationByName = new Map<string, { id: number }>();
  for (const federation of [
    { name: 'FSHF Football', sport: 'football' as Sport },
    { name: 'FSHB Basketball', sport: 'basketball' as Sport },
    { name: 'FSHV Volleyball', sport: 'volleyball' as Sport },
    { name: 'FSHTV Taekwondo', sport: 'taekwondo' as Sport },
  ]) {
    const created = await prisma.federation.upsert({
      where: { name: federation.name },
      update: { sport: federation.sport },
      create: federation,
    });
    federationByName.set(federation.name, { id: created.id });
  }

  for (const coach of coaches) {
    const federation = federationByName.get(coach.federationName);
    if (!federation) {
      throw new Error(`Missing federation: ${coach.federationName}`);
    }

    const hashedPassword = await bcrypt.hash(coach.password, 10);
    const user = await prisma.user.upsert({
      where: { email: coach.email },
      update: {
        name: coach.name,
        password: hashedPassword,
        role: 'trainer' as Role,
      },
      create: {
        name: coach.name,
        email: coach.email,
        password: hashedPassword,
        role: 'trainer' as Role,
      },
    });

    await prisma.team.upsert({
      where: { trainerId: user.id },
      update: {
        name: coach.teamName,
        sport: coach.sport,
        gender: coach.gender,
        federationId: federation.id,
      },
      create: {
        name: coach.teamName,
        sport: coach.sport,
        gender: coach.gender,
        federationId: federation.id,
        trainerId: user.id,
      },
    });

    console.log(
      `[SEED CREDENTIAL] ${coach.name} | ${coach.email} | ${coach.password} | ${coach.teamName} (${coach.gender})`
    );
  }

  console.log(`Seed completed. Total trainers: ${coaches.length}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
