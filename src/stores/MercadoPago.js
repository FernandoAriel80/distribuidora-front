          
import { loadMercadoPago } from "@mercadopago/sdk-js";

loadMercadoPago();
export const mp = new MercadoPago('TEST-2307bb04-530a-4443-a20f-a7485cc97d5e',{ 
    locale: 'es-AR'
});

/* let mp; // Define `mp` en el ámbito global del módulo.

(async function initialize() {
  await loadMercadoPago();
  mp = new MercadoPago('TEST-2307bb04-530a-4443-a20f-a7485cc97d5e', { 
    locale: 'es-AR',
  });
})();

// Exporta `mp` para que esté disponible fuera del archivo.
export { mp }; */

