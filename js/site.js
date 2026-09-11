/* =============================================================================
   NEGOCIE IMOBILIÁRIA — comportamento do site (v1)

   O site é 100% estático: não existe servidor, banco nem formulário que grave
   nada. Todo contato termina numa conversa de WhatsApp já escrita — o visitante
   só aperta enviar. Isso mantém o custo em zero e o dado do visitante fora do
   ar (nada trafega nem fica guardado em lugar nenhum).

   Este arquivo faz cinco coisas:
     1. monta os links de WhatsApp a partir dos atributos data-zap
     2. desenha os cards de imóvel a partir de js/imoveis.js
     3. filtra a grade (todos / urbanos / rurais / vendidos)
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
    var preco = moeda(imovel.preco);

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

    var mensagem = 'Olá, Cynara! Vi no site o imóvel ' + imovel.codigo +
      ' (' + imovel.titulo + ') e queria saber mais.';

    var artigo = document.createElement('article');
    artigo.className = 'card' + (imovel.situacao === 'vendido' ? ' card--vendido' : '');
    artigo.setAttribute('data-tipo', imovel.tipo || 'urbano');
    artigo.setAttribute('data-situacao', imovel.situacao || 'disponivel');

    artigo.innerHTML =
      '<div class="card__foto' + (temFoto ? '' : ' card__foto--marca') + '">' +
        foto +
        '<img class="card__selo" src="' + selo.arquivo + '" alt="' + selo.texto + '" width="58" height="58">' +
        (imovel.exemplo ? '<span class="card__exemplo">EXEMPLO</span>' : '') +
      '</div>' +
      '<div class="card__corpo">' +
        '<span class="card__codigo">' + limpo(imovel.codigo) + '</span>' +
        '<h3 class="card__titulo">' + limpo(imovel.titulo) + '</h3>' +
        '<p class="card__local">' + limpo(imovel.bairro) + ' · ' + limpo(imovel.cidade) + '</p>' +
        '<p class="card__preco">' +
          (preco ? preco : 'Sob consulta<small>valor combinado direto</small>') +
        '</p>' +
        (atributos.length ? '<ul class="card__atributos">' + atributos.join('') + '</ul>' : '') +
        '<div class="card__acao">' +
          (imovel.situacao === 'vendido'
            ? '<a class="botao botao--zap" data-zap="Olá, Cynara! Vi que o ' + limpo(imovel.codigo) +
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
        '<a data-zap="Olá, Cynara! Vi o site e quero saber quais imóveis você tem agora.">' +
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

    function aplicar(filtro) {
      var visiveis = 0;
      Array.prototype.forEach.call(grade.children, function (card) {
        var mostra =
          filtro === 'todos'   ? card.getAttribute('data-situacao') !== 'vendido' :
          filtro === 'vendido' ? card.getAttribute('data-situacao') === 'vendido' :
          (card.getAttribute('data-tipo') === filtro && card.getAttribute('data-situacao') !== 'vendido');
        card.hidden = !mostra;
        if (mostra) visiveis++;
      });
      if (vazio) vazio.hidden = visiveis > 0;
    }

    var botoes = document.querySelectorAll('.filtro');
    Array.prototype.forEach.call(botoes, function (botao) {
      botao.addEventListener('click', function () {
        Array.prototype.forEach.call(botoes, function (b) { b.classList.remove('filtro--ativo'); });
        botao.classList.add('filtro--ativo');
        aplicar(botao.getAttribute('data-filtro'));
      });
    });

    // Landing de campanha nasce com o filtro dela já aplicado: quem clicou num
    // anúncio de fazenda tem que ver fazenda na primeira tela, não a carteira
    // inteira. É o mesmo "message match" que barateia o clique.
    var inicial = grade.getAttribute('data-filtro-inicial') || 'todos';
    var botaoInicial = document.querySelector('.filtro[data-filtro="' + inicial + '"]');
    if (botaoInicial) {
      Array.prototype.forEach.call(botoes, function (b) { b.classList.remove('filtro--ativo'); });
      botaoInicial.classList.add('filtro--ativo');
    }
    aplicar(inicial);
  }

  // --------------------------------------------- 4. formulário vira WhatsApp
  function iniciarFormulario() {
    var form = document.getElementById('form-anunciar');
    if (!form) return;

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var d = new FormData(form);

      var linhas = [
        'Olá, Cynara! Quero anunciar um imóvel com você.',
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
