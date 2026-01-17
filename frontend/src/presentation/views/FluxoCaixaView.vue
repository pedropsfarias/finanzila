<template>
  <div :style="{ display: 'grid', gap: '1.5rem' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div>
        <h2 :style="{ margin: 0 }">Fluxo de caixa</h2>
        <p :style="{ margin: 0, color: 'var(--text-color-secondary)' }">
          Registre entradas e saidas por carteira.
        </p>
      </div>
      <Button label="Novo lancamento" icon="pi pi-plus" @click="openDialog" />
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

    <Dialog v-model:visible="dialogVisible" modal header="Novo lancamento" :style="{ width: '100%', maxWidth: '480px' }">
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
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { listFluxoCaixa } from "../../application/usecases/list-fluxo-caixa.js";
import { createFluxoCaixa } from "../../application/usecases/create-fluxo-caixa.js";
import { listCarteiras } from "../../application/usecases/list-carteiras.js";
import { fluxoCaixaRepository } from "../../infra/repositories/fluxo-caixa-repository.js";
import { carteirasRepository } from "../../infra/repositories/carteiras-repository.js";

const toast = useToast();
const fluxos = ref([]);
const carteiras = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
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

onMounted(async () => {
  await Promise.all([fetchCarteiras(), fetchFluxos()]);
});
</script>
