"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventario": "Inventario",
  "/ventas": "Ventas",
  "/ventas/nueva": "Nueva Venta",
  "/compras": "Compras",
  "/compras/nueva": "Nueva Compra",
  "/caja": "Caja",
  "/clientes": "Clientes",
  "/reportes": "Reportes",
  "/configuracion": "Configuracion",
}

export function AppNavbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Ferreteria"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
