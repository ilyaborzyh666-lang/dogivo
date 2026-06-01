import { cn } from '../../lib/utils'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }

function initials(name?: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return src ? (
    <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} />
  ) : (
    <div className={cn('rounded-full bg-brand-500 text-white font-bold flex items-center justify-center', sizes[size], className)}>
      {initials(name)}
    </div>
  )
}
