import { cn } from '../../lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' }

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('font-display font-black flex items-center gap-1 select-none', sizes[size], className)}>
      <span className="text-brand-500">🐾</span>
      <span className="text-gray-900">Dogi</span>
      <span className="text-brand-500">vo</span>
    </div>
  )
}
