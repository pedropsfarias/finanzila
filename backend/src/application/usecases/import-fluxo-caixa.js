const normalize = (value) => String(value ?? "")
  .trim()
  .replace(/\s+/g, " ")
  .toLowerCase();

const parseDate = (value) => {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return null;
};

const parseValor = (value) => {
  const text = String(value ?? "").trim().replace(/\s+/g, "");
  if (!text) {
    return null;
  }
  let normalized = text;
  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const importFluxoCaixaUseCase = async ({ fluxoCaixaRepository, carteirasRepository }, input) => {
  const carteiras = await carteirasRepository.list();
  const carteiraLookup = new Map();
  const carteiraPreferidaId = Number(input.carteiraId);
  const carteiraPreferida = Number.isFinite(carteiraPreferidaId)
    ? carteiras.find((carteira) => carteira.id === carteiraPreferidaId)
    : null;

  if (input.carteiraId && !carteiraPreferida) {
    throw new Error("Carteira informada invalida.");
  }

  const registerCarteira = (carteira) => {
    if (!carteira) {
      return;
    }
    const nomeKey = normalize(carteira.nome);
    if (nomeKey) {
      carteiraLookup.set(nomeKey, carteira);
    }
    if (Array.isArray(carteira.aliases)) {
      carteira.aliases.forEach((alias) => {
        const aliasKey = normalize(alias);
        if (aliasKey) {
          carteiraLookup.set(aliasKey, carteira);
        }
      });
    }
  };

  carteiras.forEach(registerCarteira);

  const repetidos = [];
  const ignorados = [];
  const seen = new Set();
  let importados = 0;
  let carteirasCriadas = 0;

  for (const registro of input.registros ?? []) {
    const carteiraNome = carteiraPreferida ? carteiraPreferida.nome : (registro.conta || registro.cartaoCredito || "");
    const data = parseDate(registro.data);
    const descricao = String(registro.descricao ?? "").trim();
    const valor = parseValor(registro.valor);
    if (!data || !descricao || valor === null || !carteiraNome.trim()) {
      ignorados.push({ ...registro, motivo: "registro_incompleto" });
      continue;
    }

    const carteiraKey = normalize(carteiraNome);
    let carteira = carteiraPreferida ?? carteiraLookup.get(carteiraKey);
    if (!carteira) {
      carteira = await carteirasRepository.create({
        nome: carteiraNome.trim(),
        aliases: [],
        diaFechamento: 1,
        diaPagamento: 1
      });
      carteiraLookup.set(carteiraKey, carteira);
      carteirasCriadas += 1;
    }

    const parcela = registro.parcela ? String(registro.parcela).trim() : null;
    const key = [data, descricao, valor, carteira.id, parcela ?? ""].join("|");
    if (seen.has(key)) {
      repetidos.push({ ...registro, motivo: "duplicado_na_planilha" });
      continue;
    }

    const existente = await fluxoCaixaRepository.findExisting({
      data,
      descricao,
      valor,
      parcela,
      carteiraId: carteira.id
    });
    if (existente) {
      repetidos.push({ ...registro, motivo: "ja_cadastrado" });
      seen.add(key);
      continue;
    }

    await fluxoCaixaRepository.create({
      data,
      descricao,
      valor,
      parcela,
      carteiraId: carteira.id
    });
    seen.add(key);
    importados += 1;
  }

  return {
    totalRegistros: input.registros?.length ?? 0,
    importados,
    carteirasCriadas,
    repetidos,
    ignorados
  };
};

export default importFluxoCaixaUseCase;
