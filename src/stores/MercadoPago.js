          
import { loadMercadoPago } from "@mercadopago/sdk-js";

/* await loadMercadoPago();
export const mp = new MercadoPago('TEST-2307bb04-530a-4443-a20f-a7485cc97d5e',{ 
    locale: 'es-AR'
}); */

(async function initialize() {
    await loadMercadoPago();
    const mp = new MercadoPago('TEST-2307bb04-530a-4443-a20f-a7485cc97d5e', { 
      locale: 'es-AR',
    });
  })();
