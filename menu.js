let saveData = {
  nome: ""
};

function novoJogo() {
  const inputNome = document.getElementById("inputNome");
  const nome = inputNome.value.trim();
  if (nome) {
    saveData.nome = nome;
    sessionStorage.setItem("dadosJogo", JSON.stringify(saveData));
    window.location.href = "jogo.html";
  }
}

async function carregarDeArquivo() {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Arquivo de Jogo',
        accept: {'application/json': ['.json']}
      }]
    });
    const file = await fileHandle.getFile();
    const contents = await file.text();
    saveData = JSON.parse(contents);
    sessionStorage.setItem("dadosJogo", JSON.stringify(saveData));
    window.location.href = "jogo.html";
  } catch (error) {
    console.error("Erro ao carregar:", error);
    alert("Falha ao carregar o jogo.");
  }
}
