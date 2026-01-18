import createCarteira from "../../domain/entities/carteira.js";

const createCarteiraUseCase = async ({ carteirasRepository }, input) => {
  const savedCarteira = await carteirasRepository.create({
    nome: input.nome,
    aliases: input.aliases,
    diaFechamento: input.diaFechamento,
    diaPagamento: input.diaPagamento
  });

  return createCarteira(savedCarteira);
};

export default createCarteiraUseCase;
