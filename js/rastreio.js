/* =============================================================================
   RASTREIO — de onde veio o lead, e avisar o Google quando ele acontece
   =============================================================================

   Faz duas coisas, e as duas resolvem um problema concreto de quem anuncia:

   1. CARIMBA A ORIGEM NA MENSAGEM DO WHATSAPP.
      A pessoa clica no anúncio, cai na página, aperta o botão e a conversa
      abre já escrita. No fim da mensagem entra uma linha discreta dizendo de
      onde ela veio — a campanha e a página. Assim a Cynara sabe, olhando o
      próprio WhatsApp, qual anúncio está trazendo gente. Sem CRM, sem planilha.

   2. AVISA O GOOGLE ADS QUE HOUVE CONTATO.
      Clique não é resultado. Sem conversão medida, o Google não tem como
      aprender e a campanha vira caça-níquel caro. Aqui o clique no botão de
      WhatsApp dispara a conversão E abre a conversa — ganha nos dois lados.

   ⚠ POR QUE O ANÚNCIO NUNCA PODE APONTAR DIRETO PARA wa.me
     Duas razões, as duas caras. Primeira: mora na zona cinzenta da política de
     "destino incompatível" do Google, porque o domínio exibido tem que bater
     com o destino. Segunda, pior: clique que sai do site não deixa rastro
     nenhum — mata a medição. O anúncio aponta para a PÁGINA; a página tem o
     botão instrumentado.

   Tudo aqui é defensivo: se os códigos do Google não estiverem preenchidos no
   config.js, nada dispara e nada quebra.
   ========================================================================== */

(function () {
  'use strict';

  var CFG = window.CONFIG || {};
  var CHAVE = 'negocie_origem';

  /* ------------------------------------------------------ 1. guardar a origem
     Guardado em sessionStorage porque a pessoa pode navegar entre as páginas
     antes de clicar no botão: a origem tem que sobreviver ao caminho todo, mas
     não precisa sobreviver ao fechamento do navegador. */
  function capturarOrigem() {
    var p = new URLSearchParams(window.location.search);
    var dados = {
      campanha: p.get('utm_campaign') || '',
      origem: p.get('utm_source') || '',
      termo: p.get('utm_term') || '',
      gclid: p.get('gclid') || ''
    };

    var temAlgo = dados.campanha || dados.origem || dados.gclid;

    try {
      if (temAlgo) {
        sessionStorage.setItem(CHAVE, JSON.stringify(dados));
      } else {
        var salvo = sessionStorage.getItem(CHAVE);
        if (salvo) dados = JSON.parse(salvo);
      }
    } catch (e) {
      /* navegador com armazenamento bloqueado: segue sem histórico de origem */
    }

    return dados;
  }

  var ORIGEM = capturarOrigem();

  /** Linha curta que entra no fim da mensagem do WhatsApp. */
  function assinatura() {
    var pagina = (document.body.getAttribute('data-pagina') || '').trim();
    var partes = [];

    if (ORIGEM.campanha) partes.push(ORIGEM.campanha);
    else if (ORIGEM.gclid) partes.push('anúncio Google');
    if (ORIGEM.termo) partes.push('busca: ' + ORIGEM.termo);

    // A página só entra se acrescentar informação. Quando a campanha do anúncio
    // tem o mesmo nome da página (o caso normal, porque uma campanha aponta
    // para uma landing), repetir os dois só polui a mensagem.
    if (pagina && pagina !== ORIGEM.campanha) partes.push(pagina);

    return partes.length ? '\n\n— vim por: ' + partes.join(' · ') : '';
  }

  /* -------------------------------------------------- 2. carregar o gtag
     Só entra na página se houver ID configurado. Site sem anúncio no ar não
     carrega script de rastreio nenhum — mais rápido e sem cookie à toa. */
  function carregarGtag() {
    var ids = [CFG.ads_id, CFG.ga4_id].filter(Boolean);
    if (!ids.length) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    ids.forEach(function (id) { window.gtag('config', id); });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ids[0];
    document.head.appendChild(s);
  }

  /** Dispara a conversão de contato. Silencioso se não houver configuração. */
  function conversao(rotulo) {
    if (!window.gtag) return;

    if (CFG.conversao_whatsapp) {
      window.gtag('event', 'conversion', { send_to: CFG.conversao_whatsapp });
    }
    window.gtag('event', 'contato_whatsapp', {
      origem_pagina: document.body.getAttribute('data-pagina') || '',
      detalhe: rotulo || ''
    });
  }

  carregarGtag();

  window.RASTREIO = {
    assinatura: assinatura,
    conversao: conversao,
    origem: ORIGEM
  };
})();
