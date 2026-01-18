<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Carteiras</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Organize os ciclos de pagamento e fechamento.
        </p>
      </div>
      <Button label="Nova carteira" icon="pi pi-plus" size="small" @click="openDialog" />
    </div>

    <DataTable
      :value="carteiras"
      responsiveLayout="scroll"
      :loading="loading"
      :emptyMessage="'Nenhuma carteira cadastrada.'"
    >
      <Column field="nome" header="Nome" />
      <Column header="Apelidos">
        <template #body="{ data }">
          {{ formatAliases(data) }}
        </template>
      </Column>
      <Column field="diaFechamento" header="Fechamento" />
      <Column field="diaPagamento" header="Pagamento" />
      <Column header="">
        <template #body="{ data }">
          <div :style="{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }">
            <Button icon="pi pi-pencil" size="small" text @click="openEditDialog(data)" />
            <Button icon="pi pi-trash" size="small" text severity="danger" @click="confirmRemove(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal :header="dialogTitle" :style="{ width: '100%', maxWidth: '38.33rem' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Nome</span>
          <InputText v-model="form.nome" placeholder="Cartao principal" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Aliases</span>
          <InputText v-model="form.aliases" placeholder="Cartao pessoal, Nubank" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Dia de fechamento</span>
          <InputNumber v-model="form.diaFechamento" :min="1" :max="31" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Dia de pagamento</span>
          <InputNumber v-model="form.diaPagamento" :min="1" :max="31" />
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
import InputNumber from "primevue/inputnumber";
import { listCarteiras } from "../../application/usecases/list-carteiras.js";
import { createCarteira } from "../../application/usecases/create-carteira.js";
import { updateCarteira } from "../../application/usecases/update-carteira.js";
import { deleteCarteira } from "../../application/usecases/delete-carteira.js";
import { carteirasRepository } from "../../infra/repositories/carteiras-repository.js";

const toast = useToast();
const carteiras = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);
const form = reactive({
  nome: "",
  aliases: "",
  diaFechamento: 1,
  diaPagamento: 1
});

const dialogTitle = computed(() => (editingId.value ? "Editar carteira" : "Nova carteira"));

const fetchCarteiras = async () => {
  loading.value = true;
  try {
    carteiras.value = await listCarteiras({ carteirasRepository });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.nome = "";
  form.aliases = "";
  form.diaFechamento = 1;
  form.diaPagamento = 1;
};

const openDialog = () => {
  editingId.value = null;
  resetForm();
  dialogVisible.value = true;
};

const parseAliases = (aliases) => {
  if (!aliases) {
    return [];
  }
  if (Array.isArray(aliases)) {
    return aliases;
  }
  if (typeof aliases === "string") {
    const trimmed = aliases.trim();
    if (!trimmed) {
      return [];
    }
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1);
      if (!inner) {
        return [];
      }
      return inner.split(",").map((alias) => alias.trim()).filter(Boolean);
    }
    return trimmed.split(",").map((alias) => alias.trim()).filter(Boolean);
  }
  return [];
};

const openEditDialog = (row) => {
  editingId.value = row.id;
  form.nome = row.nome;
  const aliases = parseAliases(row.aliases);
  form.aliases = aliases.length ? aliases.join(", ") : "";
  form.diaFechamento = row.diaFechamento;
  form.diaPagamento = row.diaPagamento;
  dialogVisible.value = true;
};

const normalizeAliases = (aliases) => parseAliases(aliases);

const submit = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      const carteira = await updateCarteira(
        { carteirasRepository },
        {
          id: editingId.value,
          ...form,
          aliases: normalizeAliases(form.aliases)
        }
      );
      carteiras.value = carteiras.value.map((item) => (item.id === carteira.id ? carteira : item));
      toast.add({ severity: "success", summary: "Carteira atualizada", life: 2500 });
    } else {
      const carteira = await createCarteira({ carteirasRepository }, {
        ...form,
        aliases: normalizeAliases(form.aliases)
      });
      carteiras.value = [carteira, ...carteiras.value];
      toast.add({ severity: "success", summary: "Carteira criada", life: 2500 });
    }
    dialogVisible.value = false;
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

const confirmRemove = async (row) => {
  if (!window.confirm("Deseja excluir esta carteira?")) {
    return;
  }
  try {
    await deleteCarteira({ carteirasRepository }, row.id);
    carteiras.value = carteiras.value.filter((item) => item.id !== row.id);
    toast.add({ severity: "success", summary: "Carteira excluida", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao excluir.", life: 2500 });
  }
};

onMounted(fetchCarteiras);

const formatAliases = (row) => {
  const aliases = parseAliases(row.aliases);
  return aliases.length ? aliases.join(", ") : "-";
};
</script>
