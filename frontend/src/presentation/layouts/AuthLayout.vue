<template>
  <div
    :style="{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '1.5rem',
      background:
        'radial-gradient(circle at top, var(--primary-50), var(--surface-0) 55%, var(--surface-100))'
    }"
  >
    <Card :style="{ width: '100%', maxWidth: '420px', borderRadius: '24px' }">
      <template #content>
        <div :style="{ display: 'grid', gap: '1.5rem' }">
          <div :style="{ display: 'grid', gap: '0.4rem' }">
            <span :style="{ fontSize: '1.4rem', fontWeight: '700' }">Bem-vindo de volta</span>
            <span :style="{ color: 'var(--text-color-secondary)' }">
              Acesse sua conta para continuar.
            </span>
          </div>
          <RouterView />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "primevue/card";
</script>
