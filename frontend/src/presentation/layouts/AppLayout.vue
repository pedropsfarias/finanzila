<template>
  <div
    :style="{
      minHeight: '100vh',
      background:
        'linear-gradient(145deg, var(--primary-50), var(--surface-0) 50%, var(--surface-100))'
    }"
  >
    <Toast />
    <Toolbar :style="{ border: 'none', background: 'transparent', padding: '1rem 1rem 0' }">
      <template #start>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }">
          <span :style="{ fontSize: '1.2rem', fontWeight: '700' }">Finanzila</span>
          <span :style="{ fontSize: '0.85rem', color: 'var(--text-color-secondary)' }">
            Controle financeiro com foco no essencial
          </span>
        </div>
      </template>
      <template #end>
        <Button
          icon="pi pi-sign-out"
          label="Sair"
          text
          severity="secondary"
          size="small"
          @click="handleLogout"
        />
      </template>
    </Toolbar>
    <div :style="{ padding: '0 1rem 1.5rem', display: 'grid', gap: '1rem' }">
      <TabMenu :model="items" :activeIndex="activeIndex" @tab-change="handleTabChange" />
      <Card :style="{ borderRadius: '1.67rem' }">
        <template #content>
          <RouterView />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import TabMenu from "primevue/tabmenu";
import Card from "primevue/card";
import Toast from "primevue/toast";
import { authService } from "../../infra/http/auth-service.js";

const router = useRouter();
const route = useRoute();

const items = ref([
  { label: "Carteiras", icon: "pi pi-wallet", to: "/carteiras" },
  { label: "Despesas", icon: "pi pi-calendar", to: "/despesas" },
  { label: "Fluxo", icon: "pi pi-chart-line", to: "/fluxo-caixa" },
  { label: "Consolidado", icon: "pi pi-chart-bar", to: "/fluxo-consolidado" },
  { label: "Usuarios", icon: "pi pi-users", to: "/usuarios" }
]);

const activeIndex = computed(() => {
  const index = items.value.findIndex((item) => item.to === route.path);
  return index === -1 ? 0 : index;
});

const handleTabChange = ({ index }) => {
  const item = items.value[index];
  if (item?.to) {
    router.push(item.to);
  }
};

const handleLogout = () => {
  authService.logout();
  router.push({ name: "login" });
};
</script>
