const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hotbarWidth = document.getElementById('hotbar').offsetWidth;
canvas.width = window.innerWidth - hotbarWidth;
canvas.height = window.innerHeight;

let elementos = [];
const progressBar = document.getElementById('progress-bar');
let progressoAtual = 0;
const totalElementos = 20; // Número total de elementos que podem ser criados

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
            descricao: 'Armas criadas!' //guerra
        },
        'energia-ferramentas': {
            imageSrc: 'elementos/maquina.png',
            descricao: 'Maquinas criadas!' // deus
        },
        'ambicao-conhecimento': {
            imageSrc: 'elementos/tecnologia.png',
            descricao: 'Tecnologia criada!' //paz
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
            descricao: 'Filosofia criada!' //paz
        },
        'conhecimento-ferramentas': {
            imageSrc: 'elementos/ferramentassofisticadas.png',
            descricao: 'Ferramentas Sofisticadas criadas!' // deus
        },
        'ambicao-ferramentas': {
            imageSrc: 'elementos/dinheiro.png',
            descricao: 'Dinheiro criado!' //guerra
        },
        'filosofia-tecnologia': {
            imageSrc: 'elementos/etica.png',
            descricao: 'Ética criada!' //paz
        },
        'armas-tecnologia': {
            imageSrc: 'elementos/armasavancadas.webp',
            descricao: 'Armas avançadas criadas!' //guerra
        },
        'energia-energia': {
            imageSrc: 'elementos/nuclear.png',
            descricao: 'Energia Nuclear criada!' // deus
        },
        'armasavancadas-nuclear': {
            imageSrc: 'elementos/armasnucleares.png',
            descricao: 'Armas Nucleares criadas!' //guerra
        },
        'ambicao-armasnucleares': {
            imageSrc: 'elementos/guerranuclear.png',
            descricao: 'Guerra Nuclear criada!' //guerra +2
        },
        'dinheiro-etica': {
            imageSrc: 'elementos/sociedade.png',
            descricao: 'Sociedade criada!' // deus
        },
        'armas-sociedade': {
            imageSrc: 'elementos/crime.png',
            descricao: 'Crime criado!' // guerra
        },
        'etica-sociedade': {
            imageSrc: 'elementos/conscientizacao.png',
            descricao: 'Conscientização criada!' // paz
        },
        'conscientizacao-tecnologia': {
            imageSrc: 'elementos/educacao.png',
            descricao: 'Educação criada!' // paz
        },
        'educacao-sociedade': {
            imageSrc: 'elementos/equidade.png',
            descricao: 'Equidade criada!' // paz
        },
        'equidade-etica': {
            imageSrc: 'elementos/justica.png',
            descricao: 'Justiça criada!' // paz
        },
        'conscientizacao-justica': {
            imageSrc: 'elementos/pazmundial.png',
            descricao: 'Paz Mundial criada!' // paz+2
        },//aq
        'ambicao-filosofia': {
            imageSrc: 'elementos/controle.png',
            descricao: 'Controle De Massas criada!' // guerra
        },
        'ferramentassofisticadas-tecnologia': {
            imageSrc: 'elementos/computador.png',
            descricao: 'Computador criado!'
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
            adicionarElementoNaHotbar(novasImagens[combinacao].imageSrc);
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
function adicionarElementoNaHotbar(imageSrc) {
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


desenharelementos();











