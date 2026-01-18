# Finanzila

Sistema web para controle financeiro com fluxo de caixa, carteiras e despesas recorrentes.
Frontend em Vue 3 + PrimeVue e backend em Node.js com PostgreSQL.

## Como funciona

- **Carteiras**: representam contas e cartoes de credito. Cada carteira tem nome, aliases e dias de fechamento/pagamento.
- **Fluxo de caixa**: registra entradas e saidas por carteira (data, descricao, valor, parcela).
- **Despesas**: cadastro de despesas recorrentes por dia do mes.
- **Autenticacao**: JWT com expiração de 1 hora. O frontend guarda `token` e `expiresAt` no `localStorage`.

## Estrutura

- `frontend/`: Vue 3 + PrimeVue (`lara-light-blue`), layouts e views.
- `backend/`: API REST, use cases e repositorios, migrations e seeds.

## Configuracao

Backend:
1. Copie `backend/.env.example` para `backend/.env`.
2. Ajuste `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN`.
3. Rode as migrations com `npm run migrate` dentro de `backend/`.

Frontend:
1. Copie `frontend/.env.example` para `frontend/.env` se necessario.
2. Ajuste a base da API no arquivo correspondente, se aplicavel.

## CLI de importacao

Existe um CLI para importar o fluxo de caixa a partir de planilhas no formato de `fluxos.xlsx`.
Ele cria carteiras automaticamente quando nao existem, faz o bind por nome/alias e ignora registros repetidos.

Uso:
```bash
cd backend
npm run import:fluxo-caixa -- ../fluxos.xlsx
```

Ao finalizar, o CLI imprime um resumo com total de registros, quantos foram importados, quantas carteiras foram criadas
e quais registros foram identificados como repetidos.
