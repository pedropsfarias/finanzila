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
      <Column field="diaFechamento" header="Fechamento" />
      <Column field="diaPagamento" header="Pagamento" />
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Nova carteira" :style="{ width: '100%', maxWidth: '38.33rem' }">
      <div :style="{ display: 'grid', gap: '1rem' }">
        <div :style="{ display: 'grid', gap: '0.5rem' }">
          <span>Nome</span>
          <InputText v-model="form.nome" placeholder="Cartao principal" />
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
import { onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import { listCarteiras } from "../../application/usecases/list-carteiras.js";
import { createCarteira } from "../../application/usecases/create-carteira.js";
import { carteirasRepository } from "../../infra/repositories/carteiras-repository.js";

const toast = useToast();
const carteiras = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const form = reactive({
  nome: "",
  diaFechamento: 1,
  diaPagamento: 1
});

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
  form.diaFechamento = 1;
  form.diaPagamento = 1;
};

const openDialog = () => {
  resetForm();
  dialogVisible.value = true;
};

const submit = async () => {
  saving.value = true;
  try {
    const carteira = await createCarteira({ carteirasRepository }, { ...form });
    carteiras.value = [carteira, ...carteiras.value];
    dialogVisible.value = false;
    toast.add({ severity: "success", summary: "Carteira criada", life: 2500 });
  } catch (err) {
    toast.add({ severity: "error", summary: err.message ?? "Falha ao salvar.", life: 2500 });
  } finally {
    saving.value = false;
  }
};

onMounted(fetchCarteiras);
</script>
