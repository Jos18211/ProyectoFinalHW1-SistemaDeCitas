import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}


function SheetContent({ className, children, side = "right", ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex h-full w-3/4 max-w-xs flex-col gap-4 bg-background p-5 shadow-lg outline-none",
          "data-open:animate-in data-closed:animate-out",
          side === "right" &&
            "inset-y-0 right-0 border-l data-closed:slide-out-to-right data-open:slide-in-from-right",
          side === "left" &&
            "inset-y-0 left-0 border-r data-closed:slide-out-to-left data-open:slide-in-from-left",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close asChild>
          <Button variant="ghost" size="icon-sm" className="absolute top-3 right-3">
            <XIcon />
            <span className="sr-only">Cerrar</span>
          </Button>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1", className)} {...props} />
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle }
