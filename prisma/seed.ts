import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation de la base de données ISHQ Parfums...");

  // 1. Création des utilisateurs Administrateurs avec le mot de passe "admin123"
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminEmails = ["admin@ishq-parfum.com", "admin@ishq.com"];

  for (const email of adminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hashedPassword, role: Role.ADMIN },
      create: {
        email,
        name: "Maison ISHQ Admin",
        passwordHash: hashedPassword,
        role: Role.ADMIN,
      },
    });
  }

  console.log(`👤 Comptes administrateurs prêts : ${adminEmails.join(", ")} (Mot de passe: admin123)`);

  // 2. Création des produits initialisés depuis le catalogue ISHQ
  const perfumesData = [
    {
      id: "ishq-signature",
      name: "ISHQ Signature",
      subtitle: "Huile de Parfum Originelle",
      price: 89.0,
      category: "signature",
      categoryLabel: "Signature",
      image: "/assets/collection-santorini.jpg",
      description:
        "Une composition orientale moderne où le jasmin de Grasse rencontre l'ambre précieux. Une huile sans alcool, intime sur la peau, qui se révèle au fil des heures comme un secret murmuré.",
      size: "10 ml · Roll-on",
      notes: {
        head: "Bergamote, Néroli",
        heart: "Jasmin de Grasse, Rose de Damas",
        base: "Ambre chaud, Oud royal, Musc Blanc",
      },
      rating: 5.0,
      badge: "Bestseller",
      stock: 150,
    },
    {
      id: "ishq-soleil",
      name: "Soleil d'Oranger",
      subtitle: "Huile de Parfum Ensoleillée",
      price: 89.0,
      category: "fresh",
      categoryLabel: "Frais",
      image: "/assets/collection-citrus.jpg",
      description:
        "Un sillage hespéridé et floral évoquant les vergers ensoleillés de Méditerranée. La fraîcheur des agrumes s'harmonise délicatement avec la douceur de la fleur d'oranger.",
      size: "10 ml · Roll-on",
      notes: {
        head: "Bergamote, Citron Vert, Mandarine",
        heart: "Fleur d'Oranger, Néroli des Cyclades",
        base: "Musc Blanc, Ambre doux",
      },
      rating: 4.9,
      badge: "Nouveauté",
      stock: 120,
    },
    {
      id: "ishq-sunset",
      name: "Sunset Club",
      subtitle: "Huile de Parfum Crépusculaire",
      price: 95.0,
      category: "intense",
      categoryLabel: "Intense",
      image: "/assets/collection-sunset.jpg",
      description:
        "Une fragrance sophistiquée célébrant l'élégance de la golden hour. L'effervescence d'un accord festif se fond dans la sensualité d'un jasmin nocturne et d'un ambre précieux.",
      size: "10 ml · Roll-on",
      notes: {
        head: "Champagne Pétillant, Accord Fruité",
        heart: "Jasmin de Nuit, Poivre Rose",
        base: "Bois de Cachemire, Ambre Précieux",
      },
      rating: 5.0,
      badge: "Édition Limitée",
      stock: 80,
    },
    {
      id: "ishq-yachting",
      name: "Yachting Club",
      subtitle: "Huile de Parfum Marine",
      price: 95.0,
      category: "fresh",
      categoryLabel: "Frais",
      image: "/assets/collection-yacht.jpg",
      description:
        "L'esprit d'une escapade à bord d'un yacht au large des îles grecques. La pureté d'une brise saline et iodée s'allie à la noblesse du bois flotté et de la sauge.",
      size: "10 ml · Roll-on",
      notes: {
        head: "Brise Saline, Mandarine Italienne",
        heart: "Accord Marin, Sauge Sclatée",
        base: "Bois Flotté, Vétiver Sauvage",
      },
      rating: 4.8,
      badge: null,
      stock: 100,
    },
    {
      id: "ishq-bouquet",
      name: "Bouquet de Soie",
      subtitle: "Huile de Parfum Florale",
      price: 98.0,
      category: "floral",
      categoryLabel: "Floral",
      image: "/assets/collection-rose.jpg",
      description:
        "Un voile poudré d'une extrême féminité. La délicatesse des pétales de rose et de l'iris de Florence se dépose sur la peau comme une caresse de soie pure.",
      size: "10 ml · Roll-on",
      notes: {
        head: "Pétales de Rose, Mandarine douce",
        heart: "Iris de Florence, Rose de Mai, Jasmin",
        base: "Santal Crémeux, Musc Blanc",
      },
      rating: 4.9,
      badge: "Coup de Cœur",
      stock: 90,
    },
  ];

  for (const item of perfumesData) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log(`🌸 ${perfumesData.length} Parfums créés/mis à jour dans la base de données.`);
  console.log("✨ Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
