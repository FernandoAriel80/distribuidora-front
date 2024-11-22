import { ref } from 'vue';

export const messageAlert = ref('');

export const showMessage = (message) =>{
    messageAlert.value = message;
    setTimeout(() => {
        messageAlert.value = '';
    }, 3000);
}