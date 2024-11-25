// src/stores/useCartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/app'
import { TOKEN } from '@/config'

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref([])
      
    const cartTotal = computed(() => {
        return cartItems.value.length > 0
            ? cartItems.value.reduce((total, item) => total + Number(item.total), 0)
            : 0
    })

    const cartQuantity = computed(() => {
        return cartItems.value.length > 0
            ? cartItems.value.reduce((total, item) => total + item.quantity, 0)
            : 0
    })

    // Cargar los productos del carrito desde la API
    const fetchCartItems = async () => {
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

    return {
        cartItems,
        cartTotal,
        cartQuantity,
        fetchCartItems,
        addToCart,
        updateQuantity,
        removeItem
    }
})
