<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }">
      <div>
        <h2 :style="{ margin: 0 }">Fluxo consolidado</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Gere o fluxo do mes e ajuste manualmente quando necessario.
        </p>
      </div>
      <div :style="{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }">
        <Calendar
          v-model="mesSelecionado"
          view="month"
          dateFormat="mm/yy"
          showIcon
          :style="{ minWidth: '10rem' }"
        />
        <Button label="Gerar fluxo" icon="pi pi-refresh" size="small" severity="secondary" @click="generate" />
        <Button label="Novo item" icon="pi pi-plus" size="small" @click="openDialog" />
      </div>
    </div>

    <DataTable
      :value="fluxos"
      responsiveLayout="scroll"
      :loading="loading"
      :emptyMessage="'Nenhum item consolidado.'"
    >
      <Column field="data" header="Data">
        <template #body="{ data }">
          {{ formatDate(data?.data) }}
        </template>
      </Column>
      <Column field="descricao" header="Descricao" />
      <Column field="valorEstimado" header="Valor estimado">
        <template #body="{ data }">
          {{ formatValor(data?.valorEstimado) }}
        </template>
      </Column>
      <Column field="dataPagamento" header="Data pagamento">
        <template #body="{ data }">
          {{ formatDate(data?.dataPagamento) }}
        </template>
      </Column>
      <Column field="valorPagamento" header="Valor pagamento">
        <template #body="{ data }">
          {{ formatValor(data?.valorPagamento) }}
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

    <Dialog v-model:visible="dialogVisible" modal :header="dialogTitle" :style="{ width: '100%', maxWidth: '42rem' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Data</span>
          <Calendar v-model="form.data" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Descricao</span>
          <InputText v-model="form.descricao" placeholder="Cartao" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Valor estimado</span>
          <InputNumber v-model="form.valorEstimado" mode="currency" currency="BRL" locale="pt-BR" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Data pagamento</span>
          <Calendar v-model="form.dataPagamento" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Valor pagamento</span>
          <InputNumber v-model="form.valorPagamento" mode="currency" currency="BRL" locale="pt-BR" />
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import { listFluxoConsolidado } from "../../application/usecases/list-fluxo-consolidado.js";
import { createFluxoConsolidado } from "../../application/usecases/create-fluxo-consolidado.js";
import { updateFluxoConsolidado } from "../../application/usecases/update-fluxo-consolidado.js";
import { deleteFluxoConsolidado } from "../../application/usecases/delete-fluxo-consolidado.js";
import { generateFluxoConsolidado } from "../../application/usecases/generate-fluxo-consolidado.js";
import { fluxoConsolidadoRepository } from "../../infra/repositories/fluxo-consolidado-repository.js";

const toast = useToast();
const fluxos = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);
const mesSelecionado = ref(new Date());
const form = reactive({
  mesReferencia: null,
  data: null,
  descricao: "",
  valorEstimado: null,
  dataPagamento: null,
  valorPagamento: null
});

const dialogTitle = computed(() => (editingId.value ? "Editar item" : "Novo item"));

const formatMesReferencia = (date) => {
  const base = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(base.getTime())) {
    return null;
  }
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear());
  return `${day}/${month}/${year}`;
};

const formatValor = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  let numericValue = value;
  if (typeof numericValue === "string") {
    const cleaned = numericValue.replace(/[R$\\s]/g, "");
    numericValue = cleaned.includes(",") ? cleaned.replace(/\\./g, "").replace(",", ".") : cleaned;
  }
  const parsed = Number(numericValue);
  if (Number.isNaN(parsed)) {
    return "-";
  }
  return `R$${parsed.toFixed(2).replace(".", ",")}`;
};

const parseFormDate = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    if (value.includes("T")) {
      return new Date(value);
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split("/");
      return new Date(`${year}-${month}-${day}T00:00:00`);
    }
  }
  return new Date(`${value}T00:00:00`);
};

const fetchFluxo = async () => {
  loading.value = true;
  try {
    fluxos.value = await listFluxoConsolidado(
      { fluxoConsolidadoRepository },
      { mesReferencia: formatMesReferencia(mesSelecionado.value) }
    );
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.mesReferencia = formatMesReferencia(mesSelecionado.value);
  form.data = null;
  form.descricao = "";
  form.valorEstimado = null;
  form.dataPagamento = null;
  form.valorPagamento = null;
};

const openDialog = () => {
  editingId.value = null;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (row) => {
  editingId.value = row.id;
  form.mesReferencia = row.mesReferencia;
  form.data = parseFormDate(row.data);
  form.descricao = row.descricao;
  form.valorEstimado = typeof row.valorEstimado === "string" ? Number(row.valorEstimado) : row.valorEstimado;
  form.dataPagamento = parseFormDate(row.dataPagamento);
  form.valorPagamento = typeof row.valorPagamento === "string" ? Number(row.valorPagamento) : row.valorPagamento;
  dialogVisible.value = true;
};

const submit = async () => {
  saving.value = true;
  try {
    const payload = {
      mesReferencia: form.mesReferencia ?? formatMesReferencia(mesSelecionado.value),
      data: form.data ? form.data.toISOString().slice(0, 10) : null,
      descricao: form.descricao,
      valorEstimado: form.valorEstimado,
      dataPagamento: form.dataPagamento ? form.dataPagamento.toISOString().slice(0, 10) : null,
      valorPagamento: form.valorPagamento
    };
    if (editingId.value) {
      const fluxo = await updateFluxoConsolidado(
        { fluxoConsolidadoRepository },
        { id: editingId.value, ...payload }
      );
      fluxos.value = fluxos.value.map((item) => (item.id === fluxo.id ? fluxo : item));
      toast.add({ severity: "success", summary: "Item atualizado", life: 2500 });
    } else {
      const fluxo = await createFluxoConsolidado({ fluxoConsolidadoRepository }, payload);
      fluxos.value = [...fluxos.value, fluxo];
      toast.add({ severity: "success", summary: "Item criado", life: 2500 });
    }
    dialogVisible.value = false;
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

const confirmRemove = async (row) => {
  if (!window.confirm("Deseja excluir este item?")) {
    return;
  }
  try {
    await deleteFluxoConsolidado({ fluxoConsolidadoRepository }, row.id);
    fluxos.value = fluxos.value.filter((item) => item.id !== row.id);
    toast.add({ severity: "success", summary: "Item excluido", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao excluir.", life: 2500 });
  }
};

const generate = async () => {
  const mesReferencia = formatMesReferencia(mesSelecionado.value);
  if (!mesReferencia) {
    toast.add({ severity: "error", summary: "Selecione o mes de referencia.", life: 2500 });
    return;
  }
  try {
    await generateFluxoConsolidado({ fluxoConsolidadoRepository }, { mesReferencia });
    await fetchFluxo();
    toast.add({ severity: "success", summary: "Fluxo consolidado gerado", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao gerar.", life: 2500 });
  }
};

watch(mesSelecionado, fetchFluxo);

onMounted(fetchFluxo);
</script>
