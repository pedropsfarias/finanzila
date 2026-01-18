import createCarteira from "../../domain/entities/carteira.js";

const updateCarteiraUseCase = async ({ carteirasRepository }, input) => {
  const updatedCarteira = await carteirasRepository.update({
    id: input.id,
    nome: input.nome,
    aliases: input.aliases,
    diaFechamento: input.diaFechamento,
    diaPagamento: input.diaPagamento
  });

  return updatedCarteira ? createCarteira(updatedCarteira) : null;
};

export default updateCarteiraUseCase;
