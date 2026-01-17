import createCarteira from "../../domain/entities/carteira.js";

const listCarteirasUseCase = async ({ carteirasRepository }) => {
  const carteiras = await carteirasRepository.list();
  return carteiras.map((carteira) => createCarteira(carteira));
};

export default listCarteirasUseCase;
