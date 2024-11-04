// Variáveis globais
let numPaginas;
let numInteracoes;
let totalErros = 0;
let quantRequiFeitas = 0;
let vetpaginas = [];
let vetRequisicoes = [];
let vetMemoriaMain = [];

// Definindo o número máximo de slots na memória principal (FIFO de 3 slots)
const maxSlots = 3;

// Elementos do DOM
const divMemoriaMain = document.querySelector("#memoriaMain");
const divDisco = document.querySelector("#disco");
const divRequisicoes = document.querySelector("#sequenciaRequisicoes");
const divBtnRequisitaPag = document.querySelector("#RequisitaPagina");
const diverros = document.querySelector("#erros");

// Tabela para mostrar a memória principal
const tableMemoriaMain = document.createElement("table");
tableMemoriaMain.className = 'tabelas';
const trMemoriaMain = document.createElement("tr");

// Cabeçalho dos slots
const slot1 = document.createElement("th");
slot1.textContent = "Slot 1";
const slot2 = document.createElement("th");
slot2.textContent = "Slot 2";
const slot3 = document.createElement("th");
slot3.textContent = "Slot 3";
trMemoriaMain.append(slot1, slot2, slot3);
tableMemoriaMain.append(trMemoriaMain);
divMemoriaMain.appendChild(tableMemoriaMain);

// Função para gerar páginas e sequência de requisições
function geraRequisicoes() {
    numInteracoes = parseInt(document.querySelector('#numInteracoes').value);
    numPaginas = parseInt(document.querySelector('#numPaginas').value);

    alert(`Número de páginas criadas: ${numPaginas}\nNúmero de interações: ${numInteracoes}`);

    // Cria um array de páginas
    vetpaginas = Array.from({ length: numPaginas }, (_, i) => i);
    // Gera uma sequência aleatória de requisições
    vetRequisicoes = Array.from({ length: numInteracoes }, () => Math.floor(Math.random() * numPaginas));

    printaDisco();
    printaTabelaRequisicoes();

    // Cria o botão de requisição
    const btnRequisitaPagina = document.createElement("button");
    btnRequisitaPagina.id = 'btnRequisitaPagina';
    btnRequisitaPagina.textContent = "Requisitar nova página";
    divBtnRequisitaPag.appendChild(btnRequisitaPagina);
    btnRequisitaPagina.addEventListener('click', gerenciadorFifo);

    // Remove o botão de geração de sequência após a criação
    btnGeraSeq.remove();
}

// Função de gerenciamento FIFO
function gerenciadorFifo() {
    if (quantRequiFeitas >= numInteracoes) return;

    // Página atual requisitada
    const paginaRequisitada = vetRequisicoes[quantRequiFeitas];

    // Se a página não estiver na memória
    if (!vetMemoriaMain.includes(paginaRequisitada)) {
        totalErros++; // Incrementa os erros (page fault)

        // Se a memória está cheia, remove o mais antigo (FIFO)
        if (vetMemoriaMain.length >= maxSlots) {
            vetMemoriaMain.shift();
        }

        // Adiciona a nova página ao final (última posição da fila)
        vetMemoriaMain.push(paginaRequisitada);
    }

    // Atualiza a tabela de memória e o disco
    criaTabelaMain(vetMemoriaMain);
    printaDisco();

    quantRequiFeitas++;

    // Quando todas as requisições são processadas, remove o botão de requisição
    if (quantRequiFeitas === numInteracoes) {
        divBtnRequisitaPag.innerHTML = '';
    }
}

// Função para atualizar a tabela da memória principal
function criaTabelaMain(arraySlots) {
    const trDados = document.createElement("tr");
    for (let i = 0; i < maxSlots; i++) {
        const td = document.createElement("td");
        td.textContent = arraySlots[i] !== undefined ? arraySlots[i] : '-';
        trDados.append(td);
    }
    tableMemoriaMain.append(trDados);
}

// Função para mostrar o disco com taxa de erro
function printaDisco() {
    divDisco.innerHTML = ''; // Limpa o conteúdo da divDisco

    let titulo = document.createElement("h1");
    titulo.textContent = "Disco";
    divDisco.appendChild(titulo);

    const tableDisco = document.createElement("table");
    const erros = document.createElement("h4");
    const taxaErros = document.createElement("h4");
    tableDisco.className = 'tabelas';
    tableDisco.id = 'tabeladisco';

    erros.textContent = `Total de erros: ${totalErros}`;
    taxaErros.textContent = `Taxa de erros: ${(totalErros / numInteracoes).toFixed(2) * 100}%`; // Exibe a taxa em porcentagem

    // Preenchendo as linhas da tabela
    const trDadosDisco = document.createElement("tr");
    for (let i = 0; i < vetpaginas.length; i++) {
        const tdslotDisco = document.createElement("td");
        tdslotDisco.textContent = vetpaginas[i];
        trDadosDisco.append(tdslotDisco);
    }

    tableDisco.append(trDadosDisco);

    // Adiciona a tabela e as informações à div
    divDisco.appendChild(tableDisco);
    divDisco.appendChild(erros);
    divDisco.appendChild(taxaErros);
}

// Função para mostrar a sequência de requisições
function printaTabelaRequisicoes() {
    divRequisicoes.innerHTML = '<h2>Sequência de Requisições</h2>';

    const tableRequisicao = document.createElement("table");
    tableRequisicao.className = 'tabelas';

    const trRequisicao = document.createElement("tr");
    vetRequisicoes.forEach(requisicao => {
        const td = document.createElement("td");
        td.textContent = requisicao;
        trRequisicao.append(td);
    });

    tableRequisicao.append(trRequisicao);
    divRequisicoes.appendChild(tableRequisicao);
}

const btnGeraSeq = document.querySelector("#btnGeraSequencia");
btnGeraSeq.addEventListener('click', geraRequisicoes);
