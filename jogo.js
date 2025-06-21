let saveData = {
  nome: "",
  dinheiro: 0,
  energia: 100,
  sono: 0,
  data: { dia: 1, mes: 1, ano: 2025 },
  hora: 6,
  dormiuHoje: false,
  nivel: 1,
  cliquesTrabalho: 0,
  fome: 0,
  sede: 0,
  contaAluguel: false,
  contaEnergia: false,
  contaAgua:false,
};


const dados = sessionStorage.getItem("dadosJogo");
if (dados) {
  saveData = { ...saveData, ...JSON.parse(dados) };
  atualizarTela();
}

const itensDisponiveis = [
  { nome: "Garrafa de Água", preco: 10, nivel: 1, efeito: { sede: -20 } },
  { nome: "Barrinha de Cereal", preco: 12, nivel: 1, efeito: { energia: +15 } },
  
  { nome: "Pão", preco: 15, nivel: 2, efeito: { fome: -25 } },

  { nome: "Café", preco: 30, nivel: 3, efeito: { sono: -15, energia: +10 } },
  { nome: "Suco Natural", preco: 25, nivel: 3, efeito: { sede: -15, energia: +5 } },

  { nome: "Fruta", preco: 25, nivel: 4, efeito: { fome: -10, sede: -10 } },

  { nome: "Sanduíche", preco: 50, nivel: 5, efeito: { fome: -40, energia: +10 } },
  { nome: "Isotônico", preco: 40, nivel: 5, efeito: { sede: -30, energia: +20 } },

  { nome: "Chá Relaxante", preco: 35, nivel: 6, efeito: { sono: -25 } },
  { nome: "Leite", preco: 20, nivel: 6, efeito: { sede: -10, sono: -10 } },

  { nome: "Bolacha", preco: 18, nivel: 7, efeito: { fome: -10 } },
  { nome: "Café Forte", preco: 50, nivel: 7, efeito: { sono: -30, energia: +15 } },

  { nome: "Refeição Leve", preco: 60, nivel: 8, efeito: { fome: -35, energia: +5 } },

  { nome: "Água com Limão", preco: 30, nivel: 9, efeito: { sede: -25, energia: +5 } },

  { nome: "Refeição Completa", preco: 100, nivel: 10, efeito: { fome: -60, sede: -20, energia: +20 } },
  { nome: "Smoothie", preco: 45, nivel: 10, efeito: { sede: -20, energia: +15 } },

  { nome: "Almoço Executivo", preco: 150, nivel: 12, efeito: { fome: -80, energia: +25 } },

  { nome: "Vitamina", preco: 60, nivel: 13, efeito: { energia: +30 } },
  { nome: "Água de Coco", preco: 40, nivel: 13, efeito: { sede: -30, energia: +10 } },

  { nome: "Energetico Premium", preco: 90, nivel: 15, efeito: { sono: -40, energia: +30 } },
  { nome: "Jantar Saudável", preco: 120, nivel: 15, efeito: { fome: -50, energia: +20 } },

  { nome: "Shake Proteico", preco: 70, nivel: 17, efeito: { fome: -25, energia: +25 } },

  { nome: "Refeição Deluxe", preco: 200, nivel: 18, efeito: { fome: -80, sede: -30, energia: +40 } },

  { nome: "Comida Gourmet", preco: 250, nivel: 20, efeito: { fome: -100, sede: -40, energia: +50, sono: -20 } },
];

const missoesDisponiveis = [
  {
    nome: "Suba para o nível 2!",
    descricao: "Trabalhe 5 vezes.",
    nivel: 1,
    condicao: () => saveData.nivel == 2,
    concluida: false
  },
  {
    nome: "Bem hidratado",
    descricao: "Fique com menos de 20 de sede.",
    nivel: 2,
    condicao: () => saveData.sede < 20,
    concluida: false
  },
  {
    nome: "Refeição completa",
    descricao: "Compre um item que recupere mais de 40 de fome.",
    nivel: 3,
    condicao: () => saveData.itensComprados?.some(i => i.fome && i.fome <= -40),
    concluida: false
  },
  {
    nome: "Energia é tudo!",
    descricao: "Aumente sua energia acima de 80.",
    nivel: 4,
    condicao: () => saveData.energia > 80,
    concluida: false
  },
  {
    nome: "Dia novo, missão nova",
    descricao: "Chegue ao dia 3 do jogo.",
    nivel: 5,
    condicao: () => saveData.dia >= 3,
    concluida: false
  },
];



const juros = 0.1; // 10% de juros

const contas = {
  aluguel: {
    nome: "Aluguel",
    valorBase: 500,
    valorAtual: 500,
    paga: false
  },
  energia: {
    nome: "Energia",
    valorBase: 150,
    valorAtual: 150,
    paga: false
  },
  agua: {
    nome: "Água",
    valorBase: 100,
    valorAtual: 100,
    paga: false
  }
};




function voltarMenu() {
  window.location.href = "index.html";
}

async function salvarEmArquivo() {
  const saveJson = JSON.stringify(saveData, null, 2);
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${saveData.nome}_save.json`,
      types: [{
        description: 'Arquivo de Jogo',
        accept: {'application/json': ['.json']}
      }]
    });

    const writable = await fileHandle.createWritable();
    await writable.write(saveJson);
    await writable.close();
    adicionarNotificacao("Progresso salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar:", error);
    adicionarNotificacao("Falha ao salvar o jogo.");
  }
}

function atualizarTela() {
  document.getElementById("nome").textContent = saveData.nome;
  document.getElementById("dinheiro").textContent = saveData.dinheiro;
  document.getElementById("energia").textContent = saveData.energia;
  document.getElementById("sono").textContent = saveData.sono;
  document.getElementById("data").textContent = `${saveData.data.dia.toString().padStart(2, "0")}/${saveData.data.mes.toString().padStart(2, "0")}/${saveData.data.ano}`;
  document.getElementById("hora").textContent = `${saveData.hora.toString().padStart(2, "0")}:00`;
  document.getElementById("nivel").textContent = saveData.nivel;
  document.getElementById("fome").textContent = `${saveData.fome}`;
  document.getElementById("sede").textContent = `${saveData.sede}`;

}


// Tempo avança a cada 3 segundos
setInterval(() => {
  saveData.hora += 1;
  if (saveData.hora >= 24) {
    saveData.hora = 0;
    passarDia();
  }

  // Aumenta o sono durante o dia
  if (saveData.hora >= 8 && saveData.hora <= 23) {
    saveData.sono = Math.min(100, saveData.sono + 2);
  }

  // Aumenta fome e sede a cada hora
  saveData.fome = Math.min(100, saveData.fome + 2);
  saveData.sede = Math.min(100, saveData.sede + 3);

  
  // Verifica fome e sede para fim de jogo
  if (saveData.fome >= 100 && saveData.sede >= 100) {
  localStorage.setItem("fimDeJogo", JSON.stringify({
    nivel: saveData.nivel,
    dinheiro: saveData.dinheiro,
  }));
  window.location.href = "fim.html";
}

  // Verifica se sono atingiu 100 e força um cochilo
  if (saveData.sono >= 100) {
    saveData.energia = Math.min(100, saveData.energia + 20);
    saveData.sono = Math.max(0, saveData.sono - 50);
    saveData.dormiuHoje = true;

    saveData.hora += 2;
    if (saveData.hora >= 24) {
      saveData.hora -= 24;
      passarDia();
      adicionarNotificacao("Você desmaiou de sono e acordou em um novo dia.");
    } else {
      adicionarNotificacao("Você desmaiou de sono e cochilou por 2 horas.");
    }

    atualizarTela();
  }

  atualizarTela();
}, 3000);



function exibirContas() {
  const container = document.getElementById("container-contas");
  container.innerHTML = "";

  for (let chave in contas) {
    const conta = contas[chave];

    const div = document.createElement("div");
    div.classList.add("conta");

    div.innerHTML = `
      <strong>${conta.nome}</strong><br>
      Valor: R$${conta.valorAtual.toFixed(2)}<br>
      Status: ${conta.paga ? "Paga" : "Em aberto"}<br>
    `;

    const botao = document.createElement("button");
    botao.textContent = "Pagar";
    botao.disabled = conta.paga;
    botao.onclick = () => pagarConta(chave);

    div.appendChild(botao);
    container.appendChild(div);
  }
}



function pagarConta(nomeConta) {
  const conta = contas[nomeConta];
  if (!conta.paga) {
    if (saveData.dinheiro >= conta.valorAtual) {
      saveData.dinheiro -= conta.valorAtual;
      conta.paga = true;
      if (conta.nome =  "Aluguel") {
        saveData.contaAluguel = true;
      }
      if (conta.nome =  "Energia") {
        saveData.contaEnergia = true;
      }
      if (conta.nome =  "Água") {
        saveData.contaAgua = true;
      }  
      conta.valorAtual = conta.valorBase;
      exibirContas();
    } else {
      alert("Dinheiro insuficiente!");
    }
  }
}



function atualizarContasNovoMes() {
  for (let chave in contas) {
    const conta = contas[chave];
    if (!conta.paga) {
      const jurosValor = conta.valorAtual * juros;
      conta.valorAtual += jurosValor;
    } else {
      conta.valorAtual = conta.valorBase; // reseta
    }
    conta.paga = false;
    if (conta.nome =  "Aluguel") {
        saveData.contaAluguel = true;
    }
    if (conta.nome =  "Energia") {
      saveData.contaEnergia = true;
    }
    if (conta.nome =  "Água") {
      saveData.contaAgua = true;
    } 
  }
  exibirContas();
}



function atualizarLoja() {
  
  const lojaDiv = document.getElementById("loja");
  lojaDiv.innerHTML = ""; // limpa loja antes de renderizar

  itensDisponiveis.forEach((item, index) => {
    if (saveData.nivel >= item.nivel) {
      const itemDiv = document.createElement("div");
      itemDiv.innerHTML = `
        <strong>${item.nome}</strong><br>
        Preço: $${item.preco}<br>
        Nível: ${item.nivel}<br>
        Efeito -> ${Object.entries(item.efeito).map(([key, val]) => `${key}: ${val}`).join(", ")}<br>
        <button onclick="comprarItem(${index})">Comprar</button>
      `;
      lojaDiv.appendChild(itemDiv);
    }
  });
}



function atualizarMissoes() {
  const missoesDiv = document.getElementById("painel-missoes");
  if (!missoesDiv) return;

  missoesDiv.innerHTML = "";

  const missoesAtivas = missoesDisponiveis.filter(m => saveData.nivel >= m.nivel);

  missoesAtivas.forEach((missao) => {
    const status = missao.concluida ? "✅ Concluída" : "⏳ Em andamento";
    const div = document.createElement("div");
    div.classList.add("missao");
    div.innerHTML = `
      <strong>${missao.nome}</strong><br>
      ${missao.descricao}<br>
      <em>${status}</em><hr>
    `;
    missoesDiv.appendChild(div);
  });
}



function verificarMissoes() {
  missoesDisponiveis.forEach((missao) => {
    if (!missao.concluida && saveData.nivel >= missao.nivel && missao.condicao()) {
      missao.concluida = true;
      adicionarNotificacao(`Missão concluída: ${missao.nome}!`);
    }
  });

  atualizarMissoes();
}



function comprarItem(index) {
  const item = itensDisponiveis[index];

  if (saveData.dinheiro < item.preco) {
    adicionarNotificacao("Você não tem dinheiro suficiente para comprar esse item.");
    return;
  }

  saveData.dinheiro -= item.preco;

  // Aplica efeitos
  if (item.efeito.fome !== undefined)
    saveData.fome = Math.max(0, saveData.fome + item.efeito.fome);
  if (item.efeito.sede !== undefined)
    saveData.sede = Math.max(0, saveData.sede + item.efeito.sede);
  if (item.efeito.energia !== undefined)
    saveData.energia = Math.min(100, saveData.energia + item.efeito.energia);
  if (item.efeito.sono !== undefined)
    saveData.sono = Math.max(0, saveData.sono + item.efeito.sono);

  //Registrar itens comprados
  if (!saveData.itensComprados) saveData.itensComprados = [];
  saveData.itensComprados.push(item.efeito);
  verificarMissoes()

  adicionarNotificacao(`Você comprou ${item.nome}.`);
  atualizarTela();
}



function trabalhar() {
  const botaoTrabalhar = document.querySelector('button[onclick="trabalhar()"]');

  if (saveData.energia <= 0) {
    adicionarNotificacao("Você está sem energia para trabalhar!");
    return;
  }

  if (saveData.sono >= 100) {
    adicionarNotificacao("Você está com muito sono para trabalhar! Vá dormir.");
    return;
  }

  botaoTrabalhar.disabled = true;
  botaoTrabalhar.textContent = "Trabalhando...";

  setTimeout(() => {
    saveData.dinheiro += 10;
    saveData.energia = Math.max(0, saveData.energia - 10);
    saveData.sono = Math.min(100, saveData.sono + 5);

    // Progresso de nível
    saveData.cliquesTrabalho++;
    const nivelAtual = saveData.nivel;
    const cliquesNecessarios = nivelAtual < 20 ? nivelAtual * 5 : 100;

    if (saveData.cliquesTrabalho >= cliquesNecessarios) {
      saveData.nivel++;
      saveData.cliquesTrabalho = 0;
      adicionarNotificacao(`Parabéns! Você subiu para o nível ${saveData.nivel}`);
      atualizarLoja();
    }

    atualizarMissoes();

    verificarMissoes()
    
    atualizarTela();

    botaoTrabalhar.disabled = false;
    botaoTrabalhar.textContent = "Trabalhar";
  }, 1000);
}



function dormir() {
  const botaoDormir = document.querySelector('button[onclick="dormir()"]');
  botaoDormir.disabled = true;
  botaoDormir.textContent = "Dormindo...";

  let horasAvancadas = 0;

  // Verifica se é noite ou dia
  if (saveData.hora >= 21 || saveData.hora < 6) {
    // Sono completo (noite)
    saveData.energia = 100;
    saveData.sono = 0;
    saveData.dormiuHoje = true;
    horasAvancadas = 8;
    adicionarNotificacao("Você dormiu profundamente durante a noite. Energia restaurada!");
  } else {
    // Cochilo (dia)
    saveData.energia = Math.min(100, saveData.energia + 20);
    saveData.sono = Math.max(0, saveData.sono - 50);
    saveData.dormiuHoje = true;
    horasAvancadas = 2;
    adicionarNotificacao("Você tirou um cochilo. Energia +20, Sono -50.");
  }

  // Avança o tempo
  saveData.hora += horasAvancadas;
  if (saveData.hora >= 24) {
    saveData.hora -= 24;
    passarDia();
    adicionarNotificacao("Um novo dia começou após o sono.");
  }

  // Reativa o botão após 12 segundos
  setTimeout(() => {
    botaoDormir.disabled = false;
    botaoDormir.textContent = "Dormir";
  }, 12000);
  
  verificarMissoes()
  
  atualizarTela();
}



function passarDia() {
  if (!saveData.dormiuHoje) {
    // Penalidade por não dormir
    if (saveData.energia > 0) {
      saveData.energia = Math.max(0, saveData.energia - 10);
    }
    saveData.sono = 100;
  }

  // Reset diário
  saveData.dormiuHoje = false;
  saveData.data.dia++;
  exibirContas();
  if (saveData.data.dia > 30) {
    saveData.data.dia = 1;
    saveData.data.mes++;
    atualizarContasNovoMes();
    if (saveData.data.mes > 12) {
      saveData.data.mes = 1;
      saveData.data.ano++;
    }
  }
}



function adicionarNotificacao(texto) {
  const container = document.getElementById("notificacoes");
  const dataHora = `[${String(saveData.hora).padStart(2, "0")}:00 - Dia ${saveData.data.dia}/${saveData.data.mes}]`;
  const mensagem = document.createElement("div");
  mensagem.textContent = `${dataHora} ${texto}`;
  container.appendChild(mensagem);
  container.scrollTop = container.scrollHeight; // rola automaticamente para a última notificação
}

//TODO IR e VOLTAR do trabalhocomick
// , aluguel,

function startGame() {
  atualizarTela();
  atualizarLoja();
  atualizarMissoes();
  verificarMissoes();
  exibirContas();
}

// Inicia o jogo
startGame();

