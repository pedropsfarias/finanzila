<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Usuarios</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Cadastre acessos para o financeiro.
        </p>
      </div>
      <Button label="Novo usuario" icon="pi pi-plus" size="small" @click="openDialog" />
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
      <Column header="">
        <template #body="{ data }">
          <div :style="{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }">
            <Button icon="pi pi-pencil" size="small" text @click="openEditDialog(data)" />
            <Button icon="pi pi-trash" size="small" text severity="danger" @click="confirmRemove(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal :header="dialogTitle" :style="{ width: '100%', maxWidth: '40rem' }">
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
          <Password v-model="form.senha" :feedback="false" toggleMask :placeholder="passwordPlaceholder" />
        </div>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }">
          <Button label="Cancelar" text severity="secondary" size="small" @click="dialogVisible = false" />
          <Button label="Salvar" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { listUsers } from "../../application/usecases/list-users.js";
import { createUser } from "../../application/usecases/create-user.js";
import { updateUser } from "../../application/usecases/update-user.js";
import { deleteUser } from "../../application/usecases/delete-user.js";
import { usersRepository } from "../../infra/repositories/users-repository.js";

const toast = useToast();
const usuarios = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);
const form = reactive({
  name: "",
  email: "",
  senha: ""
});

const dialogTitle = computed(() => (editingId.value ? "Editar usuario" : "Novo usuario"));
const passwordPlaceholder = computed(() => (editingId.value ? "Deixe em branco para manter" : ""));

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
  editingId.value = null;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (row) => {
  editingId.value = row.id;
  form.name = row.name;
  form.email = row.email;
  form.senha = "";
  dialogVisible.value = true;
};

const submit = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      const usuario = await updateUser(
        { usersRepository },
        { id: editingId.value, ...form, senha: form.senha || null }
      );
      usuarios.value = usuarios.value.map((item) => (item.id === usuario.id ? usuario : item));
      toast.add({ severity: "success", summary: "Usuario atualizado", life: 2500 });
    } else {
      const usuario = await createUser({ usersRepository }, { ...form });
      usuarios.value = [usuario, ...usuarios.value];
      toast.add({ severity: "success", summary: "Usuario criado", life: 2500 });
    }
    dialogVisible.value = false;
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

const confirmRemove = async (row) => {
  if (!window.confirm("Deseja excluir este usuario?")) {
    return;
  }
  try {
    await deleteUser({ usersRepository }, row.id);
    usuarios.value = usuarios.value.filter((item) => item.id !== row.id);
    toast.add({ severity: "success", summary: "Usuario excluido", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao excluir.", life: 2500 });
  }
};

onMounted(fetchUsuarios);
</script>
