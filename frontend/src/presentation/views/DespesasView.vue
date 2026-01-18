<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Despesas</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Acompanhe despesas previstas por dia.
        </p>
      </div>
      <Button label="Nova despesa" icon="pi pi-plus" size="small" @click="openDialog" />
    </div>

    <DataTable
      :value="despesas"
      responsiveLayout="scroll"
      :loading="loading"
      :emptyMessage="'Nenhuma despesa cadastrada.'"
    >
      <Column field="dia" header="Dia" />
      <Column field="descricao" header="Descrição" />
      <Column field="valorEstimado" header="Valor">
        <template #body="{ data }">
          {{ formatValor(data?.valorEstimado) }}
        </template>
      </Column>
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
          <span>Dia do mes</span>
          <InputNumber v-model="form.dia" :min="1" :max="31" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Descrição</span>
          <InputText v-model="form.descricao" placeholder="Academia" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Valor estimado</span>
          <InputNumber v-model="form.valorEstimado" mode="currency" currency="BRL" locale="pt-BR" />
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
import { listDespesas } from "../../application/usecases/list-despesas.js";
import { createDespesa } from "../../application/usecases/create-despesa.js";
import { updateDespesa } from "../../application/usecases/update-despesa.js";
import { deleteDespesa } from "../../application/usecases/delete-despesa.js";
import { despesasRepository } from "../../infra/repositories/despesas-repository.js";

const toast = useToast();
const despesas = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);
const form = reactive({
  dia: 1,
  descricao: "",
  valorEstimado: null
});

const dialogTitle = computed(() => (editingId.value ? "Editar despesa" : "Nova despesa"));

const fetchDespesas = async () => {
  loading.value = true;
  try {
    despesas.value = await listDespesas({ despesasRepository });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.dia = 1;
  form.descricao = "";
  form.valorEstimado = null;
};

const openDialog = () => {
  editingId.value = null;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (row) => {
  editingId.value = row.id;
  form.dia = row.dia;
  form.descricao = row.descricao;
  form.valorEstimado = row.valorEstimado;
  dialogVisible.value = true;
};

const formatValor = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  let numericValue = value;
  if (typeof numericValue === "string") {
    const cleaned = numericValue.replace(/[R$\s]/g, "");
    numericValue = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  }
  const parsed = Number(numericValue);
  if (Number.isNaN(parsed)) {
    return "-";
  }
  return `R$${parsed.toFixed(2).replace(".", ",")}`;
};

const submit = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      const despesa = await updateDespesa(
        { despesasRepository },
        { id: editingId.value, ...form }
      );
      despesas.value = despesas.value.map((item) => (item.id === despesa.id ? despesa : item));
      toast.add({ severity: "success", summary: "Despesa atualizada", life: 2500 });
    } else {
      const despesa = await createDespesa({ despesasRepository }, { ...form });
      despesas.value = [despesa, ...despesas.value];
      toast.add({ severity: "success", summary: "Despesa criada", life: 2500 });
    }
    dialogVisible.value = false;
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

const confirmRemove = async (row) => {
  if (!window.confirm("Deseja excluir esta despesa?")) {
    return;
  }
  try {
    await deleteDespesa({ despesasRepository }, row.id);
    despesas.value = despesas.value.filter((item) => item.id !== row.id);
    toast.add({ severity: "success", summary: "Despesa excluida", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao excluir.", life: 2500 });
  }
};

onMounted(fetchDespesas);
</script>
