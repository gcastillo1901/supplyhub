import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const suppliers = await prisma.supplier.findMany()
  return NextResponse.json(suppliers)
}

export async function POST(request: Request) {
  const data = await request.json()
  const supplier = await prisma.supplier.create({ data })
  return NextResponse.json(supplier)
}
