import { idDoSubtitulo, type Bloco } from '../../data/tutoriais';

function renderizarBloco(bloco: Bloco, indice: number) {
  switch (bloco.tipo) {
    case 'paragrafo':
      return (
        <p key={indice} className="text-lg leading-8 text-forest-900">
          {bloco.texto}
        </p>
      );

    case 'subtitulo':
      return (
        <h2
          key={indice}
          id={idDoSubtitulo(bloco.texto)}
          className="scroll-mt-6 pt-4 text-2xl font-bold text-forest-950"
        >
          {bloco.texto}
        </h2>
      );

    case 'passos':
      return (
        <ol key={indice} className="space-y-4">
          {bloco.itens.map((item, posicao) => (
            <li key={item.titulo} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-800 text-sm font-bold text-white"
              >
                {posicao + 1}
              </span>
              <div>
                <p className="font-semibold text-forest-950">{item.titulo}</p>
                <p className="mt-1 leading-7 text-forest-800">{item.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case 'lista':
      return (
        <ul key={indice} className="space-y-3">
          {bloco.itens.map((item) => (
            <li key={item} className="flex gap-3 leading-7 text-forest-900">
              <span
                aria-hidden="true"
                className="mt-3 h-2 w-2 shrink-0 rounded-full bg-forest-600"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'dica':
      return (
        <aside
          key={indice}
          className="rounded-2xl border border-forest-300 bg-white p-5"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-forest-700">
            Dica
          </p>
          <p className="mt-1 leading-7 text-forest-900">{bloco.texto}</p>
        </aside>
      );

    case 'atencao':
      return (
        <aside
          key={indice}
          className="rounded-2xl border border-amber-300 bg-amber-50 p-5"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
            Atenção
          </p>
          <p className="mt-1 leading-7 text-amber-950">{bloco.texto}</p>
        </aside>
      );

    case 'exemplo':
      return (
        <section
          key={indice}
          className="rounded-2xl bg-forest-900 p-6 text-white"
        >
          <p className="font-bold text-[#FBFE34]">{bloco.titulo}</p>
          <ul className="mt-3 space-y-2">
            {bloco.linhas.map((linha) => (
              <li key={linha} className="leading-7 text-forest-100">
                {linha}
              </li>
            ))}
          </ul>
        </section>
      );
  }
}

export default function ConteudoPost({ blocos }: { blocos: Bloco[] }) {
  return <div className="space-y-6">{blocos.map(renderizarBloco)}</div>;
}
