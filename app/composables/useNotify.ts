export const useNotify = () => {
  const notifications = useState<Array<{id: number, message: string, type: string}>>('notifications', () => [])
  
  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 3000)
  }
  
  return { notifications, notify }
}