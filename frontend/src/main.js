import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./router/index.js";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./assets/base.css";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);

app.mount("#app");
