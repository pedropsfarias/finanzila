import { createRouter, createWebHistory } from "vue-router";
import { authStorage } from "../infra/http/auth-storage.js";
import AppLayout from "../presentation/layouts/AppLayout.vue";
import AuthLayout from "../presentation/layouts/AuthLayout.vue";
import LoginView from "../presentation/views/LoginView.vue";
import UsersView from "../presentation/views/UsersView.vue";
import CarteirasView from "../presentation/views/CarteirasView.vue";
import DespesasView from "../presentation/views/DespesasView.vue";
import FluxoCaixaView from "../presentation/views/FluxoCaixaView.vue";
import FluxoConsolidadoView from "../presentation/views/FluxoConsolidadoView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: AuthLayout,
      children: [{ path: "", name: "login", component: LoginView }],
      meta: { public: true }
    },
    {
      path: "/",
      component: AppLayout,
      children: [
        { path: "", redirect: "/carteiras" },
        { path: "carteiras", name: "carteiras", component: CarteirasView },
        { path: "despesas", name: "despesas", component: DespesasView },
        { path: "fluxo-caixa", name: "fluxoCaixa", component: FluxoCaixaView },
        { path: "fluxo-consolidado", name: "fluxoConsolidado", component: FluxoConsolidadoView },
        { path: "usuarios", name: "usuarios", component: UsersView }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const isPublic = to.meta.public === true;
  const isAuthenticated = authStorage.isTokenValid();

  if (!isPublic && !isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.name === "login" && isAuthenticated) {
    return { name: "carteiras" };
  }

  return true;
});

export default router;
