type TextReplacement = readonly [RegExp, string];

const TEXT_REPLACEMENTS: TextReplacement[] = [
  [/\bacoes\b/gi, 'ações'],
  [/\bacesso\b/gi, 'acesso'],
  [/\bagil\b/gi, 'ágil'],
  [/\banuncios\b/gi, 'anúncios'],
  [/\bapresentacoes\b/gi, 'apresentações'],
  [/\baudio\b/gi, 'áudio'],
  [/\baudiovisual\b/gi, 'audiovisual'],
  [/\baudiovisuais\b/gi, 'audiovisuais'],
  [/\bautomacao\b/gi, 'automação'],
  [/\bavancada\b/gi, 'avançada'],
  [/\bavancadas\b/gi, 'avançadas'],
  [/\bavancado\b/gi, 'avançado'],
  [/\bavancados\b/gi, 'avançados'],
  [/\bbiblioteca\b/gi, 'biblioteca'],
  [/\bcolecao\b/gi, 'coleção'],
  [/\bcomposicoes\b/gi, 'composições'],
  [/\bconteudo\b/gi, 'conteúdo'],
  [/\bconteudos\b/gi, 'conteúdos'],
  [/\bcriacao\b/gi, 'criação'],
  [/\bdinamica\b/gi, 'dinâmica'],
  [/\bdinamicas\b/gi, 'dinâmicas'],
  [/\bdinamico\b/gi, 'dinâmico'],
  [/\bdinamicos\b/gi, 'dinâmicos'],
  [/\bedicao\b/gi, 'edição'],
  [/\bedicoes\b/gi, 'edições'],
  [/\beditavel\b/gi, 'editável'],
  [/\beditaveis\b/gi, 'editáveis'],
  [/\beficiencia\b/gi, 'eficiência'],
  [/\bengajamento\b/gi, 'engajamento'],
  [/\bestrategico\b/gi, 'estratégico'],
  [/\bestrategicos\b/gi, 'estratégicos'],
  [/\bexcelencia\b/gi, 'excelência'],
  [/\bfacil\b/gi, 'fácil'],
  [/\bfacilitando\b/gi, 'facilitando'],
  [/\bferramentas\b/gi, 'ferramentas'],
  [/\bgraficas\b/gi, 'gráficas'],
  [/\bgrafico\b/gi, 'gráfico'],
  [/\bgraficos\b/gi, 'gráficos'],
  [/\bgestao\b/gi, 'gestão'],
  [/\bideias\b/gi, 'ideias'],
  [/\bicone\b/gi, 'ícone'],
  [/\bicones\b/gi, 'ícones'],
  [/\binteligencia\b/gi, 'inteligência'],
  [/\bmidias\b/gi, 'mídias'],
  [/\bnegocio\b/gi, 'negócio'],
  [/\bnegocios\b/gi, 'negócios'],
  [/\bnumeros\b/gi, 'números'],
  [/\botimizacao\b/gi, 'otimização'],
  [/\bpersonalizavel\b/gi, 'personalizável'],
  [/\bpersonalizaveis\b/gi, 'personalizáveis'],
  [/\bpresenca\b/gi, 'presença'],
  [/\bpratico\b/gi, 'prático'],
  [/\bpraticos\b/gi, 'práticos'],
  [/\bpublicacao\b/gi, 'publicação'],
  [/\bproducao\b/gi, 'produção'],
  [/\bproducoes\b/gi, 'produções'],
  [/\brapida\b/gi, 'rápida'],
  [/\brapidas\b/gi, 'rápidas'],
  [/\brapido\b/gi, 'rápido'],
  [/\brapidos\b/gi, 'rápidos'],
  [/\breferencias\b/gi, 'referências'],
  [/\bresolucao\b/gi, 'resolução'],
  [/\bsociais\b/gi, 'sociais'],
  [/\bsonoros\b/gi, 'sonoros'],
  [/\bsuite\b/gi, 'suíte'],
  [/\btecnicas\b/gi, 'técnicas'],
  [/\btransicoes\b/gi, 'transições'],
  [/\btransmissoes\b/gi, 'transmissões'],
  [/\butileis\b/gi, 'úteis'],
  [/\bvarias\b/gi, 'várias'],
  [/\bvarios\b/gi, 'vários'],
  [/\bvideo\b/gi, 'vídeo'],
  [/\bvideos\b/gi, 'vídeos'],
  [/\bvisuais\b/gi, 'visuais']
];

function preserveCase(original: string, replacement: string): string {
  if (!original) {
    return replacement;
  }

  const first = original[0];

  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }

  return replacement;
}

export function normalizePackText(value?: string | null): string {
  if (!value) {
    return '';
  }

  return TEXT_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) =>
      text.replace(pattern, (match) => preserveCase(match, replacement)),
    value
  );
}
