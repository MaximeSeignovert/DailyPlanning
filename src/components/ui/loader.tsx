import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loader({ 
  variant = "spinner", 
  size = "md", 
  text = "Chargement...",
  className 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <span className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className="flex space-x-1">
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "0ms" }} />
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "150ms" }} />
          <div className={cn("rounded-full bg-primary animate-bounce", sizeClasses[size])} style={{ animationDelay: "300ms" }} />
        </div>
        {text && (
          <span className={cn("text-muted-foreground ml-2", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className={cn("rounded-full bg-primary animate-pulse", sizeClasses[size])} />
        {text && (
          <span className={cn("text-muted-foreground animate-pulse", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="animate-pulse rounded-md bg-primary/10 h-4 w-3/4" />
        <div className="animate-pulse rounded-md bg-primary/10 h-4 w-1/2" />
        {text && (
          <span className={cn("text-muted-foreground text-center block", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    )
  }

  return null
}

// Composant pour les pages entières
export function PageLoader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader variant="spinner" size="lg" text={text} />
    </div>
  )
}

// Composant pour les sections
export function SectionLoader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader variant="spinner" size="md" text={text} />
    </div>
  )
}

// Composant inline
export function InlineLoader({ text }: { text?: string }) {
  return (
    <Loader variant="spinner" size="sm" text={text} className="inline-flex" />
  )
} 