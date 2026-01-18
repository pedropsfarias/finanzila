CREATE TABLE IF NOT EXISTS fluxo_consolidado (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mes_referencia date NOT NULL,
  data date NOT NULL,
  descricao text NOT NULL,
  valor_estimado numeric NOT NULL,
  data_pagamento date,
  valor_pagamento numeric,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fluxo_consolidado_mes_referencia_idx ON fluxo_consolidado (mes_referencia);
