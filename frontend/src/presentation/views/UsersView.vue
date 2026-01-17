<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Usuarios</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Cadastre acessos para o financeiro.
        </p>
      </div>
      <Button label="Novo usuario" icon="pi pi-plus" @click="openDialog" />
    </div>

    <DataTable
      :value="usuarios"
      responsiveLayout="scroll"
      :loading="loading"
      :emptyMessage="'Nenhum usuario encontrado.'"
    >
      <Column field="name" header="Nome" />
      <Column field="email" header="E-mail" />
      <Column field="criadoEm" header="Criado" />
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Novo usuario" :style="{ width: '100%', maxWidth: '480px' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Nome</span>
          <InputText v-model="form.name" placeholder="Nome completo" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>E-mail</span>
          <InputText v-model="form.email" type="email" placeholder="email@finanzila.com" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Senha</span>
          <Password v-model="form.senha" :feedback="false" toggleMask />
        </div>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }">
          <Button label="Cancelar" text severity="secondary" @click="dialogVisible = false" />
          <Button label="Salvar" icon="pi pi-check" :loading="saving" @click="submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { listUsers } from "../../application/usecases/list-users.js";
import { createUser } from "../../application/usecases/create-user.js";
import { usersRepository } from "../../infra/repositories/users-repository.js";

const toast = useToast();
const usuarios = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const form = reactive({
  name: "",
  email: "",
  senha: ""
});

const fetchUsuarios = async () => {
  loading.value = true;
  try {
    usuarios.value = await listUsers({ usersRepository });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.senha = "";
};

const openDialog = () => {
  resetForm();
  dialogVisible.value = true;
};

const submit = async () => {
  saving.value = true;
  try {
    const usuario = await createUser({ usersRepository }, { ...form });
    usuarios.value = [usuario, ...usuarios.value];
    dialogVisible.value = false;
    toast.add({ severity: "success", summary: "Usuario criado", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

onMounted(fetchUsuarios);
</script>
