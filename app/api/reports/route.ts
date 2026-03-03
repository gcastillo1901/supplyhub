import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const [sales, purchases] = await Promise.all([
    prisma.sale.findMany({
      where: {
        saleDate: { gte: cutoff },
        status: 'paid'
      },
      include: {
        customer: true,
        details: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    }),
    prisma.purchase.findMany({
      where: {
        purchaseDate: { gte: cutoff }
      }
    })
  ])

  return NextResponse.json({ sales, purchases })
}
