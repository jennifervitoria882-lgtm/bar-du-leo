/* ==========================================================================
   BAR DU LÉO — DADOS DA LOJA
   Este é o único arquivo que você precisa editar para mudar:
   - número do WhatsApp, pedido mínimo e horários (CONFIG / HORARIOS)
   - produtos, preços, descrições e fotos (PRODUCTS)

   Fotos: coloque o arquivo em imagens/produtos/ e escreva o nome em "image".
   Produto sem "image" (ou com arquivo inexistente) aparece com a logo do bar.
   ========================================================================== */

const CONFIG = {
  nome: "Bar du Léo",
  whatsapp: "5532988040130",   // 55 + DDD + número (somente dígitos)
  pedidoMinimoDelivery: 20,    // em reais
  tempoEstimado: "30 a 40 minutos",
  bloquearForaDoHorario: false // true = impede enviar pedido com o bar fechado
};

/* Horários: [abre, fecha] em horas. null = fechado. 0 = domingo ... 6 = sábado */
const HORARIOS = {
  0: [10, 17],
  1: null,
  2: [8, 21],
  3: [8, 21],
  4: [8, 21],
  5: [8, 21],
  6: [10, 17]
};

/* Campos de cada produto:
   id, name, category, price, description  → obrigatórios
   image         → nome do arquivo em imagens/produtos/
   note          → aviso curto exibido abaixo da descrição
   alcohol       → true exibe selo +18 e pede confirmação de idade
   options       → lista de escolhas (sabor/marca) que o cliente deve selecionar
   optionLabel   → texto do seletor
   optionMode    → "append" (Nome - Opção) ou "replace" (só a opção) no carrinho */
const PRODUCTS = [
  /* ---------- Pastéis ---------- */
  { id: 1, name: "Trio da praça", category: "Pastéis", price: 25.00,
    image: "trio-da-praca.jpg",
    description: "Para quem quer provar de tudo: três pastéis crocantes, um de carne, um de queijo e um de frango, fritos na hora." },

  { id: 2, name: "Pastel", category: "Pastéis", price: 9.50,
    image: "pastel.jpg",
    description: "Crocante e preparado na hora, com o recheio que você escolher entre 14 sabores, do clássico queijo ao de chocolate.",
    optionLabel: "Escolha o sabor", optionMode: "append",
    options: ["Queijo", "Carne", "Frango", "Palmito", "Pizza", "Linguiça", "Jiló", "Cachorro-quente",
              "Carne seca", "Salmão", "Bacalhau", "Camarão", "Banana", "Chocolate"] },

  /* ---------- Bolinhos ---------- */
  { id: 20, name: "Bolinha de queijo (porção 1/4)", category: "Bolinhos", price: 15,
    image: "bolinha-de-queijo-porcao-1-4.jpg",
    description: "Bolinhas de queijo douradinhas, ótimas para dividir na mesa com uma cerveja bem gelada." },

  { id: 21, name: "Bolinha de bacalhau (porção 1/4)", category: "Bolinhos", price: 16,
    image: "bolinha-de-bacalhau-porcao-1-4.jpg",
    description: "Bolinhas de bacalhau saborosas, um clássico de boteco para beliscar à vontade." },

  { id: 22, name: "Bolinho de quibe (porção 1/4)", category: "Bolinhos", price: 15,
    image: "bolinho-de-quibe-porcao-1-4.jpg",
    description: "Porção de bolinhos de quibe, petisco tradicional de boteco para dividir (e disputar) na mesa." },

  /* ---------- Caldos ---------- */
  { id: 30, name: "Feijão amigo", category: "Caldos", price: 25, image: "feijao-amigo.jpg",
    description: "Caldo de feijão encorpado e reconfortante, um clássico da casa para esquentar o dia." },
  { id: 31, name: "Feijão amigo (pequeno)", category: "Caldos", price: 20, image: "feijao-amigo-pequeno.jpg",
    description: "O mesmo caldo de feijão da casa em porção menor, na medida para uma refeição leve." },
  { id: 32, name: "Baroa", category: "Caldos", price: 25, image: "baroa.jpg",
    description: "Caldo de batata-baroa, suave e acolhedor, direto da panela da casa." },
  { id: 33, name: "Canjiquinha", category: "Caldos", price: 25, image: "canjiquinha.jpg",
    description: "Sabor mineiro em caldo quentinho: canjiquinha feita para aquecer e matar a fome." },
  { id: 34, name: "Vaca atolada", category: "Caldos", price: 25, image: "vaca-atolada.jpg",
    description: "Clássico da cozinha mineira em versão caldo: encorpado, quentinho e cheio de sabor." },
  { id: 35, name: "Ervilha", category: "Caldos", price: 25, image: "ervilha.jpg",
    description: "Caldo de ervilha suave e aveludado, uma opção leve e saborosa da casa." },

  /* ---------- Sanduíches ---------- */
  { id: 40, name: "Sanduíche de carne cozida", category: "Sanduíches", price: 22,
    image: "sanduiche-de-carne-cozida.jpg",
    description: "Carne cozida macia e suculenta no pão, preparado na hora para matar a fome com gosto." },
  { id: 41, name: "Sanduíche de moela", category: "Sanduíches", price: 22,
    image: "sanduiche-de-moela.jpg",
    description: "Moela bem temperada no pão, preparada na hora: o sabor autêntico do boteco." },
  { id: 42, name: "Sanduíche de linguiça", category: "Sanduíches", price: 22,
    image: "sanduiche-de-linguica.jpg",
    description: "Linguiça saborosa e suculenta no pão, preparada na hora para quem não abre mão de sabor." },

  /* ---------- Tira-gosto ---------- */
  { id: 50, name: "Mandioca", category: "Tira-gosto", price: 23, image: "mandioca.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Mandioca para beliscar, a companheira perfeita da cerveja gelada." },
  { id: 51, name: "Linguiça", category: "Tira-gosto", price: 30, image: "linguica.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Linguiça para petiscar e dividir, com aquele sabor de boteco que combina com tudo." },
  { id: 52, name: "Moela", category: "Tira-gosto", price: 42, image: "moela.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Moela bem temperada, o petisco clássico de quem ama boteco de verdade." },
  { id: 53, name: "Fritas", category: "Tira-gosto", price: 17, image: "fritas.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Batata frita crocante e dourada, daquelas porções que nunca sobram." },
  { id: 54, name: "Fritas com queijo", category: "Tira-gosto", price: 19, image: "fritas-com-queijo.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Fritas crocantes cobertas com queijo cremoso: irresistível do primeiro ao último pedaço." },
  { id: 55, name: "Carne cozida", category: "Tira-gosto", price: 45, image: "carne-cozida.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Carne cozida macia e suculenta, para petiscar e compartilhar na mesa." },
  { id: 56, name: "Carne seca", category: "Tira-gosto", price: 45, image: "carne-seca.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Carne seca de sabor marcante, petisco tradicional que combina com cerveja gelada." },
  { id: 57, name: "Salaminho", category: "Tira-gosto", price: 30, image: "salaminho.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Salaminho fatiado, prático e saboroso, ótimo para acompanhar a primeira rodada." },
  { id: 58, name: "Quibe cru", category: "Tira-gosto", price: 35, image: "quibe-cru.jpg",
    note: "Disponível em meia ou inteira — confirme o tamanho no WhatsApp.",
    description: "Quibe cru bem temperado, tradição de boteco para quem gosta de sabor marcante." },

  /* ---------- Cervejas ---------- */
  { id: 60, name: "Heineken / Cerveja Bar du Léo", category: "Cervejas", price: 19, alcohol: true,
    image: "heineken-cerveja-bar-du-leo.jpg",
    description: "Escolha entre a Heineken e a cerveja da casa, sempre bem gelada.",
    optionLabel: "Escolha a cerveja", optionMode: "replace", options: ["Heineken", "Cerveja Bar du Léo"] },
  { id: 61, name: "Stella Artois", category: "Cervejas", price: 17, alcohol: true,
    image: "stella-artois.jpg",
    description: "Cerveja premium, leve e refrescante, servida bem gelada." },
  { id: 62, name: "Original / Spaten", category: "Cervejas", price: 16, alcohol: true,
    image: "original-spaten.jpg",
    description: "Duas clássicas para brindar: escolha entre Original e Spaten, bem geladas.",
    optionLabel: "Escolha a cerveja", optionMode: "replace", options: ["Original", "Spaten"] },
  { id: 63, name: "Amstel / Antarctica / Brahma", category: "Cervejas", price: 14, alcohol: true,
    image: "amstel-antarctica-brahma.jpg",
    description: "As favoritas da mesa de boteco: escolha entre Amstel, Antarctica ou Brahma, geladíssimas.",
    optionLabel: "Escolha a cerveja", optionMode: "replace", options: ["Amstel", "Antarctica", "Brahma"] },
  { id: 64, name: "Therezópolis / Skol", category: "Cervejas", price: 14, alcohol: true,
    image: "therezopolis-skol.jpg",
    description: "Escolha entre Therezópolis e Skol, geladas no ponto certo.",
    optionLabel: "Escolha a cerveja", optionMode: "replace", options: ["Therezópolis", "Skol"] },
  { id: 65, name: "Petra / Ecobier", category: "Cervejas", price: 12, alcohol: true,
    image: "petra-ecobier.jpg",
    description: "Opções leves e com ótimo custo-benefício para esticar a conversa: Petra ou Ecobier.",
    optionLabel: "Escolha a cerveja", optionMode: "replace", options: ["Petra", "Ecobier"] },
  { id: 66, name: "Chopp São Bartolomeu", category: "Cervejas", price: 13, alcohol: true,
    image: "chopp-sao-bartolomeu.jpg",
    description: "Chopp geladinho, com aquele colarinho que todo mundo gosta, para brindar na praça." },
  { id: 67, name: "Long neck / Long neck zero", category: "Cervejas", price: 13, alcohol: true,
    image: "long-neck-long-neck-zero.jpg",
    description: "Long neck bem gelada, com a opção zero para quem prefere.",
    optionLabel: "Escolha a opção", optionMode: "replace", options: ["Long neck", "Long neck zero"] },

  /* ---------- Drinks ---------- */
  { id: 70, name: "Caipirinha (pinga)", category: "Drinks", price: 25, alcohol: true,
    image: "caipirinha-pinga.jpg",
    description: "A clássica caipirinha brasileira feita com pinga, preparada na hora e bem gelada." },
  { id: 71, name: "Caipiríssima (vodka)", category: "Drinks", price: 27, alcohol: true,
    image: "caipirissima-vodka.jpg",
    description: "A versão com vodka da nossa caipirinha: refrescante, cítrica e preparada na hora." },

  /* ---------- Doses ---------- */
  { id: 80, name: "Campari", category: "Doses", price: 15, alcohol: true, image: "campari.jpg",
    description: "Dose de Campari, o aperitivo de sabor marcante que abre o apetite." },
  { id: 81, name: "Vodka Orloff / Smirnoff", category: "Doses", price: 15, alcohol: true,
    image: "vodka-orloff-smirnoff.jpg",
    description: "Dose de vodka bem gelada: escolha entre Orloff e Smirnoff.",
    optionLabel: "Escolha a vodka", optionMode: "replace", options: ["Vodka Orloff", "Vodka Smirnoff"] },
  { id: 82, name: "Cachaça (pinga)", category: "Doses", price: 9, alcohol: true, image: "cachaca-pinga.jpg",
    description: "Dose da boa e tradicional pinga brasileira, para brindar do jeito clássico." },
  { id: 83, name: "Cachaça Dom Bré", category: "Doses", price: 15, alcohol: true,
    image: "cachaca-dom-bre.jpg",
    description: "Dose de cachaça Dom Bré, para apreciar com calma e boa conversa." },
  { id: 84, name: "Tequila", category: "Doses", price: 20, alcohol: true, image: "tequila.jpg",
    description: "Dose de tequila para animar a mesa e dar o tom da noitada." },
  { id: 85, name: "Rum / Licor 43", category: "Doses", price: 15, alcohol: true, image: "rum-licor-43.jpg",
    description: "Dose de rum ou de Licor 43, para os momentos animados da roda de amigos.",
    optionLabel: "Escolha a dose", optionMode: "replace", options: ["Rum", "Licor 43"] },
  { id: 86, name: "Whisky Red Label", category: "Doses", price: 24, alcohol: true, image: "whisky-red-label.jpg",
    description: "Dose de whisky Red Label, clássico e encorpado, ótimo para servir com gelo." },
  { id: 87, name: "Gin Tanqueray", category: "Doses", price: 26, alcohol: true, image: "gin-tanqueray.jpg",
    description: "Dose de gin Tanqueray, seco e aromático, para quem gosta de sabores marcantes." },
  { id: 88, name: "Conhaque Domecq", category: "Doses", price: 12, alcohol: true, image: "conhaque-domecq.jpg",
    description: "Dose de conhaque Domecq, para aquecer e fechar a noite com sabor." },

  /* ---------- Alcoólicas ---------- */
  { id: 90, name: "Skol Beats", category: "Alcoólicas", price: 17, alcohol: true, image: "skol-beats.jpg",
    description: "Bebida mista Skol Beats, doce e refrescante, para animar a noite." },
  { id: 91, name: "Xeque Mate", category: "Alcoólicas", price: 17, alcohol: true, image: "xeque-mate.jpg",
    description: "Xeque Mate bem gelada, saborosa e perfeita para brindar com a turma." },
  { id: 92, name: "Vinho grande", category: "Alcoólicas", price: 57, alcohol: true, image: "vinho-grande.jpg",
    description: "Garrafa grande de vinho, ótima para dividir à mesa com todo mundo." },
  { id: 93, name: "Vinho pequeno", category: "Alcoólicas", price: 37, alcohol: true, image: "vinho-pequeno.jpg",
    description: "Garrafa pequena de vinho, na medida certa para um brinde a dois." },

  /* ---------- Não alcoólicas ---------- */
  { id: 100, name: "Refrigerante (lata)", category: "Não alcoólicas", price: 7, image: "refrigerante-lata.jpg",
    description: "Refrigerante em lata, bem gelado, para acompanhar o seu petisco." },
  { id: 101, name: "Refrigerante (600ml)", category: "Não alcoólicas", price: 10, image: "refrigerante-600ml.jpg",
    description: "Refrigerante de 600 ml, geladinho e ótimo para compartilhar." },
  { id: 102, name: "Suco de laranja / limão", category: "Não alcoólicas", price: 12, image: "suco-de-laranja-limao.jpg",
    description: "Suco refrescante de laranja ou de limão, gelado e saboroso.",
    optionLabel: "Escolha o sabor", optionMode: "replace", options: ["Suco de laranja", "Suco de limão"] },
  { id: 103, name: "Energético Red Bull", category: "Não alcoólicas", price: 17, image: "energetico-red-bull.jpg",
    description: "Red Bull geladinho para dar aquela energia extra." },
  { id: 104, name: "Shot de limão", category: "Não alcoólicas", price: 2, image: "shot-de-limao.jpg",
    description: "Uma dose cítrica e refrescante de limão para acompanhar a sua bebida." },
  { id: 105, name: "Água", category: "Não alcoólicas", price: 5, image: "agua.jpg",
    description: "Água geladinha para matar a sede." }
];
