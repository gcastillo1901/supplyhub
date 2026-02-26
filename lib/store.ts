import { create } from "zustand"
import type {
  Category,
  Product,
  Supplier,
  Customer,
  Sale,
  SaleDetail,
  Purchase,
  PurchaseDetail,
  CashRegister,
  CashMovement,
  StoreConfig,
  PaymentMethod,
} from "./types"
import { generateId } from "./utils"


// Seed Data
const now = new Date()
function daysAgo(n: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const seedCategories: Category[] = [
  { id: "cat-1", name: "Herramientas Manuales", description: "Martillos, destornilladores, llaves" },
  { id: "cat-2", name: "Herramientas Electricas", description: "Taladros, sierras, pulidoras" },
  { id: "cat-3", name: "Tornilleria", description: "Tornillos, tuercas, arandelas" },
  { id: "cat-4", name: "Pinturas", description: "Pinturas, brochas, rodillos" },
  { id: "cat-5", name: "Plomeria", description: "Tubos, codos, pegamento PVC" },
]

const seedSuppliers: Supplier[] = [
  { id: "sup-1", name: "Distribuidora Nacional", identification: "RUC-08019012345678",  contact: "Carlos Mena", phone: "2234-5678", email: "ventas@distnac.ni", address: "Col. Kennedy, Tegucigalpa" },
  { id: "sup-2", name: "Importadora Central", identification: "RUC-08019012345679",   contact: "Maria Lopez", phone: "2245-6789", email: "info@impocentral.ni", address: "Blvd. Morazan, SPS" },
  { id: "sup-3", name: "Ferreteros Unidos", identification: "RUC-08019012345680",   contact: "Jose Reyes", phone: "2256-7890", email: "pedidos@ferreunidos.ni", address: "Col. Palmira, Tegucigalpa" },
]

const seedProducts: Product[] = [
  { id: "prod-1", code: "HM-001", name: "Martillo 16oz Stanley", description: "Martillo de acero forjado", categoryId: "cat-1", supplierId: "sup-1", purchasePrice: 180, salePrice: 275, stock: 25, minStock: 5, unit: "unidad", createdAt: daysAgo(30) },
  { id: "prod-2", code: "HM-002", name: "Destornillador Phillips #2", description: "Destornillador punta Phillips", categoryId: "cat-1", supplierId: "sup-1", purchasePrice: 45, salePrice: 75, stock: 40, minStock: 10, unit: "unidad", createdAt: daysAgo(30) },
  { id: "prod-3", code: "HM-003", name: "Llave Ajustable 10\"", description: "Llave ajustable cromo vanadio", categoryId: "cat-1", supplierId: "sup-2", purchasePrice: 120, salePrice: 195, stock: 15, minStock: 5, unit: "unidad", createdAt: daysAgo(28) },
  { id: "prod-4", code: "HE-001", name: "Taladro Percutor Bosch", description: "Taladro 1/2\" 750W", categoryId: "cat-2", supplierId: "sup-2", purchasePrice: 1500, salePrice: 2350, stock: 8, minStock: 3, unit: "unidad", createdAt: daysAgo(25) },
  { id: "prod-5", code: "HE-002", name: "Sierra Circular 7 1/4\"", description: "Sierra circular 1400W", categoryId: "cat-2", supplierId: "sup-2", purchasePrice: 2200, salePrice: 3450, stock: 4, minStock: 2, unit: "unidad", createdAt: daysAgo(25) },
  { id: "prod-6", code: "HE-003", name: "Pulidora Angular 4 1/2\"", description: "Pulidora 820W", categoryId: "cat-2", supplierId: "sup-3", purchasePrice: 850, salePrice: 1350, stock: 6, minStock: 3, unit: "unidad", createdAt: daysAgo(22) },
  { id: "prod-7", code: "TO-001", name: "Tornillo Drywall 6x1\"", description: "Tornillo para tablaroca", categoryId: "cat-3", supplierId: "sup-1", purchasePrice: 0.3, salePrice: 0.6, stock: 5000, minStock: 1000, unit: "unidad", createdAt: daysAgo(20) },
  { id: "prod-8", code: "TO-002", name: "Tornillo Madera 8x2\"", description: "Tornillo cabeza plana", categoryId: "cat-3", supplierId: "sup-1", purchasePrice: 0.5, salePrice: 1, stock: 3000, minStock: 500, unit: "unidad", createdAt: daysAgo(20) },
  { id: "prod-9", code: "TO-003", name: "Tuerca Hexagonal 3/8\"", description: "Tuerca galvanizada", categoryId: "cat-3", supplierId: "sup-3", purchasePrice: 0.8, salePrice: 1.5, stock: 200, minStock: 500, unit: "unidad", createdAt: daysAgo(18) },
  { id: "prod-10", code: "PI-001", name: "Pintura Latex Blanca 1gal", description: "Pintura latex interior/exterior", categoryId: "cat-4", supplierId: "sup-2", purchasePrice: 280, salePrice: 450, stock: 20, minStock: 5, unit: "galon", createdAt: daysAgo(15) },
  { id: "prod-11", code: "PI-002", name: "Brocha 4\" Profesional", description: "Brocha cerda natural", categoryId: "cat-4", supplierId: "sup-1", purchasePrice: 65, salePrice: 110, stock: 30, minStock: 10, unit: "unidad", createdAt: daysAgo(15) },
  { id: "prod-12", code: "PI-003", name: "Rodillo 9\" con Bandeja", description: "Rodillo para pintura con bandeja", categoryId: "cat-4", supplierId: "sup-1", purchasePrice: 95, salePrice: 160, stock: 12, minStock: 5, unit: "unidad", createdAt: daysAgo(14) },
  { id: "prod-13", code: "PL-001", name: "Tubo PVC 1/2\" x 6m", description: "Tubo PVC presion", categoryId: "cat-5", supplierId: "sup-3", purchasePrice: 35, salePrice: 60, stock: 50, minStock: 15, unit: "unidad", createdAt: daysAgo(12) },
  { id: "prod-14", code: "PL-002", name: "Codo PVC 1/2\" x 90", description: "Codo PVC presion", categoryId: "cat-5", supplierId: "sup-3", purchasePrice: 5, salePrice: 10, stock: 100, minStock: 30, unit: "unidad", createdAt: daysAgo(12) },
  { id: "prod-15", code: "PL-003", name: "Pegamento PVC 1/4gal", description: "Pegamento para tuberia PVC", categoryId: "cat-5", supplierId: "sup-3", purchasePrice: 120, salePrice: 195, stock: 3, minStock: 5, unit: "unidad", createdAt: daysAgo(10) },
  { id: "prod-16", code: "HM-004", name: "Cinta Metrica 5m", description: "Flexometro 5m profesional", categoryId: "cat-1", supplierId: "sup-1", purchasePrice: 55, salePrice: 95, stock: 2, minStock: 8, unit: "unidad", createdAt: daysAgo(8) },
  { id: "prod-17", code: "HE-004", name: "Rotomartillo SDS Plus", description: "Rotomartillo 800W", categoryId: "cat-2", supplierId: "sup-2", purchasePrice: 3500, salePrice: 5200, stock: 2, minStock: 2, unit: "unidad", createdAt: daysAgo(7) },
  { id: "prod-18", code: "PI-004", name: "Thinner 1gal", description: "Thinner industrial", categoryId: "cat-4", supplierId: "sup-2", purchasePrice: 150, salePrice: 240, stock: 8, minStock: 3, unit: "galon", createdAt: daysAgo(5) },
  { id: "prod-19", code: "TO-004", name: "Clavo 2 1/2\" (lb)", description: "Clavo comun", categoryId: "cat-3", supplierId: "sup-1", purchasePrice: 20, salePrice: 38, stock: 150, minStock: 50, unit: "libra", createdAt: daysAgo(3) },
  { id: "prod-20", code: "PL-004", name: "Llave de Paso 1/2\"", description: "Llave de paso bronce", categoryId: "cat-5", supplierId: "sup-3", purchasePrice: 85, salePrice: 145, stock: 1, minStock: 5, unit: "unidad", createdAt: daysAgo(2) },
]

const seedCustomers: Customer[] = [
  { id: "cust-1", name: "Contado", identification: "0000", phone: "", email: "", address: "", type: "retail", creditLimit: 0, balance: 0, createdAt: daysAgo(60) },
  { id: "cust-2", name: "Juan Hernandez", identification: "0801-1990-12345", phone: "9988-7766", email: "juan@mail.com", address: "Col. Los Pinos, Tegucigalpa", type: "retail", creditLimit: 0, balance: 0, createdAt: daysAgo(45) },
  { id: "cust-3", name: "Constructora Moderna S.A.", identification: "RUC-08019012345678", phone: "2222-3333", email: "compras@consmoderna.hn", address: "Blvd. Fuerzas Armadas", type: "wholesale", creditLimit: 50000, balance: 0, createdAt: daysAgo(40) },
  { id: "cust-4", name: "Roberto Castillo", identification: "0501-1985-09876", phone: "9876-5432", email: "roberto.c@mail.com", address: "Res. Las Colinas, SPS", type: "credit", creditLimit: 15000, balance: 3450, createdAt: daysAgo(30) },
  { id: "cust-5", name: "Maria Elena Flores", identification: "0801-1978-55432", phone: "8765-4321", email: "maria.flores@mail.com", address: "Col. Miraflores, Tegucigalpa", type: "retail", creditLimit: 0, balance: 0, createdAt: daysAgo(20) },
]

const seedSales: Sale[] = [
  {
    id: "sale-1", customerId: "cust-2", customerName: "Juan Hernandez",
    details: [
      { id: "sd-1", productId: "prod-1", productName: "Martillo 16oz Stanley", quantity: 1, unitPrice: 275, subtotal: 275 },
      { id: "sd-2", productId: "prod-2", productName: "Destornillador Phillips #2", quantity: 2, unitPrice: 75, subtotal: 150 },
    ],
    subtotal: 425, tax: 63.75, taxRate: 15, total: 488.75, paymentMethod: "cash", status: "completed", createdAt: daysAgo(6),
  },
  {
    id: "sale-2", customerId: "cust-3", customerName: "Constructora Moderna S.A.",
    details: [
      { id: "sd-3", productId: "prod-4", productName: "Taladro Percutor Bosch", quantity: 2, unitPrice: 2350, subtotal: 4700 },
      { id: "sd-4", productId: "prod-7", productName: "Tornillo Drywall 6x1\"", quantity: 500, unitPrice: 0.6, subtotal: 300 },
    ],
    subtotal: 5000, tax: 750, taxRate: 15, total: 5750, paymentMethod: "transfer", status: "completed", createdAt: daysAgo(5),
  },
  {
    id: "sale-3", customerId: "cust-1", customerName: "Contado",
    details: [
      { id: "sd-5", productId: "prod-10", productName: "Pintura Latex Blanca 1gal", quantity: 3, unitPrice: 450, subtotal: 1350 },
      { id: "sd-6", productId: "prod-11", productName: "Brocha 4\" Profesional", quantity: 2, unitPrice: 110, subtotal: 220 },
      { id: "sd-7", productId: "prod-12", productName: "Rodillo 9\" con Bandeja", quantity: 1, unitPrice: 160, subtotal: 160 },
    ],
    subtotal: 1730, tax: 259.5, taxRate: 15, total: 1989.5, paymentMethod: "cash", status: "completed", createdAt: daysAgo(4),
  },
  {
    id: "sale-4", customerId: "cust-4", customerName: "Roberto Castillo",
    details: [
      { id: "sd-8", productId: "prod-13", productName: "Tubo PVC 1/2\" x 6m", quantity: 10, unitPrice: 60, subtotal: 600 },
      { id: "sd-9", productId: "prod-14", productName: "Codo PVC 1/2\" x 90", quantity: 20, unitPrice: 10, subtotal: 200 },
      { id: "sd-10", productId: "prod-15", productName: "Pegamento PVC 1/4gal", quantity: 2, unitPrice: 195, subtotal: 390 },
    ],
    subtotal: 1190, tax: 178.5, taxRate: 15, total: 1368.5, paymentMethod: "credit", status: "completed", createdAt: daysAgo(3),
  },
  {
    id: "sale-5", customerId: "cust-5", customerName: "Maria Elena Flores",
    details: [
      { id: "sd-11", productId: "prod-6", productName: "Pulidora Angular 4 1/2\"", quantity: 1, unitPrice: 1350, subtotal: 1350 },
    ],
    subtotal: 1350, tax: 202.5, taxRate: 15, total: 1552.5, paymentMethod: "cash", status: "completed", createdAt: daysAgo(2),
  },
  {
    id: "sale-6", customerId: "cust-1", customerName: "Contado",
    details: [
      { id: "sd-12", productId: "prod-19", productName: "Clavo 2 1/2\" (lb)", quantity: 5, unitPrice: 38, subtotal: 190 },
      { id: "sd-13", productId: "prod-8", productName: "Tornillo Madera 8x2\"", quantity: 100, unitPrice: 1, subtotal: 100 },
    ],
    subtotal: 290, tax: 43.5, taxRate: 15, total: 333.5, paymentMethod: "cash", status: "completed", createdAt: daysAgo(1),
  },
  {
    id: "sale-7", customerId: "cust-2", customerName: "Juan Hernandez",
    details: [
      { id: "sd-14", productId: "prod-3", productName: "Llave Ajustable 10\"", quantity: 1, unitPrice: 195, subtotal: 195 },
      { id: "sd-15", productId: "prod-16", productName: "Cinta Metrica 5m", quantity: 1, unitPrice: 95, subtotal: 95 },
    ],
    subtotal: 290, tax: 43.5, taxRate: 15, total: 333.5, paymentMethod: "cash", status: "completed", createdAt: daysAgo(0),
  },
]

const seedPurchases: Purchase[] = [
  {
    id: "pur-1", supplierId: "sup-1", supplierName: "Distribuidora Nacional",
    details: [
      { id: "pd-1", productId: "prod-1", productName: "Martillo 16oz Stanley", quantity: 20, unitPrice: 180, subtotal: 3600 },
      { id: "pd-2", productId: "prod-2", productName: "Destornillador Phillips #2", quantity: 30, unitPrice: 45, subtotal: 1350 },
    ],
    subtotal: 4950, tax: 742.5, total: 5692.5, createdAt: daysAgo(15),
  },
  {
    id: "pur-2", supplierId: "sup-2", supplierName: "Importadora Central",
    details: [
      { id: "pd-3", productId: "prod-4", productName: "Taladro Percutor Bosch", quantity: 10, unitPrice: 1500, subtotal: 15000 },
      { id: "pd-4", productId: "prod-5", productName: "Sierra Circular 7 1/4\"", quantity: 5, unitPrice: 2200, subtotal: 11000 },
    ],
    subtotal: 26000, tax: 3900, total: 29900, createdAt: daysAgo(10),
  },
  {
    id: "pur-3", supplierId: "sup-3", supplierName: "Ferreteros Unidos",
    details: [
      { id: "pd-5", productId: "prod-13", productName: "Tubo PVC 1/2\" x 6m", quantity: 50, unitPrice: 35, subtotal: 1750 },
      { id: "pd-6", productId: "prod-14", productName: "Codo PVC 1/2\" x 90", quantity: 100, unitPrice: 5, subtotal: 500 },
      { id: "pd-7", productId: "prod-15", productName: "Pegamento PVC 1/4gal", quantity: 10, unitPrice: 120, subtotal: 1200 },
    ],
    subtotal: 3450, tax: 517.5, total: 3967.5, createdAt: daysAgo(5),
  },
]

const seedCashRegister: CashRegister = {
  id: "cr-1",
  openingAmount: 2000,
  closingAmount: null,
  expectedAmount: 2000 + 488.75 + 1989.5 + 1552.5 + 333.5 + 333.5,
  difference: null,
  status: "open",
  movements: [
    { id: "cm-1", registerId: "cr-1", type: "income", amount: 488.75, description: "Venta #sale-1", reference: "sale-1", createdAt: daysAgo(6) },
    { id: "cm-2", registerId: "cr-1", type: "income", amount: 1989.5, description: "Venta #sale-3", reference: "sale-3", createdAt: daysAgo(4) },
    { id: "cm-3", registerId: "cr-1", type: "income", amount: 1552.5, description: "Venta #sale-5", reference: "sale-5", createdAt: daysAgo(2) },
    { id: "cm-4", registerId: "cr-1", type: "income", amount: 333.5, description: "Venta #sale-6", reference: "sale-6", createdAt: daysAgo(1) },
    { id: "cm-5", registerId: "cr-1", type: "expense", amount: 500, description: "Pago proveedor materiales", reference: "manual", createdAt: daysAgo(1) },
    { id: "cm-6", registerId: "cr-1", type: "income", amount: 333.5, description: "Venta #sale-7", reference: "sale-7", createdAt: daysAgo(0) },
  ],
  openedAt: daysAgo(7),
  closedAt: null,
}

// Store interface
interface AppState {
  // Data
  categories: Category[]
  products: Product[]
  suppliers: Supplier[]
  customers: Customer[]
  sales: Sale[]
  purchases: Purchase[]
  cashRegister: CashRegister | null
  cashHistory: CashRegister[]
  config: StoreConfig

  // Category actions
  addCategory: (cat: Omit<Category, "id">) => void
  updateCategory: (id: string, cat: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Product actions
  addProduct: (prod: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, prod: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Supplier actions
  addSupplier: (sup: Omit<Supplier, "id">) => void
  updateSupplier: (id: string, sup: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  // Customer actions
  addCustomer: (cust: Omit<Customer, "id" | "createdAt" | "balance">) => void
  updateCustomer: (id: string, cust: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Sale actions
  createSale: (sale: {
    customerId: string | null
    customerName: string
    details: Omit<SaleDetail, "id">[]
    paymentMethod: PaymentMethod
    taxRate: number
  }) => Sale

  // Purchase actions
  createPurchase: (purchase: {
    supplierId: string
    supplierName: string
    details: Omit<PurchaseDetail, "id">[]
  }) => Purchase

  // Cash register actions
  openCashRegister: (amount: number) => void
  closeCashRegister: (closingAmount: number) => void
  addCashMovement: (movement: Omit<CashMovement, "id" | "registerId" | "createdAt">) => void

  // Config actions
  updateConfig: (config: Partial<StoreConfig>) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial data
  categories: seedCategories,
  products: seedProducts,
  suppliers: seedSuppliers,
  customers: seedCustomers,
  sales: seedSales,
  purchases: seedPurchases,
  cashRegister: seedCashRegister,
  cashHistory: [],
  config: {
    businessName: "Ferreteria El Constructor",
    taxRate: 15,
    currency: "NIO",
  },

  // Category actions
  addCategory: (cat) =>
    set((state) => ({
      categories: [...state.categories, { ...cat, id: generateId() }],
    })),
  updateCategory: (id, cat) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...cat } : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  // Product actions
  addProduct: (prod) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...prod, id: generateId(), createdAt: new Date().toISOString() },
      ],
    })),
  updateProduct: (id, prod) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...prod } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  // Supplier actions
  addSupplier: (sup) =>
    set((state) => ({
      suppliers: [...state.suppliers, { ...sup, id: generateId() }],
    })),
  updateSupplier: (id, sup) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...sup } : s)),
    })),
  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),

  // Customer actions
  addCustomer: (cust) =>
    set((state) => ({
      customers: [
        ...state.customers,
        { ...cust, id: generateId(), createdAt: new Date().toISOString(), balance: 0 },
      ],
    })),
  updateCustomer: (id, cust) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...cust } : c)),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  // Sale actions
  createSale: (saleData) => {
    const state = get()
    const subtotal = saleData.details.reduce((acc, d) => acc + d.subtotal, 0)
    const tax = subtotal * (saleData.taxRate / 100)
    const total = subtotal + tax

    const sale: Sale = {
      id: generateId(),
      customerId: saleData.customerId,
      customerName: saleData.customerName,
      details: saleData.details.map((d) => ({ ...d, id: generateId() })),
      subtotal,
      tax,
      taxRate: saleData.taxRate,
      total,
      paymentMethod: saleData.paymentMethod,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // Update stock
    const updatedProducts = state.products.map((p) => {
      const detail = saleData.details.find((d) => d.productId === p.id)
      if (detail) {
        return { ...p, stock: Math.max(0, p.stock - detail.quantity) }
      }
      return p
    })

    // Update cash register if open and cash payment
    let updatedRegister = state.cashRegister
    if (updatedRegister?.status === "open" && saleData.paymentMethod === "cash") {
      const movement: CashMovement = {
        id: generateId(),
        registerId: updatedRegister.id,
        type: "income",
        amount: total,
        description: `Venta #${sale.id}`,
        reference: sale.id,
        createdAt: new Date().toISOString(),
      }
      updatedRegister = {
        ...updatedRegister,
        movements: [...updatedRegister.movements, movement],
        expectedAmount: updatedRegister.expectedAmount + total,
      }
    }

    // Update customer balance if credit
    let updatedCustomers = state.customers
    if (saleData.paymentMethod === "credit" && saleData.customerId) {
      updatedCustomers = state.customers.map((c) =>
        c.id === saleData.customerId ? { ...c, balance: c.balance + total } : c
      )
    }

    set({
      sales: [...state.sales, sale],
      products: updatedProducts,
      cashRegister: updatedRegister,
      customers: updatedCustomers,
    })

    return sale
  },

  // Purchase actions
  createPurchase: (purchaseData) => {
    const state = get()
    const subtotal = purchaseData.details.reduce((acc, d) => acc + d.subtotal, 0)
    const tax = subtotal * (state.config.taxRate / 100)
    const total = subtotal + tax

    const purchase: Purchase = {
      id: generateId(),
      supplierId: purchaseData.supplierId,
      supplierName: purchaseData.supplierName,
      details: purchaseData.details.map((d) => ({ ...d, id: generateId() })),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    }

    // Update stock
    const updatedProducts = state.products.map((p) => {
      const detail = purchaseData.details.find((d) => d.productId === p.id)
      if (detail) {
        return { ...p, stock: p.stock + detail.quantity }
      }
      return p
    })

    set({
      purchases: [...state.purchases, purchase],
      products: updatedProducts,
    })

    return purchase
  },

  // Cash register actions
  openCashRegister: (amount) =>
    set({
      cashRegister: {
        id: generateId(),
        openingAmount: amount,
        closingAmount: null,
        expectedAmount: amount,
        difference: null,
        status: "open",
        movements: [],
        openedAt: new Date().toISOString(),
        closedAt: null,
      },
    }),

  closeCashRegister: (closingAmount) =>
    set((state) => {
      if (!state.cashRegister) return state
      const totalIncome = state.cashRegister.movements
        .filter((m) => m.type === "income")
        .reduce((acc, m) => acc + m.amount, 0)
      const totalExpense = state.cashRegister.movements
        .filter((m) => m.type === "expense")
        .reduce((acc, m) => acc + m.amount, 0)
      const expectedAmount = state.cashRegister.openingAmount + totalIncome - totalExpense

      const closedRegister: CashRegister = {
        ...state.cashRegister,
        closingAmount,
        expectedAmount,
        difference: closingAmount - expectedAmount,
        status: "closed",
        closedAt: new Date().toISOString(),
      }
      return {
        cashRegister: null,
        cashHistory: [...state.cashHistory, closedRegister],
      }
    }),

  addCashMovement: (movement) =>
    set((state) => {
      if (!state.cashRegister) return state
      const newMovement: CashMovement = {
        ...movement,
        id: generateId(),
        registerId: state.cashRegister.id,
        createdAt: new Date().toISOString(),
      }
      const amountChange = movement.type === "income" ? movement.amount : -movement.amount
      return {
        cashRegister: {
          ...state.cashRegister,
          movements: [...state.cashRegister.movements, newMovement],
          expectedAmount: state.cashRegister.expectedAmount + amountChange,
        },
      }
    }),

  // Config actions
  updateConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
}))
