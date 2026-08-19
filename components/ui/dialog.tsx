import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = ({ open = false, onOpenChange, children }: DialogProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onOpenChange: handleOpenChange,
              })
            }
            return child
          })}
        </div>
      )}
    </>
  )
}

interface DialogContentProps {
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  className?: string
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, onOpenChange, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-lg rounded-lg bg-white shadow-lg",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => onOpenChange?.(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      {children}
    </div>
  )
})
DialogContent.displayName = "DialogContent"

interface DialogHeaderProps {
  children?: React.ReactNode
  className?: string
}

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  DialogHeaderProps
>(({ children, className }, ref) => (
  <div ref={ref} className={cn("px-6 py-4 border-b", className)}>
    {children}
  </div>
))
DialogHeader.displayName = "DialogHeader"

interface DialogTitleProps {
  children?: React.ReactNode
  className?: string
}

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogTitleProps
>(({ children, className }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)}>
    {children}
  </h2>
))
DialogTitle.displayName = "DialogTitle"

interface DialogFooterProps {
  children?: React.ReactNode
  className?: string
}

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  DialogFooterProps
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-end gap-2 px-6 py-4 border-t",
      className
    )}
  >
    {children}
  </div>
))
DialogFooter.displayName = "DialogFooter"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }
