export const PRODUCT_TYPE_OPTIONS = [
  { value: 'honey', label: 'عسل', icon: '🍯', badge: 'badge-warning' },
  { value: 'ghee', label: 'سمن عربي', icon: '🧈', badge: 'badge-neutral' },
] as const

export type ProductType = typeof PRODUCT_TYPE_OPTIONS[number]['value']

export const useProductTypes = () => {
  const find = (value: string) => PRODUCT_TYPE_OPTIONS.find(o => o.value === value)
  const typeLabel = (value: string) => find(value)?.label ?? value
  const typeBadge = (value: string) => find(value)?.badge ?? 'badge-neutral'
  return { options: PRODUCT_TYPE_OPTIONS, typeLabel, typeBadge }
}
