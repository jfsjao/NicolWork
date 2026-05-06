import { normalizePackText } from './pack-text-normalizer';

describe('normalizePackText', () => {
  it('adds pt-BR accents to pack names and descriptions received from the API', () => {
    const text = 'Kit Inicial de Edicao de Video com transicoes dinamicas, resolucao alta e personagens editaveis.';

    expect(normalizePackText(text)).toBe(
      'Kit Inicial de Edição de Vídeo com transições dinâmicas, resolução alta e personagens editáveis.'
    );
  });
});
