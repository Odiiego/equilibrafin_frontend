export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'passos'; itens: { titulo: string; texto: string }[] }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'dica'; texto: string }
  | { tipo: 'atencao'; texto: string }
  | { tipo: 'exemplo'; titulo: string; linhas: string[] };

export type Categoria =
  | 'Primeiros passos'
  | 'Lançamentos'
  | 'Listas'
  | 'Ritmo'
  | 'Dashboard'
  | 'Na prática';

export type Tutorial = {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: Categoria;
  conteudo: Bloco[];
};

export const CATEGORIAS: Categoria[] = [
  'Primeiros passos',
  'Lançamentos',
  'Listas',
  'Ritmo',
  'Dashboard',
  'Na prática',
];

export const idDoSubtitulo = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function textoDoBloco(bloco: Bloco): string {
  switch (bloco.tipo) {
    case 'passos':
      return bloco.itens
        .map((item) => `${item.titulo} ${item.texto}`)
        .join(' ');
    case 'lista':
      return bloco.itens.join(' ');
    case 'exemplo':
      return `${bloco.titulo} ${bloco.linhas.join(' ')}`;
    default:
      return bloco.texto;
  }
}

/** Estimativa de leitura a ~200 palavras por minuto. */
export const minutosDeLeitura = (tutorial: Tutorial) => {
  const palavras = tutorial.conteudo
    .map(textoDoBloco)
    .join(' ')
    .split(/\s+/).length;

  return Math.max(1, Math.ceil(palavras / 200));
};

export const TUTORIAIS: Tutorial[] = [
  {
    slug: 'primeiros-passos',
    titulo: 'Primeiros passos: crie sua conta e sua primeira lista',
    resumo:
      'Do cadastro à primeira lista pronta para receber seus gastos, em poucos minutos.',
    categoria: 'Primeiros passos',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Controlar o dinheiro não precisa ser complicado. No EquilibraFin tudo gira em torno de listas: espaços onde você reúne suas receitas e despesas do jeito que fizer sentido para você. Neste guia você vai da conta criada à primeira lista pronta.',
      },
      { tipo: 'subtitulo', texto: 'Crie sua conta' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Comece pela página inicial',
            texto: 'Clique em “Criar minha conta”.',
          },
          {
            titulo: 'Preencha seus dados',
            texto:
              'Informe nome completo, e-mail e uma senha com pelo menos 8 caracteres. Digite a senha de novo para confirmar.',
          },
          {
            titulo: 'Pronto',
            texto:
              'Ao concluir, você já entra na plataforma. Nas próximas vezes, use “Entre na sua conta” com e-mail e senha.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Entenda o que é uma lista' },
      {
        tipo: 'paragrafo',
        texto:
          'Uma lista é um grupo de lançamentos. Pode ser “Despesas de novembro”, “Viagem de fim de ano” ou “Reserva de emergência”. Você pode ter quantas listas quiser e, mais para frente, até combinar uma lista dentro de outra.',
      },
      { tipo: 'subtitulo', texto: 'Crie sua primeira lista' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Dê um nome',
            texto:
              'Na tela “Minhas listas”, em “Criar nova lista”, digite o nome (até 60 caracteres).',
          },
          {
            titulo: 'Defina um objetivo, se quiser',
            texto:
              'Clique em “Adicionar limite ou meta (opcional)” para já definir quanto espera gastar ou guardar. Dá para fazer isso depois também.',
          },
          {
            titulo: 'Crie',
            texto:
              'Clique em “+ Criar lista”. Ela aparece logo abaixo, em “Suas listas”.',
          },
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Nomeie a lista pelo propósito e pelo período, como “Mercado e contas de novembro”. Fica fácil achar e comparar depois.',
      },
      { tipo: 'subtitulo', texto: 'Seu saldo, só quando você quiser' },
      {
        tipo: 'paragrafo',
        texto:
          'No card de cada lista, o saldo aparece escondido (••••••). Clique no ícone de olho para mostrar ou ocultar. É útil quando você abre a plataforma em lugares públicos.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Com a lista criada, o próximo passo é registrar o primeiro lançamento. É o tema do próximo tutorial.',
      },
    ],
  },
  {
    slug: 'registrar-lancamentos',
    titulo: 'Como registrar receitas e despesas sem complicação',
    resumo:
      'Tudo sobre adicionar, editar e excluir lançamentos, e como escolher bons nomes e categorias.',
    categoria: 'Lançamentos',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Um lançamento é qualquer dinheiro que entra (receita) ou sai (despesa). Registrar com constância, mesmo que seja rápido, é o que faz os gráficos e o ritmo da plataforma ficarem confiáveis.',
      },
      { tipo: 'subtitulo', texto: 'Adicionando um lançamento' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Abra a lista',
            texto:
              'Na tela “Minhas listas”, clique no card da lista que vai receber o lançamento.',
          },
          {
            titulo: 'Clique em “Novo lançamento”',
            texto:
              'O botão fica no topo da página, ao lado de “Adicionar lista”.',
          },
          {
            titulo: 'Preencha o formulário',
            texto:
              'Escolha o tipo (receita ou despesa) e informe valor, descrição, categoria e data. A observação é opcional.',
          },
          {
            titulo: 'Confirme',
            texto:
              'Clique em “Adicionar lançamento”. Ele entra na tabela e os totais se atualizam.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Escrevendo bem cada campo' },
      {
        tipo: 'lista',
        itens: [
          'Valor: use vírgula para os centavos, como 250,00 ou 1.250,90 digitado como 1250,90. O valor deve ser maior que zero.',
          'Descrição: diga o que foi, como “Conta de luz” ou “Salário”.',
          'Categoria: agrupa seus gastos nos gráficos, como “Contas fixas”, “Mercado” ou “Transporte”.',
          'Data: o dia em que o dinheiro entrou ou saiu (ou vai sair).',
          'Observação: qualquer detalhe que ajude a lembrar depois.',
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Escolha poucas categorias e escreva sempre do mesmo jeito. “Mercado” e “mercadinho” viram categorias diferentes nos gráficos.',
      },
      { tipo: 'subtitulo', texto: 'Corrigindo ou apagando' },
      {
        tipo: 'paragrafo',
        texto:
          'Errou um valor? Na tabela, clique no lápis do lançamento, ajuste o que precisar e use “Salvar alterações”. Para remover, clique na lixeira. A tabela mostra os lançamentos do mais recente para o mais antigo.',
      },
      { tipo: 'subtitulo', texto: 'Uma atenção com as datas' },
      {
        tipo: 'atencao',
        texto:
          'Lançamentos com data futura entram nos totais da lista, mas só passam a contar no Ritmo (limites e metas) quando a data chegar. Assim o acompanhamento mostra o que de fato já aconteceu.',
      },
    ],
  },
  {
    slug: 'listas-dentro-de-listas',
    titulo: 'Listas dentro de listas: organize o orçamento por partes',
    resumo:
      'Use uma lista inteira como uma entrada de outra e veja o saldo dela virar receita ou despesa sozinho.',
    categoria: 'Listas',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Algumas despesas merecem controle próprio: a viagem, a reforma, o presente de aniversário. Mas elas também pesam no seu mês. Em vez de lançar tudo duas vezes, você pode adicionar a lista inteira como uma entrada da lista principal.',
      },
      { tipo: 'subtitulo', texto: 'Como a conta funciona' },
      {
        tipo: 'paragrafo',
        texto:
          'A lista adicionada entra como uma “entrada especial”. A plataforma calcula o saldo dela (receitas menos despesas) e classifica sozinha: saldo positivo vira receita, saldo negativo vira despesa, sempre pelo valor sem sinal. Se você mudar algo na lista interna, a entrada se atualiza na hora.',
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo',
        linhas: [
          'Lista “Viagem”: hotel de R$ 700 e passagens de R$ 900, ambos despesas. Saldo: −R$ 1.600.',
          'Lista “Mês”: salário de R$ 5.000 (receita) e aluguel de R$ 1.800 (despesa).',
          'Ao adicionar “Viagem” em “Mês”, ela aparece como uma despesa de R$ 1.600,00.',
          'Saldo de “Mês”: 5.000 − 1.800 − 1.600 = R$ 1.600,00.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Adicionando uma lista' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Abra a lista principal',
            texto: 'Aquela que vai receber a outra, como “Mês”.',
          },
          {
            titulo: 'Clique em “Adicionar lista”',
            texto: 'O botão fica no topo, junto de “Novo lançamento”.',
          },
          {
            titulo: 'Escolha a lista',
            texto:
              'Ao selecionar, o formulário mostra como ela vai entrar, por exemplo “Entrará como despesa de R$ 1.600,00”.',
          },
          {
            titulo: 'Defina a data e confirme',
            texto:
              'Escolha a data da entrada, escreva uma observação se quiser e clique em “Adicionar lista”.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Regras que protegem seu saldo' },
      {
        tipo: 'lista',
        itens: [
          'Uma lista não pode conter a si mesma.',
          'Não vale criar ciclos: se “A” contém “B”, “B” não pode conter “A”, nem indiretamente. A plataforma impede isso: essas listas simplesmente não aparecem entre as opções.',
          'A mesma lista não pode ser adicionada duas vezes na mesma lista, mas pode aparecer em listas diferentes.',
          'Para ver os detalhes da lista interna, clique no nome dela na tabela.',
          'A lixeira remove a entrada da lista principal; a lista interna continua existindo.',
        ],
      },
      {
        tipo: 'dica',
        texto:
          'O limite ou a meta da lista interna não entram na conta da lista principal. Ela leva em conta só o saldo da outra, na data da entrada.',
      },
    ],
  },
  {
    slug: 'limite-de-gastos',
    titulo:
      'Limite de gastos: descubra se você está gastando mais do que esperava',
    resumo:
      'Defina quanto pretende gastar em um período e acompanhe, dia a dia, se está dentro do esperado.',
    categoria: 'Ritmo',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'O limite de gastos é o valor máximo que você espera gastar em um período. Ele não bloqueia nada: serve como um termômetro que avisa quando você gastou mais do que o previsto até aqui.',
      },
      { tipo: 'subtitulo', texto: 'Definindo o limite' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Abra a lista e clique em “Acompanhar ritmo”',
            texto:
              'Ele fica no topo da página e abre a aba Ritmo. Se a lista já tem um objetivo, o botão aparece como “Editar ritmo”.',
          },
          {
            titulo: 'Marque “Limite de gastos”',
            texto: 'Informe o valor e escolha o período.',
          },
          {
            titulo: 'Salve',
            texto: 'Pronto: o painel do limite aparece na aba Ritmo.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Escolhendo o período' },
      {
        tipo: 'lista',
        itens: [
          'Semanal: de segunda a domingo. Renova sozinho toda semana.',
          'Mensal: do primeiro ao último dia do mês. Renova todo mês.',
          'Anual: de 1º de janeiro a 31 de dezembro.',
          'Personalizado: você escolhe início e fim, como 1 a 25 de dezembro para o Natal.',
        ],
      },
      { tipo: 'subtitulo', texto: 'O que entra na conta' },
      {
        tipo: 'paragrafo',
        texto:
          'Contam as despesas com data dentro do período e até hoje. Receitas não diminuem o gasto. Listas adicionadas que viram despesa também contam, pelo valor do saldo delas.',
      },
      { tipo: 'subtitulo', texto: 'Lendo o resultado' },
      {
        tipo: 'paragrafo',
        texto:
          'A plataforma compara o que você gastou com o que seria esperado até hoje, proporcional ao tempo que já passou. Com limite de R$ 1.000 no mês, no dia 15 de um mês de 30 dias o esperado é R$ 500.',
      },
      {
        tipo: 'lista',
        itens: [
          'No ritmo: o gasto está igual ou abaixo do esperado.',
          'Atenção: está um pouco acima do esperado (até 20%).',
          'Gastando acima do esperado: passou dessa margem ou já ultrapassou o limite.',
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Crie limites em listas pequenas e específicas, como “Mercado” com limite semanal. Fica mais fácil ajustar o comportamento.',
      },
    ],
  },
  {
    slug: 'meta-de-economia',
    titulo: 'Meta de ganhos ou de economia: chegue ao valor no prazo',
    resumo:
      'Defina quanto quer ganhar ou guardar e saiba quanto precisa aportar por semana ou por mês.',
    categoria: 'Ritmo',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'A meta acompanha quanto você quer juntar até um prazo: uma reserva de emergência, a entrada de um carro, a viagem do ano. A plataforma mostra se o seu ritmo atual leva você até lá.',
      },
      { tipo: 'subtitulo', texto: 'Ganhos ou saldo: o que a meta considera' },
      {
        tipo: 'lista',
        itens: [
          'Ganhos: conta só as receitas da lista. Ideal para listas em que cada aporte é uma receita, ou para metas de renda.',
          'Saldo: conta receitas menos despesas. Ideal quando há retiradas que devem diminuir o que você juntou.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Definindo a meta' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Clique em “Acompanhar ritmo”',
            texto: 'No topo da lista. Marque a caixa “Meta”.',
          },
          {
            titulo: 'Escolha o que a meta considera',
            texto: 'Ganhos ou Saldo, conforme o exemplo acima.',
          },
          {
            titulo: 'Informe o valor e o período',
            texto:
              'Para metas de longo prazo, use o período personalizado com início e fim.',
          },
        ],
      },
      {
        tipo: 'exemplo',
        titulo: 'Exemplo: reserva de emergência',
        linhas: [
          'Lista “Reserva de emergência”, meta de saldo de R$ 6.000.',
          'Período personalizado: 1º de janeiro a 31 de dezembro.',
          'Cada aporte mensal de R$ 500 é lançado como receita.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Quanto guardar por período' },
      {
        tipo: 'paragrafo',
        texto:
          'Enquanto a meta não é atingida, o painel calcula quanto falta e sugere um ritmo: por mês quando restam muitos dias, por semana quando restam algumas semanas e por dia nos últimos dias. Também mostra a projeção de onde você termina se mantiver o ritmo atual.',
      },
      { tipo: 'subtitulo', texto: 'Lendo o resultado' },
      {
        tipo: 'lista',
        itens: [
          'No ritmo: você já juntou o que era esperado até hoje.',
          'Atenção: está até 20% abaixo do esperado.',
          'Abaixo do esperado: o ritmo precisa aumentar.',
          'Ao fim do prazo, o painel mostra se a meta foi atingida ou não.',
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Uma lista pode ter limite e meta ao mesmo tempo. Por exemplo, na lista “Mês”: limite de gastos de R$ 3.000 e meta de economia de R$ 800.',
      },
    ],
  },
  {
    slug: 'entendendo-o-ritmo',
    titulo: 'Entendendo o Ritmo: barra, projeção e insights',
    resumo:
      'Um guia para ler o painel de cada limite e meta e transformar os números em decisões.',
    categoria: 'Ritmo',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'A aba Ritmo responde a uma pergunta simples: dado o que já aconteceu no período, estou no caminho para cumprir meu limite ou minha meta? Cada objetivo tem o seu painel. Veja como ler cada parte.',
      },
      { tipo: 'subtitulo', texto: 'A barra de progresso' },
      {
        tipo: 'paragrafo',
        texto:
          'A barra mostra quanto do limite ou da meta você já usou ou atingiu. A marca vertical indica quanto era esperado até hoje. No limite, barra além da marca significa gastar mais rápido que o previsto. Na meta, barra aquém da marca significa juntar mais devagar.',
      },
      { tipo: 'subtitulo', texto: 'Os quatro números' },
      {
        tipo: 'lista',
        itens: [
          'Gasto, ganho ou guardado até hoje: o que você já realizou no período.',
          'Esperado até hoje: o valor do objetivo proporcional ao tempo decorrido.',
          'Projeção no fim: onde você termina o período se mantiver o ritmo médio atual.',
          'Dias restantes: quanto tempo ainda há para ajustar.',
        ],
      },
      { tipo: 'subtitulo', texto: 'O gráfico' },
      {
        tipo: 'paragrafo',
        texto:
          'Três linhas contam a história: a linha cinza tracejada é o caminho esperado; a linha verde é o que de fato aconteceu, acumulado dia a dia; a linha amarela pontilhada é a projeção até o fim do período. Se a verde está acima da cinza, você está à frente do esperado (e isso é bom para metas, mas é sinal de atenção para limites).',
      },
      { tipo: 'subtitulo', texto: 'Os insights' },
      {
        tipo: 'paragrafo',
        texto:
          'Abaixo do gráfico, frases traduzem os números em ações: quanto você pode gastar por dia para ficar dentro do limite, quanto guardar por mês para bater a meta e qual categoria mais pesa nas suas despesas.',
      },
      {
        tipo: 'atencao',
        texto:
          'A projeção é uma estimativa que repete o seu ritmo médio até agora. Uma conta grande que chega no fim do mês pode mudar o resultado. Use-a como alerta, não como promessa.',
      },
      { tipo: 'subtitulo', texto: 'Casos especiais' },
      {
        tipo: 'lista',
        itens: [
          'Período que ainda não começou: o painel avisa a data de início.',
          'Período encerrado: o painel mostra o resultado final, como “Dentro do limite” ou “Meta atingida”.',
          'Período semanal, mensal ou anual: ao virar o período, o acompanhamento recomeça do zero automaticamente.',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'Na tela “Minhas listas”, cada card também mostra uma versão compacta: o selo de status e a barra com o que já foi usado ou atingido.',
      },
    ],
  },
  {
    slug: 'dashboard-da-lista',
    titulo: 'Dashboard: os números e gráficos da sua lista',
    resumo:
      'Veja entradas, saídas, categorias e indicadores como taxa de poupança e média diária de gastos.',
    categoria: 'Dashboard',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Enquanto o Ritmo olha para os seus objetivos, o Dashboard mostra o retrato completo da lista: para onde o dinheiro está indo e de onde ele vem. Ele fica na aba “Dashboard”, dentro de cada lista.',
      },
      { tipo: 'subtitulo', texto: 'Escolha o período' },
      {
        tipo: 'paragrafo',
        texto:
          'No topo você escolhe o recorte: Tudo, Este mês, Últimos 30 dias ou Este ano. Todos os números e gráficos se ajustam a ele.',
      },
      { tipo: 'subtitulo', texto: 'Os indicadores' },
      {
        tipo: 'lista',
        itens: [
          'Receitas, Despesas e Saldo do período.',
          'Taxa de poupança: a parte do que entrou que sobrou (saldo dividido pelas receitas).',
          'Média diária de gastos: despesas divididas pelos dias do período.',
          'Maior despesa e maior receita, com o nome de cada uma.',
          'Lançamentos: quantos registros há no período.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Entradas e saídas' },
      {
        tipo: 'paragrafo',
        texto:
          'O gráfico de barras compara receitas (verde) e despesas (vermelho) ao longo do tempo, com uma linha de saldo acumulado por cima. Em períodos curtos as barras são diárias; em períodos médios, semanais; em períodos longos, mensais.',
      },
      { tipo: 'subtitulo', texto: 'Por categoria' },
      {
        tipo: 'paragrafo',
        texto:
          'Duas rosquinhas mostram como se dividem suas despesas e suas receitas por categoria. As maiores aparecem separadas e as demais são agrupadas em “Outras”. Listas adicionadas como entrada aparecem com o nome da própria lista.',
      },
      {
        tipo: 'dica',
        texto:
          'Poucas categorias bem escolhidas deixam as rosquinhas muito mais úteis. Se uma fatia gigante concentra quase tudo, vale dividir esses lançamentos em categorias mais específicas.',
      },
      {
        tipo: 'atencao',
        texto:
          'Diferente do Ritmo, o Dashboard inclui todos os lançamentos do recorte escolhido, mesmo os de datas futuras.',
      },
    ],
  },
  {
    slug: 'orcamento-mensal-passo-a-passo',
    titulo: 'Receita pronta: monte seu orçamento mensal em 15 minutos',
    resumo:
      'Um roteiro completo juntando lançamentos, listas dentro de listas, limite e meta.',
    categoria: 'Na prática',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Chegou a hora de juntar tudo. Este roteiro monta um orçamento mensal completo e uma rotina simples para acompanhá-lo. Os valores são só exemplos: troque pelos seus.',
      },
      { tipo: 'subtitulo', texto: 'Monte a estrutura' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Crie a lista “Mês”',
            texto:
              'Na criação, adicione um limite de gastos mensal (por exemplo, R$ 3.500) e uma meta de economia mensal (por exemplo, R$ 800, considerando o saldo).',
          },
          {
            titulo: 'Lance suas receitas',
            texto:
              'Salário e outras entradas, cada uma na data em que cai na conta.',
          },
          {
            titulo: 'Lance as despesas fixas',
            texto:
              'Aluguel, internet, escola. Use a data de vencimento e lembre que o Ritmo só conta o que já passou da data.',
          },
          {
            titulo: 'Separe o que merece atenção especial',
            texto:
              'Crie listas como “Mercado” ou “Viagem” e adicione cada uma em “Mês” com “Adicionar lista”. Elas entram como despesa e o saldo do mês se ajusta sozinho.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Crie uma rotina de 5 minutos' },
      {
        tipo: 'lista',
        itens: [
          'Registre os gastos assim que acontecem ou, no máximo, uma vez por semana.',
          'Abra a aba Ritmo e leia os insights da semana.',
          'Se o selo estiver em “Atenção”, escolha uma categoria para segurar nos próximos dias.',
          'Se a meta estiver abaixo do esperado, veja quanto guardar por semana para voltar ao caminho.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Feche o mês com o Dashboard' },
      {
        tipo: 'paragrafo',
        texto:
          'No fim do mês, abra o Dashboard com o filtro “Este mês”. Olhe a taxa de poupança, a categoria que mais pesou e a maior despesa. Com isso, ajuste o limite e a meta do mês seguinte (a lista se renova sozinha, então basta editar os valores em “Editar ritmo”).',
      },
      {
        tipo: 'exemplo',
        titulo: 'Checklist rápido',
        linhas: [
          'Lista “Mês” criada com limite e meta.',
          'Receitas e despesas fixas lançadas.',
          'Listas especiais adicionadas dentro de “Mês”.',
          'Rotina semanal definida: lançar e olhar o Ritmo.',
          'Revisão mensal no Dashboard.',
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Comece simples. Uma lista, um limite e a rotina semanal já fazem diferença. Acrescente listas e metas conforme sentir necessidade.',
      },
    ],
  },
  {
    slug: 'conta-de-demonstracao',
    titulo: 'Conheça a conta de demonstração: a história da Marina',
    resumo:
      'Um passeio guiado por uma conta de exemplo, com listas dentro de listas, limites, metas e um ano de vida financeira.',
    categoria: 'Na prática',
    conteudo: [
      {
        tipo: 'paragrafo',
        texto:
          'Nada explica melhor como o EquilibraFin funciona do que ver tudo em uso. A conta de demonstração conta a história de Marina Duarte, uma designer de produto de 31 anos que mora de aluguel com a cachorra Pipoca e, há dez meses, decidiu organizar as finanças depois de um fim de ano em que o cartão estourou.',
      },
      {
        tipo: 'atencao',
        texto:
          'Os dados são fictícios e as datas se ajustam para sempre mostrar os últimos meses. Explore à vontade, mas não coloque informações reais nesta conta.',
      },
      { tipo: 'subtitulo', texto: 'A história em poucas linhas' },
      {
        tipo: 'lista',
        itens: [
          'O salário cai todo dia 1 e foi reajustado depois de uma promoção, há cerca de cinco meses.',
          'As contas fixas seguem o calendário: aluguel (que também teve reajuste), condomínio, plano de saúde, energia, internet, celular, academia e streaming. As compras de mercado se espalham pelo mês.',
          'A Pipoca chegou há nove meses, com adoção, caminha e vacinas. Há três meses veio o imprevisto do ano: uma cirurgia de R$ 1.250.',
          'Nas horas vagas, Marina faz projetos de design. Os pagamentos viram uma lista própria.',
          'Ela planeja uma viagem a Lisboa e acompanha os gastos separadamente.',
          'Depois de se organizar, passou a guardar todo mês e a separar o dinheiro de diversão.',
        ],
      },
      { tipo: 'subtitulo', texto: 'As seis listas da Marina' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Minha vida financeira',
            texto:
              'A lista principal: salário, contas fixas, mercado, transporte, saúde e pet. Tem um limite de gastos de R$ 70.000 e uma meta de saldo de R$ 24.000, ambos em uma janela de 12 meses.',
          },
          {
            titulo: 'Freelas de design',
            texto:
              'Três projetos que somam receitas. A lista entra na principal como receita e tem uma meta de ganhos de R$ 5.600.',
          },
          {
            titulo: 'Viagem a Lisboa',
            texto:
              'Passagens, hotel, seguro e câmbio. Entra na principal como despesa e tem um limite de R$ 10.500. Dentro dela há mais uma lista:',
          },
          {
            titulo: 'Passeios e extras (estimado)',
            texto:
              'Os gastos previstos para durante a viagem, com datas futuras. É uma lista dentro da lista da viagem, que por sua vez está dentro da principal.',
          },
          {
            titulo: 'Reserva de emergência',
            texto:
              'Aportes mensais de R$ 700, com uma pausa no mês da cirurgia da Pipoca e um aporte extra do bônus da promoção. Tem uma meta de saldo de R$ 14.000 em 18 meses.',
          },
          {
            titulo: 'Lazer e delivery',
            texto:
              'Cafés, jantares, cinema e delivery. Tem um limite semanal de R$ 250, que renova toda segunda-feira.',
          },
        ],
      },
      { tipo: 'subtitulo', texto: 'Um roteiro para explorar' },
      {
        tipo: 'passos',
        itens: [
          {
            titulo: 'Comece por “Minhas listas”',
            texto:
              'Cada card mostra o selo e a barra de cada limite ou meta. Compare como cada lista está em relação ao esperado.',
          },
          {
            titulo: 'Abra “Minha vida financeira”',
            texto:
              'Na aba Lançamentos, procure as entradas com o ícone de camadas: são listas inteiras (Freelas e Viagem) funcionando como entradas. Clique no nome de uma delas para abri-la.',
          },
          {
            titulo: 'Vá para a aba Ritmo',
            texto:
              'Leia a barra, a projeção e os insights do limite e da meta. Perceba como a viagem, que tem data futura, ainda não pesa no ritmo da lista principal.',
          },
          {
            titulo: 'Abra o Dashboard com “Este ano”',
            texto:
              'Veja o salário mês a mês, a categoria que mais pesa e o pico causado pela cirurgia da Pipoca. A lista da viagem aparece como uma categoria própria.',
          },
          {
            titulo: 'Visite a lista da viagem e a do lazer',
            texto:
              'Na viagem, veja o limite e a lista de estimativas aninhada. No lazer, veja o ritmo da semana atual e como o fim de semana costuma ser o ponto fraco.',
          },
        ],
      },
      {
        tipo: 'dica',
        texto:
          'Depois de explorar, tente repetir a estrutura com a sua vida: uma lista principal, listas separadas para projetos e uma reserva. Os tutoriais anteriores mostram cada passo.',
      },
    ],
  },
];

export const encontrarTutorial = (slug: string | undefined) =>
  TUTORIAIS.find((tutorial) => tutorial.slug === slug);
