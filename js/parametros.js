/* =============================================================================
   OS PARÂMETROS DA VITRINE — o que o site sabe filtrar (LEGO, 10/10/2026)
   =============================================================================

   Ordem dele (10/10/2026): imóvel que chega pelo Telegram e está FORA destes
   parâmetros faz o site GANHAR o parâmetro. Quem escreve aqui é a casa
   (Postagem_Por_Cliente\lego_parametros_imoveis_v1.py, ajustar_parametro),
   não a mão.

   tipos ........ cada tipo vira um botão de filtro (só aparece o tipo que tem
                  imóvel publicado). "grupo" liga o tipo às páginas de campanha
                  (urbano = comprar-casa, rural = fazenda, lancamento = lotes).
                  "pagina" = a página própria do tipo, quando houver.
   grupos ....... o filtro das páginas de campanha (data-filtro-inicial).
   finalidades .. venda ou aluguel. Aluguel mostra o preço com "/mês".
   Bairro e cidade NÃO moram aqui: o filtro de bairro lê os próprios imóveis,
   então bairro novo entra sozinho, sem ajuste.

   ⚠ O miolo entre o = e o ; é JSON puro (aspas duplas, sem vírgula sobrando):
     o robô lê e grava este arquivo com um leitor de JSON.
   ========================================================================== */

window.PARAMETROS = {
  "tipos": [
    {"valor": "casa", "rotulo": "Casas", "grupo": "urbano"},
    {"valor": "apartamento", "rotulo": "Apartamentos", "grupo": "urbano"},
    {"valor": "lote", "rotulo": "Lotes", "grupo": "lancamento"},
    {"valor": "terreno", "rotulo": "Terrenos", "grupo": "urbano"},
    {"valor": "pontocomercial", "rotulo": "Pontos comerciais", "grupo": "urbano"},
    {"valor": "chacara", "rotulo": "Chácaras", "grupo": "rural"},
    {"valor": "fazenda", "rotulo": "Fazendas", "grupo": "rural"}
  ],
  "grupos": [
    {"valor": "lancamento", "rotulo": "Lançamentos"},
    {"valor": "urbano", "rotulo": "Urbanos"},
    {"valor": "rural", "rotulo": "Rurais"}
  ],
  "finalidades": [
    {"valor": "venda", "rotulo": "Venda", "sufixo_preco": ""},
    {"valor": "aluguel", "rotulo": "Aluguel", "sufixo_preco": "/mês"}
  ],
  "cidade_padrao": "Jataí - GO"
};
