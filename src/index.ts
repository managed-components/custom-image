import { Manager, MCEvent } from '@managed-components/types'

export async function performClientFetch(event: MCEvent) {
  const { client, payload } = event
  if (!payload.imgSrc) {
    console.error('No imgSrc provided in payload')
    return
  }

  if (!['true', true].includes(payload.useImgTag)) {
    client.fetch(payload.imgSrc, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    })
    return
  } else {
    const imgSrc: string = payload.imgSrc
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')

    client.execute(`
    (function() {
      function addPixel() {
        const img = new Image(1, 1);
        img.style.display = 'none';
        img.referrerPolicy = 'unsafe-url';
        img.decoding = 'async';

        let cleaned = false;
        const cleanup = () => {
          if (!cleaned) {
            cleaned = true;
            try {
              if (document.body.contains(img)) {
                document.body.removeChild(img);
              }
            } catch (_) {}
          }
        };

        img.onload = img.onerror = cleanup;
        setTimeout(cleanup, 10000);

        img.src = "${imgSrc}";
        if (document.body) {
          document.body.appendChild(img);
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(img);
          });
        }
      }

      function start() {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(addPixel, { timeout: 3000 });
        } else {
          setTimeout(addPixel, 300);
        }
      }

      if (document.readyState === 'complete') {
        start();
      } else {
        window.addEventListener('load', start);
      }
    })();
  `)
  }
}

export default async function (manager: Manager) {
  manager.addEventListener('event', performClientFetch)
}
