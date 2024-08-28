const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hotbarWidth = document.getElementById('hotbar').offsetWidth;
canvas.width = window.innerWidth - hotbarWidth;
canvas.height = window.innerHeight;

let elementos = [];
const progressBar = document.getElementById('progress-bar');
let progressoAtual = 0;
const totalElementos = 28; // Número total de elementos que podem ser criados
let deus = 0;
let guerra = 0;
let paz = 0;
let deus_setado = 0;
let guerra_setado = 0;
let paz_setado = 0;

// Função para atualizar a barra de progresso
function atualizarProgresso() {
    progressoAtual++;
    const progressoPercentual = Math.min((progressoAtual / totalElementos) * 100, 100);
    progressBar.style.width = `${progressoPercentual}%`;
}

// Função para adicionar um novo elemento ao canvas
function adicionarElemento(imageSrc, x, y) {
    // Verifica se o elemento já existe
    const existeElemento = elementos.some(e => e.imageSrc === imageSrc && e.x === x && e.y === y);
    if (existeElemento) return;

    let novoElemento = {
        x: x - hotbarWidth,
        y: y,
        size: 75,
        imageSrc: imageSrc,
        dragging: false
    };

    const img = new Image();
    img.src = imageSrc;
    novoElemento.image = img;
    elementos.push(novoElemento);

    desenharelementos();
    adicionarElementoNaHotbar(imageSrc);
}

// Função para remover todos os elementos do canvas
function removerTodosElementos() {
    elementos = [];
    desenharelementos();
}

// Função para desenhar todos os elementos no canvas
function desenharelementos() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elementos.forEach(q => {
        ctx.drawImage(q.image, q.x, q.y, q.size, q.size);
    });
}

// Função para obter a posição do mouse
function getMousePos(e) {
    return {
        x: e.clientX - hotbarWidth,
        y: e.clientY
    };
}

// Função para verificar a sobreposição de dois elementos
function verificarSobreposicao(elemento1, elemento2) {
    return elemento1.x === elemento2.x && elemento1.y === elemento2.y;
}

// Função para misturar dois elementos
function misturarElementos(elemento1, elemento2) {
    const nome1 = elemento1.imageSrc.split('/').pop().split('.').shift();
    const nome2 = elemento2.imageSrc.split('/').pop().split('.').shift();

    // Normaliza a combinação para verificar mistura em qualquer ordem
    const combinacao = [nome1, nome2].sort().join('-');

    const novasImagens = {
        'ambicao-ferramentassofisticadas': {
            imageSrc: 'elementos/armas.png',
            descricao: 'Armas criadas!',
            tipo: 'guerra'
        },
        'energia-ferramentas': {
            imageSrc: 'elementos/maquina.png',
            descricao: 'Maquinas criadas!',
            tipo: 'deus'
        },
        'ambicao-conhecimento': {
            imageSrc: 'elementos/tecnologia.png',
            descricao: 'Tecnologia criada!',
            tipo: 'paz'
        },
        'tecnologia-tecnologia': {
            imageSrc: 'elementos/imd.png',
            descricao: 'IMD criado! (EASTER EGG)'
        },
        'energia-tecnologia': {
            imageSrc: 'elementos/computacao.png',
            descricao: 'Computação criada!'
        },
        'conhecimento-fe': {
            imageSrc: 'elementos/filosofia.png',
            descricao: 'Filosofia criada!',
            tipo: 'paz'
        },
        'conhecimento-ferramentas': {
            imageSrc: 'elementos/ferramentassofisticadas.png',
            descricao: 'Ferramentas Sofisticadas criadas!',
            tipo: 'deus'
        },
        'ambicao-ferramentas': {
            imageSrc: 'elementos/dinheiro.png',
            descricao: 'Dinheiro criado!',
            tipo: 'guerra'
        },
        'filosofia-tecnologia': {
            imageSrc: 'elementos/etica.png',
            descricao: 'Ética criada!',
            tipo: 'paz'
        },
        'armas-tecnologia': {
            imageSrc: 'elementos/armasavancadas.webp',
            descricao: 'Armas avançadas criadas!',
            tipo: 'guerra'
        },
        'energia-energia': {
            imageSrc: 'elementos/nuclear.png',
            descricao: 'Energia Nuclear criada!',
            tipo: 'deus'
        },
        'armasavancadas-nuclear': {
            imageSrc: 'elementos/armasnucleares.png',
            descricao: 'Armas Nucleares criadas!',
            tipo: 'guerra'
        },
        'ambicao-armasnucleares': {
            imageSrc: 'elementos/guerranuclear.png',
            descricao: 'Guerra Nuclear alcançada!',
            tipo: 'guerra'
        },
        'dinheiro-etica': {
            imageSrc: 'elementos/sociedade.png',
            descricao: 'Sociedade criada!',
            tipo: 'deus'
        },
        'armas-sociedade': {
            imageSrc: 'elementos/crime.png',
            descricao: 'Crime criado!',
            tipo: 'guerra'
        },
        'etica-sociedade': {
            imageSrc: 'elementos/conscientizacao.png',
            descricao: 'Conscientização criada!',
            tipo: 'paz'
        },
        'conscientizacao-tecnologia': {
            imageSrc: 'elementos/educacao.png',
            descricao: 'Educação criada!',
            tipo: 'paz'
        },
        'educacao-sociedade': {
            imageSrc: 'elementos/equidade.png',
            descricao: 'Equidade criada!',
            tipo: 'paz'
        },
        'equidade-etica': {
            imageSrc: 'elementos/justica.png',
            descricao: 'Justiça criada!',
            tipo: 'paz'
        },
        'conscientizacao-justica': {
            imageSrc: 'elementos/pazmundial.png',
            descricao: 'Paz Mundial alcançada!',
            tipo: 'paz'
        },
        'ambicao-filosofia': {
            imageSrc: 'elementos/controle.png',
            descricao: 'Controle De Massas criada!',
            tipo: 'guerra'
        },
        'ferramentassofisticadas-tecnologia': {
            imageSrc: 'elementos/computador.png',
            descricao: 'Computador criado!'
        },
        'fe-ferramentas': {
            imageSrc: 'elementos/livrosagrado.png',
            descricao: 'Livro Sagrado criado!',
            tipo: 'deus'
        },
        'fe-livrosagrado': {
            imageSrc: 'elementos/conexaoespiritual.png',
            descricao: 'Conexão Espiritual criada!',
            tipo: 'deus'
        },
        'fe-filosofia': {
            imageSrc: 'elementos/teologia.png',
            descricao: 'Teologia criada!',
            tipo: 'deus'
        },
        'sociedade-teologia': {
            imageSrc: 'elementos/lideresreligiosos.png',
            descricao: 'Lideres Religiosos criados!',
            tipo: 'deus'
        },
        'ferramentassofisticadas-maquina': {
            imageSrc: 'elementos/construcao.png',
            descricao: 'Construções criadas!'
        },
        'construcao-fe': {
            imageSrc: 'elementos/templo.png',
            descricao: 'Templo religioso criado!',
            tipo: 'deus'
        }

    };

    if (novasImagens[combinacao]) {
        if (!elementos.some(e => e.imageSrc === novasImagens[combinacao].imageSrc && e.x === elemento1.x && e.y === elemento1.y)) {
            const novoElemento = {
                x: elemento1.x,
                y: elemento1.y,
                size: 75,
                imageSrc: novasImagens[combinacao].imageSrc,
                dragging: false
            };

            const img = new Image();
            img.src = novasImagens[combinacao].imageSrc;
            novoElemento.image = img;
            elementos.push(novoElemento);

            desenharelementos();
            exibirMensagem(novasImagens[combinacao].descricao);
            adicionarElementoNaHotbar(novasImagens[combinacao].imageSrc, novasImagens[combinacao].tipo);
        } else {
            exibirMensagem("O elemento já existe.");
        }
    } else {
        exibirMensagem("A mistura não resultou em nada.");
    }

    // Remove os elementos misturados
    removerTodosElementos();
}

// Função para adicionar um elemento à hotbar
function adicionarElementoNaHotbar(imageSrc, tipo) {
    const hotbar = document.getElementById('hotbar');

    // Cria um ID único para o novo item
    const id = imageSrc.split('/').pop().split('.').shift();

    // Verifica se o item já existe na hotbar
    if (!document.getElementById(id)) {
        const container = document.createElement('div');
        container.className = 'hotbar-item-container';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'hotbar-item';
        img.draggable = true;
        img.id = id;
        img.setAttribute('data-tipo', tipo); // Adiciona o tipo

        // Log para depuração
        console.log(`Adicionando item com ID: ${id} e tipo: ${tipo}`);

        const span = document.createElement('span');
        span.className = 'hotbar-item-name';
        span.innerText = id.charAt(0).toUpperCase() + id.slice(1); // Exibe o nome do item

        // Adiciona o evento de dragstart para o novo item
        img.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', id);
        });

        container.appendChild(img);
        container.appendChild(span);
        hotbar.appendChild(container);

        // Atualiza a barra de progresso
        atualizarProgresso();
    } else {
        console.log(`Item com ID ${id} já existe na hotbar.`);
    }
}

// Função para exibir mensagens na tela
function exibirMensagem(mensagem) {
    const mensagemElemento = document.createElement('div');
    mensagemElemento.className = 'mensagem';
    mensagemElemento.innerText = mensagem;
    document.body.appendChild(mensagemElemento);

    setTimeout(() => {
        mensagemElemento.remove();
    }, 4000); // A mensagem desaparece após 3 segundos
}

// Configura os eventos de arraste e adição de elementos no canvas
canvas.addEventListener('mousedown', iniciarArraste);
canvas.addEventListener('mousemove', arrastar);
canvas.addEventListener('mouseup', pararArraste);

function iniciarArraste(e) {
    const mousePos = getMousePos(e);
    elementos.forEach(q => {
        if (mousePos.x >= q.x && mousePos.x <= q.x + q.size &&
            mousePos.y >= q.y && mousePos.y <= q.y + q.size) {
            q.dragging = true;
        }
    });
}

function arrastar(e) {
    const mousePos = getMousePos(e);
    elementos.forEach(q => {
        if (q.dragging) {
            q.x = mousePos.x - q.size / 2;
            q.y = mousePos.y - q.size / 2;
        }
    });
    desenharelementos();
}

function pararArraste() {
    let elementoEmArraste = elementos.find(q => q.dragging);
    elementos.forEach(q => {
        if (q !== elementoEmArraste && q.dragging) {
            if (verificarSobreposicao(elementoEmArraste, q)) {
                misturarElementos(elementoEmArraste, q);
            }
        }
        q.dragging = false;
    });
}

// Configura o evento de arraste e adição de elementos da hotbar
document.querySelectorAll('.hotbar-item').forEach(item => {
    item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', item.id);
    });
});

canvas.addEventListener('dragover', function (e) {
    e.preventDefault();
});

canvas.addEventListener('drop', function (e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const imgSrc = document.getElementById(id).src;
    const mousePos = getMousePos(e);
    adicionarElemento(imgSrc, mousePos.x, mousePos.y);
});

// Configura o evento de clique na lixeira para remover todos os elementos
const lixeira = document.getElementById('lixeira');

lixeira.addEventListener('click', function () {
    removerTodosElementos();
});

function atualizarWallpaper() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (guerra > paz+1) {
        canvas.style.backgroundImage = "url('elementos/guerra.jpg')";
    } else if (paz > guerra+1) {
        canvas.style.backgroundImage = "url('elementos/paz.jpg')";
    } else {
        canvas.style.backgroundImage = "url('elementos/natureza_capa.jpg')"; // Imagem padrão se guerra e paz forem iguais ou não houver predominância
    }
}

// Função para verificar a hotbar e atualizar o wallpaper
function verificarHotbar() {
    // Redefine os contadores para zero
    guerra = guerra_setado;
    paz = paz_setado;
    deus = deus_setado;

    // Selecionar todos os itens da hotbar
    const hotbarItems = document.querySelectorAll('.hotbar-item');

    // Iterar sobre os itens da hotbar
    hotbarItems.forEach(item => {
        const tipo = item.getAttribute('data-tipo');
        switch (tipo) {
            case 'guerra':
                guerra += 1;
                break;
            case 'paz':
                paz += 1;
                break;
            case 'deus':
                deus += 1;
                break;
            default:
                break;
        }
    });

    // Atualiza o wallpaper baseado nos valores de guerra e paz
    atualizarWallpaper();
}

setInterval(verificarHotbar, 1000);


document.getElementById('menu-button').addEventListener('click', function () {
    const menuModal = document.getElementById('menu-modal');
    // Alterna a visibilidade do modal
    if (menuModal.style.display === 'none' || menuModal.style.display === '') {
        menuModal.style.display = 'block';
    } else {
        menuModal.style.display = 'none';
    }
});

// Botão para abrir o popup de Combinações
document.getElementById('show-combinations').addEventListener('click', function () {
    document.getElementById('combinations-popup').style.display = 'flex';
});

// Botão para fechar o popup de Combinações
document.querySelector('#combinations-popup .popup-close').addEventListener('click', function () {
    document.getElementById('combinations-popup').style.display = 'none';
});

// Fecha o popup de Combinações se o usuário clicar fora do conteúdo
window.addEventListener('click', function (e) {
    if (e.target === document.getElementById('combinations-popup')) {
        document.getElementById('combinations-popup').style.display = 'none';
    }
});

// Define o menu-modal como escondido ao carregar a página
window.addEventListener('load', function () {
    document.getElementById('menu-modal').style.display = 'none';
});

// Botão para abrir o popup de Cheats
document.getElementById('show-cheats').addEventListener('click', function () {
    document.getElementById('cheats-popup').style.display = 'flex';
});

// Botão para fechar o popup de Cheats
document.querySelector('#cheats-popup .popup-close').addEventListener('click', function () {
    document.getElementById('cheats-popup').style.display = 'none';
});

// Fecha o popup de Cheats se o usuário clicar fora do conteúdo
window.addEventListener('click', function (e) {
    if (e.target === document.getElementById('cheats-popup')) {
        document.getElementById('cheats-popup').style.display = 'none';
    }
});

// Manipulador do formulário de Cheats
document.getElementById('cheats-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os valores dos campos e atualiza as variáveis globais
    guerra = parseInt(document.getElementById('guerra').value) || 0;
    paz = parseInt(document.getElementById('paz').value) || 0;
    deus = parseInt(document.getElementById('deus').value) || 0;

    // Atualiza as variáveis `guerra_setado`, `paz_setado` e `deus_setado`
    guerra_setado = guerra;
    paz_setado = paz;
    deus_setado = deus;

    // Atualiza o wallpaper
    verificarHotbar();

    // Atualiza o estado do botão "Avançar"
    atualizarBotaoAvancar();

    // Fecha o popup após aplicar os cheats
    document.getElementById('cheats-popup').style.display = 'none';
});



// Função para atualizar o estado do botão "Avançar"
function atualizarBotaoAvancar() {
    const advanceButton = document.getElementById('advance-button');
    if ((guerra === 7 || paz === 8) && deus >= 0) {
        advanceButton.disabled = false;
        advanceButton.style.backgroundColor = '#333'; // Cor quando ativado
        advanceButton.style.color = 'white'; // Cor do texto quando ativado
        advanceButton.style.cursor = 'pointer'; // Cursor para botão ativado
    } else {
        advanceButton.disabled = true;
        advanceButton.style.backgroundColor = '#777'; // Cor padrão (inativo)
        advanceButton.style.color = '#ccc'; // Cor do texto (inativo)
        advanceButton.style.cursor = 'not-allowed'; // Cursor para botão inativo
    }
}


// Função para lidar com o clique no botão "Avançar"
document.getElementById('advance-button').addEventListener('click', function () {
    if (guerra === 7 && deus === 9) {
        window.location.href = 'final4.html';
    } else if (paz === 8 && deus === 9) {
        window.location.href = 'final5.html';
    } else if (guerra === 7 && deus <= 8) {
        window.location.href = 'final2.html';
    } else if (paz === 8 && deus <= 8) {
        window.location.href = 'final3.html';
    }
});

// Botão para abrir o popup de Avançar
document.getElementById('avancar').addEventListener('click', function () {
    document.getElementById('advance-popup').style.display = 'flex';
    atualizarBotaoAvancar(); // Atualiza o estado do botão quando o popup é aberto
});

// Botão para fechar o popup de Avançar
document.querySelector('#advance-popup .popup-close').addEventListener('click', function () {
    document.getElementById('advance-popup').style.display = 'none';
});

// Fecha o popup de Avançar se o usuário clicar fora do conteúdo
window.addEventListener('click', function (e) {
    if (e.target === document.getElementById('advance-popup')) {
        document.getElementById('advance-popup').style.display = 'none';
    }
});



desenharelementos();
