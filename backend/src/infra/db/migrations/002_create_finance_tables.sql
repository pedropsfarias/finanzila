CREATE TABLE IF NOT EXISTS despesas (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dia integer NOT NULL,
  descricao text NOT NULL,
  valor_estimado numeric NOT NULL,
  CONSTRAINT despesas_dia_check CHECK (dia BETWEEN 1 AND 31)
);

CREATE TABLE IF NOT EXISTS carteiras (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome text NOT NULL,
  dia_fechamento integer NOT NULL,
  dia_pagamento integer NOT NULL,
  CONSTRAINT carteiras_dia_fechamento_check CHECK (dia_fechamento BETWEEN 1 AND 31),
  CONSTRAINT carteiras_dia_pagamento_check CHECK (dia_pagamento BETWEEN 1 AND 31)
);

CREATE TABLE IF NOT EXISTS fluxo_caixa (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data date NOT NULL,
  descricao text NOT NULL,
  valor numeric NOT NULL,
  parcela text,
  carteira_id integer NOT NULL,
  CONSTRAINT fluxo_caixa_carteira_fk FOREIGN KEY (carteira_id)
    REFERENCES carteiras(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS fluxo_caixa_carteira_id_idx ON fluxo_caixa (carteira_id);
CREATE INDEX IF NOT EXISTS fluxo_caixa_data_idx ON fluxo_caixa (data);
