/* =============================================================================
   A CARTEIRA DE IMÓVEIS — este é o único arquivo que muda no dia a dia.
   =============================================================================

   COMO MEXER (vale para quem não programa):
   -----------------------------------------
   Cada imóvel é um bloco entre chaves { }, separado por vírgula.
   Copie um bloco inteiro, cole embaixo e troque os valores. Só isso.

   REGRAS QUE NÃO PODEM SER QUEBRADAS
   - Todo texto fica entre aspas duplas:  "Casa no Setor Aeroporto"
   - Número fica SEM aspas e SEM ponto:   450000   (não "R$ 450.000")
   - Preço em branco? escreva            null      (o site mostra "Sob consulta")
   - A vírgula separa um bloco do outro; o ÚLTIMO bloco não leva vírgula no fim.
   - Não use aspas duplas dentro do texto. Se precisar, use aspas simples.

   CAMPOS
   codigo    .. código curto que aparece no card e vai na mensagem do WhatsApp
   titulo    .. a chamada do imóvel
   tipo      .. "urbano", "rural" ou "lancamento"   (é o que o filtro do site usa)
                "lancamento" = loteamento ou condomínio novo, vendido na planta
   situacao  .. "disponivel", "novidade" ou "vendido"  (escolhe o selo do card)
   cidade    .. "Jataí - GO"
   bairro    .. bairro, setor ou nome da região/fazenda
   preco     .. só números, sem R$ e sem ponto. Ou null.
   area      .. número da área
   unidade   .. "m²" para urbano, "ha" para rural, "alq" para alqueire
   quartos   .. número (deixe 0 se não se aplica)
   suites    .. número
   vagas     .. número de vagas de garagem
   destaques .. lista curta de diferenciais, cada um entre aspas
   descricao .. um parágrafo. Aparece na mensagem do WhatsApp.
   fotos     .. lista de arquivos dentro de img/imoveis/. Lista vazia [] faz o
                card usar a arte da marca no lugar da foto — fica bonito, não
                fica quebrado.
   exemplo   .. true marca o card com a tarja EXEMPLO. APAGUE esta linha (ou
                troque para false) quando o imóvel for de verdade.

   >>> LISTA VAZIA DE PROPOSITO (10/09/2026): o site foi publicado ANTES     <<<
   >>> do primeiro imovel. Cada remessa da Cynara pelo Telegram entra aqui. <<<
   ========================================================================== */

window.IMOVEIS = [

  // Vazio de proposito. O site trata isso: mostra o aviso de "em breve" em vez
  // de uma grade quebrada. O primeiro imovel entra pela esteira do Telegram.

];
