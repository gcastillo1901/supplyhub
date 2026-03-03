import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const purchases = await prisma.purchase.findMany({
    include: {
      supplier: true,
      details: {
        include: {
          product: true
        }
      }
    },
    orderBy: { purchaseDate: 'desc' }
  })

  return NextResponse.json(purchases)
}

export async function POST(request: Request) {
  const { supplierId, total, details } = await request.json()

  const purchase = await prisma.purchase.create({
    data: {
      supplierId,
      purchaseDate: new Date(),
      total,
      details: {
        create: details.map((d: any) => ({
          productId: d.productId,
          quantity: d.quantity,
          purchasePrice: d.unitPrice,
          subtotal: d.subtotal
        }))
      }
    }
  })

  return NextResponse.json(purchase)
}
