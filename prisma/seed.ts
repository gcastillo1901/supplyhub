import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Usuarios
  await prisma.user.createMany({
    data: [
      { name: 'José Ramírez', email: 'jose@ferreteria.ni', password: 'admin123', role: 'admin' },
      { name: 'Ana Morales', email: 'ana@ferreteria.ni', password: 'cashier123', role: 'cashier' },
    ],
  })

  // Categorías
  await prisma.category.createMany({
    data: [
      { name: 'Herramientas Manuales', description: 'Martillos, destornilladores, llaves' },
      { name: 'Materiales de Construcción', description: 'Cemento, arena, bloques' },
      { name: 'Electricidad', description: 'Cables, interruptores, focos' },
      { name: 'Plomería', description: 'Tubos PVC, llaves, accesorios' },
      { name: 'Pintura', description: 'Pinturas, brochas, rodillos' },
    ],
  })

  // Proveedores
  await prisma.supplier.createMany({
    data: [
      { name: 'Ferremax Nicaragua', identification: '281-090588-0001M', phone: '2278-5544', address: 'Km 5 Carretera Norte, Managua', email: 'ventas@ferremax.ni' },
      { name: 'Distribuidora El Constructor', identification: '281-120689-0002K', phone: '2266-3322', address: 'Pista Juan Pablo II, Managua', email: 'info@elconstructor.ni' },
      { name: 'Importadora La Unión', identification: '281-250790-0003P', phone: '2244-7788', address: 'Mercado Oriental, Managua', email: 'compras@launion.ni' },
    ],
  })

  // Clientes
  await prisma.customer.createMany({
    data: [
      { name: 'Constructora Los Robles', identification: '041-180787-0001L', phone: '8899-4455', address: 'Los Robles, Managua', email: 'proyectos@losrobles.ni', customerType: 'credit', creditLimit: 150000 },
      { name: 'Miguel Gutiérrez', identification: '001-220891-0033J', phone: '8765-4321', address: 'Masaya', customerType: 'cash' },
      { name: 'Ferretería San Antonio', identification: '041-050686-0002N', phone: '2255-6677', address: 'Granada, Nicaragua', email: 'ventas@sanantonio.ni', customerType: 'credit', creditLimit: 80000 },
    ],
  })

  // Productos
  const categories = await prisma.category.findMany()
  await prisma.product.createMany({
    data: [
      { code: 'MART001', name: 'Martillo Uña 16oz Stanley', categoryId: categories[0].id, purchasePrice: 280, salePrice: 350, stock: 45, minimumStock: 10 },
      { code: 'DEST001', name: 'Juego Destornilladores 6pz', categoryId: categories[0].id, purchasePrice: 180, salePrice: 240, stock: 30, minimumStock: 8 },
      { code: 'CEM001', name: 'Cemento Holcim 50kg', categoryId: categories[1].id, purchasePrice: 320, salePrice: 380, stock: 200, minimumStock: 50 },
      { code: 'BLO001', name: 'Bloque 6" Estándar', categoryId: categories[1].id, purchasePrice: 12, salePrice: 15, stock: 500, minimumStock: 100 },
      { code: 'CAB001', name: 'Cable Eléctrico #12 (metro)', categoryId: categories[2].id, purchasePrice: 18, salePrice: 25, stock: 300, minimumStock: 50 },
      { code: 'FOC001', name: 'Foco LED 9W Luz Blanca', categoryId: categories[2].id, purchasePrice: 45, salePrice: 65, stock: 80, minimumStock: 20 },
      { code: 'TUB001', name: 'Tubo PVC 1/2" x 6m', categoryId: categories[3].id, purchasePrice: 85, salePrice: 110, stock: 120, minimumStock: 25 },
      { code: 'LLA001', name: 'Llave de Chorro 1/2"', categoryId: categories[3].id, purchasePrice: 95, salePrice: 130, stock: 60, minimumStock: 15 },
      { code: 'PIN001', name: 'Pintura Latex Blanco Galón', categoryId: categories[4].id, purchasePrice: 420, salePrice: 550, stock: 40, minimumStock: 10 },
      { code: 'BRO001', name: 'Brocha 3" Profesional', categoryId: categories[4].id, purchasePrice: 65, salePrice: 90, stock: 50, minimumStock: 12 },
    ],
  })

  // Compras
  const suppliers = await prisma.supplier.findMany()
  const products = await prisma.product.findMany()
  
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  await prisma.purchase.create({
    data: {
      supplierId: suppliers[0].id,
      purchaseDate: threeDaysAgo,
      total: 78400,
      details: {
        create: [
          { productId: products[0].id, quantity: 50, purchasePrice: 280, subtotal: 14000 },
          { productId: products[2].id, quantity: 200, purchasePrice: 320, subtotal: 64000 },
        ],
      },
    },
  })

  // Ventas
  const customers = await prisma.customer.findMany()
  const users = await prisma.user.findMany()

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  await prisma.sale.create({
    data: {
      customerId: customers[0].id,
      saleDate: yesterday,
      subtotal: 8650,
      tax: 1297.5,
      total: 9947.5,
      paymentMethod: 'transfer',
      status: 'paid',
      createdById: users[0].id,
      details: {
        create: [
          { productId: products[2].id, quantity: 20, salePrice: 380, subtotal: 7600 },
          { productId: products[6].id, quantity: 10, salePrice: 110, subtotal: 1100 },
        ],
      },
    },
  })

  await prisma.sale.create({
    data: {
      customerId: customers[1].id,
      saleDate: today,
      subtotal: 1050,
      tax: 157.5,
      total: 1207.5,
      paymentMethod: 'cash',
      status: 'paid',
      createdById: users[0].id,
      details: {
        create: [
          { productId: products[0].id, quantity: 3, salePrice: 350, subtotal: 1050 },
        ],
      },
    },
  })

  // Caja
  const now = new Date()
  const openingTime = new Date(now)
  openingTime.setHours(7, 30, 0, 0)

  await prisma.cashRegister.create({
    data: {
      openingDate: openingTime,
      openingAmount: 10000,
      status: 'open',
      movements: {
        create: [
          { movementType: 'income', description: 'Venta materiales construcción', amount: 9947.5, movementDate: new Date(now.getTime() + 3600000) },
          { movementType: 'expense', description: 'Compra de bolsas y facturas', amount: 250, movementDate: new Date(now.getTime() + 7200000) },
        ],
      },
    },
  })

  console.log('✅ Seeds de ferretería creados exitosamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
