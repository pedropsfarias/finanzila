<template>
  <form
    @submit.prevent="handleLogin"
    :style="{ display: 'grid', gap: '1rem' }"
  >
    <Message v-if="error" severity="error" :closable="false">
      {{ error }}
    </Message>
    <div :style="{ display: 'grid', gap: '0.6rem' }">
      <span :style="{ fontWeight: '600' }">E-mail</span>
      <InputText v-model="email" type="email" placeholder="voce@finanzila.com" required />
    </div>
    <div :style="{ display: 'grid', gap: '0.6rem' }">
      <span :style="{ fontWeight: '600' }">Senha</span>
      <Password v-model="senha" :feedback="false" toggleMask required />
    </div>
    <Button
      type="submit"
      label="Entrar"
      icon="pi pi-lock"
      :loading="loading"
    />
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";
import { authService } from "../../infra/http/auth-service.js";

const router = useRouter();
const route = useRoute();
const email = ref("");
const senha = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    await authService.login({ email: email.value, senha: senha.value });
    const redirect = route.query.redirect ?? "/carteiras";
    router.replace(redirect);
  } catch (err) {
    error.value = err.message ?? "Falha ao autenticar.";
  } finally {
    loading.value = false;
  }
};
</script>
