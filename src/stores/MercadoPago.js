          
import { loadMercadoPago } from "@mercadopago/sdk-js";

let mp; 


(async function initialize() {
  await loadMercadoPago();
  mp = new MercadoPago('TEST-2307bb04-530a-4443-a20f-a7485cc97d5e', { 
    locale: 'es-AR',
  });
})();


export { mp };