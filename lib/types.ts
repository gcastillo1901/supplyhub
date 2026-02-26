export type PaymentMethod = "cash" | "transfer" | "credit"
export type SaleStatus = "completed" | "cancelled" | "pending"
export type CustomerType = "retail" | "wholesale" | "credit"
export type CashRegisterStatus = "open" | "closed"
export type MovementType = "income" | "expense"

export interface Category {
  id: string
  name: string
  description: string
}

export interface Supplier {
  id: string
  name: string
  identification: string
  contact: string
  phone: string
  email: string
  address: string
}

export interface Product {
  id: string
  code: string
  name: string
  description: string
  categoryId: string
  supplierId: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  unit: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  identification: string
  phone: string
  email: string
  address: string
  type: CustomerType
  creditLimit: number
  balance: number
  createdAt: string
}

export interface SaleDetail {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Sale {
  id: string
  customerId: string | null
  customerName: string
  details: SaleDetail[]
  subtotal: number
  tax: number
  taxRate: number
  total: number
  paymentMethod: PaymentMethod
  status: SaleStatus
  createdAt: string
}

export interface PurchaseDetail {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Purchase {
  id: string
  supplierId: string
  supplierName: string
  details: PurchaseDetail[]
  subtotal: number
  tax: number
  total: number
  createdAt: string
}

export interface CashMovement {
  id: string
  registerId: string
  type: MovementType
  amount: number
  description: string
  reference: string
  createdAt: string
}

export interface CashRegister {
  id: string
  openingAmount: number
  closingAmount: number | null
  expectedAmount: number
  difference: number | null
  status: CashRegisterStatus
  movements: CashMovement[]
  openedAt: string
  closedAt: string | null
}

export interface StoreConfig {
  businessName: string
  taxRate: number
  currency: string
}
