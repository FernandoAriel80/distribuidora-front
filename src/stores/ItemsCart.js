import api from '@/app'
import { ref } from 'vue';
import { TOKEN } from '@/config'

export const itemsFilter = ref([]);
const cartItems = ref([])
 // Cargar los productos del carrito desde la API
 export const fetchCartItems = async () => {
    try {
        const response = await api.get('/api/cart', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
            }
        })
        cartItems.value = response.data.items || []
    } catch (error) {
        console.error('Error al cargar el carrito:', error)
    }
}

// Formatear los items del carrito
export const formatItems = () => {
    const formattedItems = cartItems.value.map((item) => {
        let unitPrice = 0;

        if (item.product.type_id === 1) {
            unitPrice = item.type_price === 'unit'
                ? item.product.unit_price
                : item.product.bulk_unit_price;
        } else if (item.product.type_id === 2) {
            unitPrice = item.product.unit_price;
        }

        return {
            id: item.id,
            title: item.product.name,
            quantity: item.quantity,
            unit_price: unitPrice
        };
    });

    // Asignar los items formateados a la variable reactiva
    itemsFilter.value = formattedItems;
    //console.log(items.value); // Mostrar los items formateados en consola
};