/* =============================================================================
   CONFIGURAÇÃO — o único arquivo onde se colam os códigos do Google
   =============================================================================

   Enquanto os campos estiverem vazios, o site funciona normalmente: ele
   simplesmente não mede nada. Nada quebra, nada aparece errado para o visitante.

   ONDE ACHAR CADA CÓDIGO (só depois que a conta do Google Ads existir)

   ads_id ................ Google Ads → Ferramentas → Gerenciador de dados →
                           Tag do Google. Formato: AW-123456789
   conversao_whatsapp .... Google Ads → Metas → Conversões → nova conversão do
                           tipo "Site", ação "Contato". Ele entrega um rótulo.
                           Formato: AW-123456789/AbC-D_efGhIjKlM
   ga4_id ................ Google Analytics 4, se um dia houver. Formato: G-XXXXXXXXXX

   ⚠ Sem "conversao_whatsapp" preenchido, o Google Ads NÃO sabe quais cliques
     viraram conversa. Sem isso, lance inteligente não tem o que aprender e a
     campanha vira aposta. É o item mais importante desta lista.
   ========================================================================== */

window.CONFIG = {

  // Número no formato internacional, sem sinais: 55 + DDD + número.
  whatsapp: '5564996255946',

  // Códigos do Google — deixar vazio até a conta existir.
  ads_id: '',
  conversao_whatsapp: '',
  ga4_id: ''

};
