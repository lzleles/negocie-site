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
  {
    "codigo": "NG01",
    "titulo": "Casa 3 quartos",
    "tipo": "casa",
    "finalidade": "venda",
    "bairro": "Central",
    "preco": 670000,
    "area": 176,
    "unidade": "m² construídos",
    "quartos": 3,
    "suites": 1,
    "vagas": 1,
    "destaques": [
      "Quintal amplo com área coberta e edícula com cozinha e despensa",
      "Terreno de 348 m²",
      "1 banheiro social",
      "2 cômodos onde funcionava um consultório: dá pra montar um comércio na frente da casa",
      "Excelente estado de conservação"
    ],
    "descricao": "Endereço: Rua Capitão Francisco Joaquim Vilela, 1001, bairro Central, Jataí-GO.",
    "situacao": "novidade",
    "cidade": "Jataí-GO",
    "fotos": [
      "img/imoveis/NG01-01.jpg",
      "img/imoveis/NG01-02.jpg",
      "img/imoveis/NG01-03.jpg",
      "img/imoveis/NG01-04.jpg",
      "img/imoveis/NG01-05.jpg",
      "img/imoveis/NG01-06.jpg",
      "img/imoveis/NG01-07.jpg",
      "img/imoveis/NG01-08.jpg",
      "img/imoveis/NG01-09.jpg",
      "img/imoveis/NG01-10.jpg"
    ]
  }
];
