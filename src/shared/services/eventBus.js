import { reactive } from 'vue';

export const eventBus = reactive({
    emit(event, data) {
        this[event] = data;
    },
    galleryToggleTicket: 0
});