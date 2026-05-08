import { createApp } from 'vue';
import App from './App.vue';
import router from "@/router/index.js";

import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import {
    Button,
    Card,
    Tag,
    Divider,
    ProgressSpinner,
    Toast,
    ConfirmDialog,
    Tooltip, Dialog, Galleria
} from "primevue";

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}'
        }
    }
});

const app = createApp(App);

app
    .use(router)
    .use(ToastService)
    .use(ConfirmationService)
    .use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.my-app-dark',
                cssLayer: false,
            }
        }
    })

    .component('Button', Button)
    .component('Card', Card)
    .component('Tag', Tag)
    .component('Divider', Divider)
    .component('ProgressSpinner', ProgressSpinner)
    .component('Toast', Toast)
    .component('ConfirmDialog', ConfirmDialog)
    .component('Dialog', Dialog)
    .component('Galleria', Galleria)

    .directive('tooltip', Tooltip)

    .mount('#app')
