import { useRef } from 'react'
import { cn } from '../../lib/utils'

interface PhotoPickerProps {
  photo?: string
  fallback: string
  size?: 'lg' | 'xl'
  shape?: 'circle' | 'rounded'
  onChange: (dataUrl: string) => void
  className?: string
}

export function PhotoPicker({ photo, fallback, size = 'xl', shape = 'circle', onChange, className }: PhotoPickerProps) {
  const ref = useRef<HTMLInputElement>(null)

  const dim = size === 'xl' ? 'w-20 h-20' : 'w-14 h-14'
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl'

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onChange(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative cursor-pointer group" onClick={() => ref.current?.click()}>
        {photo ? (
          <img src={photo} alt="" className={cn(dim, radius, 'object-cover')} />
        ) : (
          <div className={cn(dim, radius, 'bg-brand-500 text-white font-bold flex items-center justify-center text-2xl select-none')}>
            {fallback}
          </div>
        )}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity',
          radius
        )}>
          <span className="text-white text-xl">📷</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="text-brand-500 text-sm font-semibold"
      >
        שנה תמונה
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
