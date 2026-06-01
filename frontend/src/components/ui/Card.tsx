import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export function Card({ children, padded = true, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl shadow-sm border border-orange-100',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
