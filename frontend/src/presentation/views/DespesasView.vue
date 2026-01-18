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
      <Column field="descricao" header="Descricao" />
      <Column field="valorEstimado" header="Valor" />
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Nova despesa" :style="{ width: '100%', maxWidth: '38.33rem' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Dia do mes</span>
          <InputNumber v-model="form.dia" :min="1" :max="31" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Descricao</span>
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
import { onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import { listDespesas } from "../../application/usecases/list-despesas.js";
import { createDespesa } from "../../application/usecases/create-despesa.js";
import { despesasRepository } from "../../infra/repositories/despesas-repository.js";

const toast = useToast();
const despesas = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const form = reactive({
  dia: 1,
  descricao: "",
  valorEstimado: null
});

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
  resetForm();
  dialogVisible.value = true;
};

const submit = async () => {
  saving.value = true;
  try {
    const despesa = await createDespesa({ despesasRepository }, { ...form });
    despesas.value = [despesa, ...despesas.value];
    dialogVisible.value = false;
    toast.add({ severity: "success", summary: "Despesa criada", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

onMounted(fetchDespesas);
</script>
