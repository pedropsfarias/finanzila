const normalizeKey = (value) => String(value ?? "")
  .trim()
  .replace(/\s+/g, " ")
  .toLowerCase();

const formatDate = (date) => date.toISOString().slice(0, 10);

const toDate = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = Number(match[1]);
      const monthIndex = Number(match[2]) - 1;
      const day = Number(match[3]);
      const local = new Date(year, monthIndex, day);
      return Number.isNaN(local.getTime()) ? null : local;
    }
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const endOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0);

const addMonths = (value, months) => {
  const date = new Date(value.getTime());
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const target = new Date(year, month + months, 1);
  const maxDay = endOfMonth(target.getFullYear(), target.getMonth()).getDate();
  target.setDate(Math.min(day, maxDay));
  return target;
};

const buildDate = (year, monthIndex, day) => {
  const maxDay = endOfMonth(year, monthIndex).getDate();
  return new Date(year, monthIndex, Math.min(day, maxDay));
};

const buildPagamentoDate = (year, monthIndex, diaPagamento) => {
  const target = buildDate(year, monthIndex, diaPagamento);
  return target;
};

const buildMesReferencia = (year, monthIndex) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;

const getStatementInterval = (monthDate, diaFechamento) => {
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const fechamentoAtual = buildDate(year, monthIndex, diaFechamento);
  const fechamentoAnterior = addMonths(fechamentoAtual, -1);
  const inicio = addMonths(fechamentoAnterior, 0);
  inicio.setDate(fechamentoAnterior.getDate() + 1);
  const fim = fechamentoAtual;
  return { inicio, fim };
};

const isBetweenInclusive = (value, start, end) => value >= start && value <= end;

const generateFluxoConsolidadoUseCase = async (
  { fluxoConsolidadoRepository, despesasRepository, carteirasRepository, fluxoCaixaRepository },
  input
) => {
  const mesReferencia = String(input.mesReferencia ?? "").trim();
  if (!/^\d{4}-\d{2}-01$/.test(mesReferencia)) {
    throw new Error("mesReferencia invalido. Use o formato YYYY-MM-01.");
  }

  const [yearText, monthText] = mesReferencia.split("-");
  const baseYear = Number(yearText);
  const baseMonthIndex = Number(monthText) - 1;
  const baseDate = new Date(baseYear, baseMonthIndex, 1);
  const despesas = await despesasRepository.list();
  const carteiras = await carteirasRepository.list();
  const fluxos = await fluxoCaixaRepository.list();

  const carteiraNomeLookup = new Map(
    carteiras.map((carteira) => [normalizeKey(carteira.nome), carteira])
  );

  const despesasPorCarteira = new Map();
  const despesasGerais = [];

  despesas.forEach((despesa) => {
    const key = normalizeKey(despesa.descricao);
    const carteira = carteiraNomeLookup.get(key);
    if (carteira) {
      despesasPorCarteira.set(carteira.id, despesa);
    } else {
      despesasGerais.push(despesa);
    }
  });

  const itens = [];
  const year = baseYear;
  const monthIndex = baseMonthIndex;
  const mesReferenciaDate = buildMesReferencia(year, monthIndex);

  despesasGerais.forEach((despesa) => {
    const data = buildDate(year, monthIndex, despesa.dia);
    itens.push({
      mesReferencia: mesReferenciaDate,
      data: formatDate(data),
      descricao: despesa.descricao,
      valorEstimado: despesa.valorEstimado,
      dataPagamento: null,
      valorPagamento: null
    });
  });

  carteiras.forEach((carteira) => {
    const { inicio, fim } = getStatementInterval(baseDate, carteira.diaFechamento);
    const totalCarteira = fluxos.reduce((total, fluxo) => {
      if (fluxo.carteiraId !== carteira.id) {
        return total;
      }
      const dataFluxo = toDate(fluxo.data);
      if (!dataFluxo || !isBetweenInclusive(dataFluxo, inicio, fim)) {
        return total;
      }
      return total + Number(fluxo.valor || 0);
    }, 0);

    const pagamentoData = buildPagamentoDate(year, monthIndex, carteira.diaPagamento);
    const despesaCarteira = despesasPorCarteira.get(carteira.id);
    if (despesaCarteira) {
      itens.push({
        mesReferencia: mesReferenciaDate,
        data: formatDate(pagamentoData),
        descricao: despesaCarteira.descricao,
        valorEstimado: totalCarteira,
        dataPagamento: formatDate(pagamentoData),
        valorPagamento: null
      });
      return;
    }

    itens.push({
      mesReferencia: mesReferenciaDate,
      data: formatDate(pagamentoData),
      descricao: carteira.nome,
      valorEstimado: totalCarteira,
      dataPagamento: formatDate(pagamentoData),
      valorPagamento: null
    });
  });

  await fluxoConsolidadoRepository.removeByMesReferencia(mesReferenciaDate);

  for (const item of itens) {
    await fluxoConsolidadoRepository.create(item);
  }

  return { mesReferencia: mesReferenciaDate, total: itens.length };
};

export default generateFluxoConsolidadoUseCase;
