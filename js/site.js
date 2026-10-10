/* =============================================================================
   NEGOCIE IMOBILIÁRIA — comportamento do site (v2_lego_parametros)

   O QUE MUDOU DA v1 E POR QUÊ (10/10/2026, ordem dele: "isso temos q
   implementar no site da cynara tb code, essa logica das mudanças"):
     - Os botões de filtro NÃO moram mais no HTML. Saem de js/parametros.js
       cruzado com os imóveis publicados: tipo novo vira botão sem mexer em
       página nenhuma; só aparece botão de tipo que tem imóvel.
     - Tipo agora é o do imóvel (casa, apartamento, chácara...); cada tipo
       pertence a um GRUPO (urbano, rural, lancamento) e é o grupo que as
       páginas de campanha usam no data-filtro-inicial.
     - Busca nova: caixa de texto (código, título, bairro, cidade, tipo) e
       lista de bairros montada dos próprios imóveis (bairro novo entra
       sozinho). Finalidade (venda/aluguel) só aparece quando há as duas.
     - Card mostra "Aluguel" e o preço com "/mês" quando a finalidade pede.
     - Tipo desconhecido (fora do parametros.js) não some: aparece em
       "Todos" e ganha botão com o próprio nome até a casa ajustar.

   O site é 100% estático: não existe servidor, banco nem formulário que grave
   nada. Todo contato termina numa conversa de WhatsApp já escrita — o visitante
   só aperta enviar. Isso mantém o custo em zero e o dado do visitante fora do
   ar (nada trafega nem fica guardado em lugar nenhum).

   Este arquivo faz cinco coisas:
     1. monta os links de WhatsApp a partir dos atributos data-zap
     2. desenha os cards de imóvel a partir de js/imoveis.js
     3. monta os filtros a partir dos dados e filtra a grade
     4. transforma o formulário de anúncio em mensagem de WhatsApp
     5. abre e fecha o menu no celular
   ========================================================================== */

(function () {
  'use strict';

  // O número mora no config.js. O valor aqui é só rede de segurança caso o
  // config não tenha carregado — nunca o lugar de editar.
  var WHATSAPP = (window.CONFIG && window.CONFIG.whatsapp) || '5564996255946';

  var SELOS = {
    novidade:   { arquivo: 'img/selos/selo_novidade.png',   texto: 'Novidade' },
    vendido:    { arquivo: 'img/selos/selo_vendido.png',    texto: 'Vendido' },
    disponivel: { arquivo: 'img/selos/selo_disponivel.png', texto: 'Disponível' }
  };

  // Parâmetros da vitrine (js/parametros.js). Sem o arquivo, o site segue com
  // os três tipos de origem — nunca quebra por falta dele.
  var PARAM = window.PARAMETROS || {
    tipos: [],
    grupos: [{ valor: 'lancamento', rotulo: 'Lançamentos' }, { valor: 'urbano', rotulo: 'Urbanos' },
             { valor: 'rural', rotulo: 'Rurais' }],
    finalidades: [{ valor: 'venda', rotulo: 'Venda', sufixo_preco: '' },
                  { valor: 'aluguel', rotulo: 'Aluguel', sufixo_preco: '/mês' }]
  };

  function acharEm(listaParam, valor) {
    for (var i = 0; i < (listaParam || []).length; i++) if (listaParam[i].valor === valor) return listaParam[i];
    return null;
  }

  function rotuloTipo(valor) {
    var p = acharEm(PARAM.tipos, valor) || acharEm(PARAM.grupos, valor);
    if (p) return p.rotulo;
    var v = String(valor || '');
    return v.charAt(0).toUpperCase() + v.slice(1);
  }

  /** O grupo do tipo (urbano/rural/lancamento). Um grupo é grupo de si mesmo. */
  function grupoDe(valor) {
    var p = acharEm(PARAM.tipos, valor);
    if (p) return p.grupo || '';
    return acharEm(PARAM.grupos, valor) ? valor : '';
  }

  /** Sem acento e minúsculo: a busca acha "jatai" em "Jataí". */
  function normal(texto) {
    return String(texto == null ? '' : texto).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // --------------------------------------------------------------- utilidades
  function linkZap(mensagem) {
    // A assinatura de origem entra aqui: toda conversa nascida no site já chega
    // dizendo de qual anúncio e de qual página ela veio (ver js/rastreio.js).
    var assinatura = window.RASTREIO ? window.RASTREIO.assinatura() : '';
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem + assinatura);
  }

  /** Avisa o Google Ads que houve contato. Silencioso se não houver conta. */
  function marcarConversao(rotulo) {
    if (window.RASTREIO) window.RASTREIO.conversao(rotulo);
  }

  /** Escapa texto vindo do imoveis.js antes de jogar no HTML. */
  function limpo(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function moeda(valor) {
    if (valor == null || valor === '' || isNaN(valor)) return null;
    return 'R$ ' + Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  // --------------------------------------------- 1. links de WhatsApp na página
  function ligarLinksZap(raiz) {
    var alvos = (raiz || document).querySelectorAll('[data-zap]');
    Array.prototype.forEach.call(alvos, function (elemento) {
      elemento.setAttribute('href', linkZap(elemento.getAttribute('data-zap')));
      elemento.setAttribute('target', '_blank');
      elemento.setAttribute('rel', 'noopener');
      elemento.addEventListener('click', function () {
        marcarConversao(elemento.getAttribute('data-zap').slice(0, 60));
      });
    });
  }

  // ------------------------------------------------- 2. desenhar um card
  function montarCard(imovel) {
    var selo = SELOS[imovel.situacao] || SELOS.disponivel;
    var finalidade = acharEm(PARAM.finalidades, imovel.finalidade || 'venda');
    var preco = moeda(imovel.preco);
    if (preco && finalidade && finalidade.sufixo_preco) preco += '<span class="card__sufixo">' + limpo(finalidade.sufixo_preco) + '</span>';

    // Atributos: só entra o que existe. Lote não mostra "0 quartos".
    var atributos = [];
    if (imovel.area)    atributos.push('<li><strong>' + limpo(imovel.area) + '</strong> ' + limpo(imovel.unidade || 'm²') + '</li>');
    if (imovel.quartos) atributos.push('<li><strong>' + limpo(imovel.quartos) + '</strong> quarto' + (imovel.quartos > 1 ? 's' : '') + '</li>');
    if (imovel.suites)  atributos.push('<li><strong>' + limpo(imovel.suites) + '</strong> suíte' + (imovel.suites > 1 ? 's' : '') + '</li>');
    if (imovel.vagas)   atributos.push('<li><strong>' + limpo(imovel.vagas) + '</strong> vaga' + (imovel.vagas > 1 ? 's' : '') + '</li>');
    (imovel.destaques || []).forEach(function (d) { atributos.push('<li>' + limpo(d) + '</li>'); });

    var temFoto = imovel.fotos && imovel.fotos.length;
    var foto = temFoto
      ? '<img class="card__imagem" src="' + limpo(imovel.fotos[0]) + '" alt="' + limpo(imovel.titulo) + '" loading="lazy">'
      : '<span class="card__semfoto">fotos no WhatsApp</span>';

    var mensagem = 'Olá, Negocie Imobiliária! Vi no site o imóvel ' + imovel.codigo +
      ' (' + imovel.titulo + ') e queria saber mais.';

    var artigo = document.createElement('article');
    artigo.className = 'card' + (imovel.situacao === 'vendido' ? ' card--vendido' : '');
    artigo.setAttribute('data-tipo', imovel.tipo || 'casa');
    artigo.setAttribute('data-grupo', grupoDe(imovel.tipo || 'casa'));
    artigo.setAttribute('data-situacao', imovel.situacao || 'disponivel');
    artigo.setAttribute('data-finalidade', imovel.finalidade || 'venda');
    artigo.setAttribute('data-bairro', normal(imovel.bairro));
    artigo.setAttribute('data-busca', normal([imovel.codigo, imovel.titulo, imovel.bairro, imovel.cidade,
      rotuloTipo(imovel.tipo || 'casa'), finalidade ? finalidade.rotulo : ''].join(' ')));

    artigo.innerHTML =
      '<div class="card__foto' + (temFoto ? '' : ' card__foto--marca') + '">' +
        foto +
        '<img class="card__selo" src="' + selo.arquivo + '" alt="' + selo.texto + '" width="58" height="58">' +
        (imovel.exemplo ? '<span class="card__exemplo">EXEMPLO</span>' : '') +
      '</div>' +
      '<div class="card__corpo">' +
        '<span class="card__codigo">' + limpo(imovel.codigo) +
          ((imovel.finalidade || 'venda') !== 'venda' && finalidade ? ' · ' + limpo(finalidade.rotulo) : '') + '</span>' +
        '<h3 class="card__titulo">' + limpo(imovel.titulo) + '</h3>' +
        '<p class="card__local">' + limpo(imovel.bairro) + ' · ' + limpo(imovel.cidade) + '</p>' +
        '<p class="card__preco">' +
          (preco ? preco : 'Sob consulta<small>valor combinado direto</small>') +
        '</p>' +
        (atributos.length ? '<ul class="card__atributos">' + atributos.join('') + '</ul>' : '') +
        '<div class="card__acao">' +
          (imovel.situacao === 'vendido'
            ? '<a class="botao botao--zap" data-zap="Olá, Negocie Imobiliária! Vi que o ' + limpo(imovel.codigo) +
              ' foi vendido. Você tem algo parecido?">Quero algo parecido</a>'
            : '<a class="botao botao--zap" data-zap="' + limpo(mensagem) + '">Tenho interesse</a>') +
        '</div>' +
      '</div>';

    return artigo;
  }

  // ------------------------------------------------- 3. montar e filtrar a grade
  function iniciarGrade() {
    var grade = document.getElementById('grade-imoveis');
    var vazio = document.getElementById('grade-vazio');
    if (!grade) return;

    var lista = window.IMOVEIS || [];

    // Vitrine ainda sem nenhum imóvel (o site subiu antes da primeira remessa):
    // a frase "nesse filtro" não faz sentido aqui, então trocamos o texto e
    // escondemos os botões de filtro — não há o que filtrar.
    if (lista.length === 0 && vazio) {
      vazio.innerHTML =
        'Estamos preparando a vitrine com os imóveis desta semana. ' +
        '<a data-zap="Olá, Negocie Imobiliária! Vi o site e quero saber quais imóveis você tem agora.">' +
        'Fale comigo</a> que eu te mando as opções na hora.';
      // ⚠ ligarLinksZap(document) já rodou no DOMContentLoaded, ANTES daqui:
      // sem esta linha o "Fale comigo" vira link morto — e numa vitrine vazia
      // ele é a única conversão da página.
      ligarLinksZap(vazio);
      var filtros = document.querySelector('.filtros');
      if (filtros) filtros.hidden = true;
    }

    // Ordem de exibição: novidade primeiro, vendido por último.
    var peso = { novidade: 0, disponivel: 1, vendido: 2 };
    lista = lista.slice().sort(function (a, b) {
      return (peso[a.situacao] || 1) - (peso[b.situacao] || 1);
    });

    lista.forEach(function (imovel) { grade.appendChild(montarCard(imovel)); });
    ligarLinksZap(grade);

    // Landing de campanha nasce com o filtro dela já aplicado: quem clicou num
    // anúncio de fazenda tem que ver fazenda na primeira tela, não a carteira
    // inteira. É o mesmo "message match" que barateia o clique.
    var inicial = grade.getAttribute('data-filtro-inicial') || 'todos';
    var estado = { tipo: inicial, bairro: '', finalidade: '', texto: '' };

    var caixa = document.querySelector('.filtros');
    if (caixa && lista.length) montarFiltros(caixa, lista, estado, aplicar);

    function aplicar() {
      var visiveis = 0;
      var texto = normal(estado.texto).trim();
      Array.prototype.forEach.call(grade.children, function (card) {
        var vendido = card.getAttribute('data-situacao') === 'vendido';
        var mostra =
          estado.tipo === 'todos'   ? !vendido :
          estado.tipo === 'vendido' ? vendido :
          ((card.getAttribute('data-tipo') === estado.tipo || card.getAttribute('data-grupo') === estado.tipo) && !vendido);
        if (mostra && estado.bairro) mostra = card.getAttribute('data-bairro') === estado.bairro;
        if (mostra && estado.finalidade) mostra = card.getAttribute('data-finalidade') === estado.finalidade;
        if (mostra && texto) mostra = card.getAttribute('data-busca').indexOf(texto) !== -1;
        card.hidden = !mostra;
        if (mostra) visiveis++;
      });
      // vitrine vazia: 0 visiveis -> o aviso de "preparando" (o unico Fale comigo da grade) aparece
      if (vazio) vazio.hidden = visiveis > 0;
    }
    aplicar();
  }

  /**
   * Os filtros saem dos DADOS: um botão por tipo que tem imóvel publicado (na
   * ordem do parametros.js; tipo fora dele vai no fim com o próprio nome),
   * "Vendidos" só se houver vendido, lista de bairros dos próprios imóveis e
   * venda/aluguel só quando existem as duas.
   */
  function montarFiltros(caixa, lista, estado, aplicar) {
    caixa.innerHTML = '';
    var tipos = [], bairros = {}, finalidades = {}, temVendido = false;
    lista.forEach(function (im) {
      if (im.situacao === 'vendido') { temVendido = true; return; }
      var t = im.tipo || 'casa';
      if (tipos.indexOf(t) === -1) tipos.push(t);
      if (im.bairro) bairros[normal(im.bairro)] = im.bairro;
      finalidades[im.finalidade || 'venda'] = true;
    });
    // A landing pede o filtro dela (um grupo) mesmo vazio: o botão aparece
    // ativo, logo depois de "Todos", e a grade mostra o aviso de "nada
    // publicado nesse filtro".
    if (estado.tipo !== 'todos' && estado.tipo !== 'vendido' && tipos.indexOf(estado.tipo) === -1) tipos.push(estado.tipo);
    var ordem = (PARAM.grupos || []).concat(PARAM.tipos || []).map(function (p) { return p.valor; });
    tipos.sort(function (a, b) {
      var ia = ordem.indexOf(a), ib = ordem.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    var linha = document.createElement('div');
    linha.className = 'filtros__tipos';
    var botoes = [['todos', 'Todos']].concat(tipos.map(function (t) { return [t, rotuloTipo(t)]; }));
    if (temVendido) botoes.push(['vendido', 'Vendidos']);
    botoes.forEach(function (par) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'filtro' + (par[0] === estado.tipo ? ' filtro--ativo' : '');
      b.setAttribute('data-filtro', par[0]);
      b.setAttribute('aria-pressed', String(par[0] === estado.tipo));
      b.textContent = par[1];
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(linha.children, function (x) {
          x.classList.remove('filtro--ativo'); x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('filtro--ativo'); b.setAttribute('aria-pressed', 'true');
        estado.tipo = par[0];
        aplicar();
      });
      linha.appendChild(b);
    });
    caixa.appendChild(linha);

    var busca = document.createElement('div');
    busca.className = 'busca';

    var rotTexto = document.createElement('label');
    rotTexto.className = 'busca__campo busca__campo--texto';
    rotTexto.innerHTML = '<span>Buscar</span>';
    var entrada = document.createElement('input');
    entrada.type = 'search';
    entrada.placeholder = 'Código, bairro, tipo…';
    entrada.addEventListener('input', function () { estado.texto = entrada.value; aplicar(); });
    rotTexto.appendChild(entrada);
    busca.appendChild(rotTexto);

    var chaves = Object.keys(bairros).sort();
    if (chaves.length > 1) {
      var rotBairro = document.createElement('label');
      rotBairro.className = 'busca__campo';
      rotBairro.innerHTML = '<span>Bairro</span>';
      var sel = document.createElement('select');
      sel.innerHTML = '<option value="">Todos os bairros</option>' + chaves.map(function (k) {
        return '<option value="' + limpo(k) + '">' + limpo(bairros[k]) + '</option>';
      }).join('');
      sel.addEventListener('change', function () { estado.bairro = sel.value; aplicar(); });
      rotBairro.appendChild(sel);
      busca.appendChild(rotBairro);
    }

    var fins = Object.keys(finalidades);
    if (fins.length > 1) {
      var rotFin = document.createElement('label');
      rotFin.className = 'busca__campo';
      rotFin.innerHTML = '<span>Negócio</span>';
      var selF = document.createElement('select');
      selF.innerHTML = '<option value="">Venda e aluguel</option>' + fins.map(function (f) {
        var p = acharEm(PARAM.finalidades, f);
        return '<option value="' + limpo(f) + '">' + limpo(p ? p.rotulo : f) + '</option>';
      }).join('');
      selF.addEventListener('change', function () { estado.finalidade = selF.value; aplicar(); });
      rotFin.appendChild(selF);
      busca.appendChild(rotFin);
    }
    caixa.appendChild(busca);
  }

  // --------------------------------------------- 4. formulário vira WhatsApp
  function iniciarFormulario() {
    var form = document.getElementById('form-anunciar');
    if (!form) return;

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var d = new FormData(form);

      var linhas = [
        'Olá, Negocie Imobiliária! Quero anunciar um imóvel com você.',
        '',
        'Nome: ' + (d.get('nome') || ''),
        'Tipo: ' + (d.get('tipo') || ''),
        'Onde fica: ' + (d.get('local') || '')
      ];
      if (d.get('valor')) linhas.push('Valor pretendido: ' + d.get('valor'));
      if (d.get('obs'))   linhas.push('', d.get('obs'));

      window.open(linkZap(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  // ------------------------------------------------------- 5. menu do celular
  function iniciarMenu() {
    var botao = document.querySelector('.menu-botao');
    var menu = document.getElementById('menu');
    if (!botao || !menu) return;

    botao.addEventListener('click', function () {
      var aberto = menu.getAttribute('data-aberto') === 'sim';
      menu.setAttribute('data-aberto', aberto ? 'nao' : 'sim');
      botao.setAttribute('aria-expanded', String(!aberto));
    });

    menu.addEventListener('click', function (evento) {
      if (evento.target.tagName === 'A') {
        menu.setAttribute('data-aberto', 'nao');
        botao.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------- início
  document.addEventListener('DOMContentLoaded', function () {
    ligarLinksZap(document);
    iniciarGrade();
    iniciarFormulario();
    iniciarMenu();

    var ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
  });
})();
