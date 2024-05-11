import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";
import { router } from "./router";

createApp(App).use(PrimeVue).use(router).mount("#app");
