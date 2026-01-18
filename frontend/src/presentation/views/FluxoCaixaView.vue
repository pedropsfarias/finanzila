<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Fluxo de caixa</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Registre entradas e saidas por carteira.
        </p>
      </div>
      <div :style="{ display: 'flex', gap: '0.5rem' }">
        <Button label="Importar xlsx" icon="pi pi-upload" size="small" severity="secondary" @click="openImportDialog" />
        <Button label="Novo lancamento" icon="pi pi-plus" size="small" @click="openDialog" />
      </div>
    </div>

    <DataTable
      :value="fluxos"
      responsiveLayout="scroll"
      :loading="loading"
      :emptyMessage="'Nenhum lancamento encontrado.'"
    >
      <Column header="Data" :body="formatDate" />
      <Column field="descricao" header="Descricao" />
      <Column header="Carteira" :body="formatCarteira" />
      <Column field="parcela" header="Parcela" />
      <Column field="valor" header="Valor" />
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Novo lancamento" :style="{ width: '100%', maxWidth: '40rem' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Data</span>
          <Calendar v-model="form.data" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Descricao</span>
          <InputText v-model="form.descricao" placeholder="Mercado" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Carteira</span>
          <Dropdown
            v-model="form.carteiraId"
            :options="carteiras"
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione a carteira"
          />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Parcela</span>
          <InputText v-model="form.parcela" placeholder="2/10" />
        </div>
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Valor</span>
          <InputNumber v-model="form.valor" mode="currency" currency="BRL" locale="pt-BR" />
        </div>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }">
          <Button label="Cancelar" text severity="secondary" size="small" @click="dialogVisible = false" />
          <Button label="Salvar" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
        </div>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="importDialogVisible"
      modal
      header="Importar fluxo de caixa"
      :style="{ width: '100%', maxWidth: '36rem' }"
    >
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Arquivo (.xlsx)</span>
          <input type="file" accept=".xlsx" @change="handleFileChange" />
          <small v-if="importFile" :style="{ color: 'var(--text-color-secondary)' }">
            Selecionado: {{ importFile.name }}
          </small>
        </div>
        <div v-if="importSummary" :style="{ display: 'grid', gap: '0.35rem' }">
          <strong>Resumo</strong>
          <span>Registros: {{ importSummary.totalRegistros }}</span>
          <span>Importados: {{ importSummary.importados }}</span>
          <span>Carteiras criadas: {{ importSummary.carteirasCriadas }}</span>
          <span>Repetidos: {{ importSummary.repetidos?.length ?? 0 }}</span>
          <span>Ignorados: {{ importSummary.ignorados?.length ?? 0 }}</span>
          <div v-if="importSummary.repetidos?.length" :style="{ marginTop: '0.5rem' }">
            <strong>Repetidos (primeiros 10)</strong>
            <ul :style="{ paddingLeft: '1rem', margin: '0.25rem 0 0' }">
              <li v-for="item in importSummary.repetidos.slice(0, 10)" :key="item.linha">
                {{ item.data }} | {{ item.descricao }} | {{ item.conta || item.cartaoCredito || '-' }} | {{ item.valor }}
              </li>
            </ul>
          </div>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }">
          <Button label="Fechar" text severity="secondary" size="small" @click="importDialogVisible = false" />
          <Button label="Importar" icon="pi pi-upload" size="small" :loading="importing" @click="submitImport" />
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
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { listFluxoCaixa } from "../../application/usecases/list-fluxo-caixa.js";
import { createFluxoCaixa } from "../../application/usecases/create-fluxo-caixa.js";
import { importFluxoCaixa } from "../../application/usecases/import-fluxo-caixa.js";
import { listCarteiras } from "../../application/usecases/list-carteiras.js";
import { fluxoCaixaRepository } from "../../infra/repositories/fluxo-caixa-repository.js";
import { carteirasRepository } from "../../infra/repositories/carteiras-repository.js";

const toast = useToast();
const fluxos = ref([]);
const carteiras = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const importing = ref(false);
const importFile = ref(null);
const importSummary = ref(null);
const form = reactive({
  data: null,
  descricao: "",
  valor: null,
  parcela: "",
  carteiraId: null
});

const fetchFluxos = async () => {
  loading.value = true;
  try {
    fluxos.value = await listFluxoCaixa({ fluxoCaixaRepository });
  } finally {
    loading.value = false;
  }
};

const fetchCarteiras = async () => {
  carteiras.value = await listCarteiras({ carteirasRepository });
};

const resetForm = () => {
  form.data = null;
  form.descricao = "";
  form.valor = null;
  form.parcela = "";
  form.carteiraId = null;
};

const openDialog = () => {
  resetForm();
  dialogVisible.value = true;
};

const openImportDialog = () => {
  importFile.value = null;
  importSummary.value = null;
  importDialogVisible.value = true;
};

const handleFileChange = (event) => {
  importFile.value = event.target.files?.[0] ?? null;
};

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });

const formatDate = (row) => {
  if (!row.data) {
    return "";
  }
  return new Date(row.data).toLocaleDateString("pt-BR");
};

const formatCarteira = (row) => {
  const carteira = carteiras.value.find((item) => item.id === row.carteiraId);
  return carteira ? carteira.nome : row.carteiraId;
};

const submit = async () => {
  saving.value = true;
  try {
    const payload = {
      data: form.data ? form.data.toISOString().slice(0, 10) : null,
      descricao: form.descricao,
      valor: form.valor,
      parcela: form.parcela || null,
      carteiraId: form.carteiraId
    };
    const fluxo = await createFluxoCaixa({ fluxoCaixaRepository }, payload);
    fluxos.value = [fluxo, ...fluxos.value];
    dialogVisible.value = false;
    toast.add({ severity: "success", summary: "Lancamento criado", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

const submitImport = async () => {
  if (!importFile.value) {
    toast.add({ severity: "error", summary: "Selecione um arquivo .xlsx.", life: 2500 });
    return;
  }
  importing.value = true;
  try {
    const contentBase64 = await readFileAsBase64(importFile.value);
    importSummary.value = await importFluxoCaixa({ fluxoCaixaRepository }, {
      fileName: importFile.value.name,
      contentBase64
    });
    await fetchFluxos();
    toast.add({ severity: "success", summary: "Importacao concluida", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao importar.", life: 2500 });
  } finally {
    importing.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchCarteiras(), fetchFluxos()]);
});
</script>
