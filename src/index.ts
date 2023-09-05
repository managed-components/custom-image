import { Manager, MCEvent } from '@managed-components/types'

async function performClientFetch(event: MCEvent) {
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
  manager.addEventListener('pageview', async event => {
    await performClientFetch(event)
  })
  manager.addEventListener('event', async event => {
    await performClientFetch(event)
  })
}
