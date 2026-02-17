const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  'men-clothing', 'men-shoes', 'women-clothing', 'women-shoes',
  'kids-clothing', 'kids-shoes', 'accessories'
];

// Helper to generate a realistic image URL using placeholder services
const getImageUrl = (category, index) => {
  // Using picsum for variety (but for real products, you'd use actual product images)
  // We'll use different seed to get different images per product.
  return `https://picsum.photos/seed/${category}${index}/400/400`;
};

async function main() {
  console.log('Seeding products...');
  for (let i = 1; i <= 200; i++) {
    const cat = categories[i % categories.length];
    const name = `${cat.split('-').join(' ')} item ${i}`;
    const price = 500 + (i * 10) % 5000; // random-ish price between 500 and 5500
    const stock = 10 + (i % 20);
    await prisma.product.create({
      data: {
        name,
        description: `High quality ${cat} product #${i}. Perfect for fashion lovers.`,
        price,
        category: cat,
        imageUrl: getImageUrl(cat, i),
        stock,
      },
    });
  }
  console.log('Seeding delivery zones...');
  const zones = [
    { name: 'Nairobi CBD', price: 200 },
    { name: 'Nairobi Outside', price: 300 },
    { name: 'Kiambu', price: 350 },
    { name: 'Other Counties', price: 500 },
  ];
  for (const zone of zones) {
    await prisma.deliveryZone.create({ data: zone });
  }
  console.log('Seeding admin user...');
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@fashiongrid.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@fashiongrid.com',
      password: hashed,
      phone: '0112870234',
      role: 'admin',
    },
  });
  console.log('Seeding completed.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());