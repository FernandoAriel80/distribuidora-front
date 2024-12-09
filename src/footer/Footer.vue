<script setup>
import igLogo from '@/assets/icon/logotipo-de-instagram.png'
import faceLogo from '@/assets/icon/facebook.png'
import wsappLogo from '@/assets/icon/whatsapp.png'
</script>

<template>
    <footer class="bg-gray-100 mt-20">
        <div class="bg-gray-50 py-4 border-t border-gray-300">
            <div
                class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-4">
                <div>
                    <h4 class="text-lg font-semibold text-gray-700">Horarios de Atención</h4>
                    <p class="text-sm text-gray-600">Lunes a Viernes: 9:00 hs - 17:00 hs</p>
                    <p class="text-sm text-gray-600">Sábados: 9:00 hs - 13:00 hs</p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-gray-700">Contacto</h4>
                    <p class="text-sm text-gray-600">distribuidoraLV@gmail.com</p>
                    <p class="text-sm text-gray-600">1112345678</p>
                    <div class="flex">
                        <a href="#"><img :src="igLogo" alt="Logo" class="w-5 h-5 m-1" /></a>
                        <a href="#"><img :src="faceLogo" alt="Logo" class="w-5 h-5 m-1" /></a>
                        <a href="#"><img :src="wsappLogo" alt="Logo" class="w-5 h-5 m-1" /></a>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-gray-700">Asistencia</h4>

                    <p><a href="#" class="text-sm m-1 text-gray-600 hover:underline">Metodos de pago</a></p>
                    <p><a href="#" class="text-sm m-1 text-gray-600 hover:underline">Promociones</a></p>
                    <p><a href="#" class="text-sm m-1 text-gray-600 hover:underline">Ayuda</a></p>
                    <p><a href="#" class="text-sm m-1 text-gray-600 hover:underline">Cómo comprar</a></p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-gray-700">Dirección</h4>
                    <p class="text-sm text-gray-600">Av. Juan Manuel de Rosas 11000</p>
                    <p class="text-sm text-gray-600"> Gregorio de Laferrere, Argentina</p>
                </div>
            </div>
        </div>

        <div class="bg-gray-50 py-4">
            <div
                class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 px-4">
                <p class="text-sm text-gray-600">
                    &copy; 2024 Fernando Orellana. Todos los derechos reservados.
                </p>
                <div class="flex space-x-4">
                    <a href="#" class="text-sm text-gray-600 hover:underline">Términos y Condiciones</a>
                    <a href="#" class="text-sm text-gray-600 hover:underline">Política de Privacidad</a>
                </div>
            </div>
        </div>
    </footer>
</template>