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

   >>> 09/10/2026: vitrine montada dos posts publicos dela (@cynaraleles.imoveis), aprovada por ele. Antes:: o site foi publicado ANTES     <<<
   >>> do primeiro imovel. Cada remessa da Cynara pelo Telegram entra aqui. <<<
   ========================================================================== */

window.IMOVEIS = [
  {
    "codigo": "NG01",
    "titulo": "Casa com 2 salas comerciais",
    "tipo": "urbano",
    "bairro": "Centro",
    "preco": null,
    "area": null,
    "unidade": "m²",
    "quartos": 3,
    "suites": 1,
    "vagas": 1,
    "destaques": [
      "2 salas comerciais",
      "quintal",
      "pra morar e pra comércio"
    ],
    "descricao": "3 quartos (1 suíte), duas salas, cozinha, banheiro social, despensa, lavanderia, quintal e garagem, além de 2 salas comerciais.",
    "situacao": "disponivel",
    "cidade": "Jataí - GO",
    "fotos": [
      "img/imoveis/NG01.jpg"
    ]
  },
  {
    "codigo": "NG02",
    "titulo": "Terreno de 300 m² no Flamboyant",
    "tipo": "urbano",
    "bairro": "Flamboyant",
    "preco": null,
    "area": 300,
    "unidade": "m²",
    "quartos": 0,
    "suites": 0,
    "vagas": 0,
    "destaques": [
      "contra esquina",
      "aterrado e murado",
      "perto do Aquarela e do Hamoa"
    ],
    "descricao": "Terreno pronto para construir: contra esquina, aterrado e murado, perto de hipermercado e universidade.",
    "situacao": "disponivel",
    "cidade": "Jataí - GO",
    "fotos": [
      "img/imoveis/NG02.jpg"
    ]
  },
  {
    "codigo": "NG03",
    "titulo": "Lançamento: torre única de 29 andares",
    "tipo": "lancamento",
    "bairro": "Vista do espelho d'água",
    "preco": null,
    "area": null,
    "unidade": "m²",
    "quartos": 0,
    "suites": 0,
    "vagas": 0,
    "destaques": [
      "176 apartamentos",
      "vista para o espelho d'água",
      "energia solar"
    ],
    "descricao": "Torre única de 29 pavimentos e 176 apartamentos, com isolamento acústico, fechadura digital e vaga com carregador de carro elétrico.",
    "situacao": "disponivel",
    "cidade": "Jataí - GO",
    "fotos": [
      "img/imoveis/NG03.jpg"
    ]
  },
  {
    "codigo": "NG04",
    "titulo": "Brisas Habitat — apartamentos de 1 ou 3 suítes",
    "tipo": "lancamento",
    "bairro": "Brisas Habitat",
    "preco": null,
    "area": null,
    "unidade": "m²",
    "quartos": 0,
    "suites": 0,
    "vagas": 0,
    "destaques": [
      "1 ou 3 suítes",
      "81 a 111 m²",
      "lançamento"
    ],
    "descricao": "Lançamento na região mais valorizada de Jataí: apartamentos de 1 ou 3 suítes, de 81 a 111 m².",
    "situacao": "disponivel",
    "cidade": "Jataí - GO",
    "fotos": [
      "img/imoveis/NG04.jpg"
    ]
  },
  {
    "codigo": "NG05",
    "titulo": "Brisas 111 — lotes da 3ª etapa",
    "tipo": "lancamento",
    "bairro": "Brisas 111",
    "preco": null,
    "area": 300,
    "unidade": "m² (a partir de)",
    "quartos": 0,
    "suites": 0,
    "vagas": 0,
    "destaques": [
      "financiamento direto com a construtora"
    ],
    "descricao": "Terceira e última etapa do Brisas 111: lotes a partir de 300 m², com financiamento direto com a construtora.",
    "situacao": "disponivel",
    "cidade": "Jataí - GO",
    "fotos": [
      "img/imoveis/NG05.jpg"
    ]
  }
];
