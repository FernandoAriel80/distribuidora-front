// src/stores/useCartStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/app'
import { TOKEN } from '@/config'

export const useCartStore = defineStore('cart', () => {
    const formattedItems = ref([]);
    const cartItems = ref([]);
    const cartTotal = ref(0);
    const cartQuantity = ref(0);

    // Cargar los productos del carrito desde la API
    const fetchCartItems = async () => {
        try {
            const response = await api.get('/api/cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            });
            cartItems.value = response.data.items || [];
            formattedItems.value = response.data.formattedItems || []; 
            cartTotal.value = response.data.total;
            cartQuantity.value = response.data.quantity;
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
    };
  
    // Agregar un producto al carrito
    const addToCart = async (productId, typePrice, quantity = 1) => {
        const addedItem = cartItems.value.find(item => item.product.id === productId && item.type_price === typePrice);
        let validate = 0;
        if (addedItem) {
            validate = addedItem.quantity + quantity;
        } else {
            validate = quantity;
        }
        try {
            const response = await api.post('/api/cart/create', {
                product_id: productId,
                type_price: typePrice,
                quantity: validate
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            })
            cartItems.value = response.data.items || []
            console.log(response.data)
        } catch (error) {
            console.error('Error al agregar al carrito:', error)
        }
    }

    // Actualizar la cantidad de un producto
    const updateQuantity = async (item, newQuantity, typePrice) => {
        const verifica = newQuantity < 1 ? 1 : newQuantity;
        try {
            const response = await api.post('/api/cart/create', {
                product_id: item.product.id,
                type_price: typePrice,
                quantity: verifica
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            })
            console.log(response.data)
            fetchCartItems()
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error)
        }
    }

    // Eliminar un producto del carrito
    const removeItem = async (item) => {
        try {
            await api.delete('/api/cart/' + item.id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            })
            fetchCartItems()
        } catch (error) {
            console.error('Error al eliminar el producto:', error)
        }
    }
       // Eliminar del carrito
    const removeAllCart = async (id) => {
        try {
            await api.delete('/api/cart/all/'+id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            })
            fetchCartItems()
        } catch (error) {
            console.error('Error al eliminar el carrito:', error)
        }    
    }

    const removeAllCartOnline = async () => {
        try {
            await api.post('/api/cart/all/online', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            })
            fetchCartItems()
        } catch (error) {
            console.error('Error al eliminar el carrito:', error)
        }    
    }

    return {
        cartItems,
        cartTotal,
        cartQuantity,
        formattedItems,
        fetchCartItems,
        addToCart,
        updateQuantity,
        removeItem,
        removeAllCart,
        removeAllCartOnline
    }
})
