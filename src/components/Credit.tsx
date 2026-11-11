import { CREDIT } from '@/content/site'

export function Credit({ className = '' }: { className?: string }) {
  return <p className={`credit ${className}`}>{CREDIT}</p>
}
