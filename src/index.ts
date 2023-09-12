import { Manager, MCEvent } from '@managed-components/types'

export async function performClientFetch(event: MCEvent) {
  const { client, payload } = event
  if (payload.imgSrc) {
    await client.fetch(payload.imgSrc, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    })
  }
}
export default async function (manager: Manager) {
  manager.addEventListener('event', performClientFetch)
}
