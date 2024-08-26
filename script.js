const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hotbarWidth = document.getElementById('hotbar').offsetWidth;
canvas.width = window.innerWidth - hotbarWidth;
canvas.height = window.innerHeight;

let elementos = [];

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
        'agua-fogo': {
            imageSrc: 'elementos/vapor.png',
            descricao: 'Vapor criado!'
        },
        'agua-terra': {
            imageSrc: 'elementos/lama.png',
            descricao: 'Lama criada!'
        },
        'agua-agua': {
            imageSrc: 'elementos/lago.png',
            descricao: 'Lago criado!'
        },
		'fogo-lago': {
            imageSrc: 'elementos/lagotermal.png',
            descricao: 'Lago Termal criado!'
        },
		'lago-lago': {
            imageSrc: 'elementos/lagoa.png',
            descricao: 'Lagoa criada!'
        },
		'ar-ar': {
            imageSrc: 'elementos/vento.png',
            descricao: 'Vento criado!'
        },
		'fogo-fogo': {
            imageSrc: 'elementos/energia.png',
            descricao: 'Energia criada!'
        },
		'agua-lagoa': {
            imageSrc: 'elementos/muitaagua.png',
            descricao: 'Muita Agua criada!'
        },
		'muitaagua-vento': {
            imageSrc: 'elementos/mar.webp',
            descricao: 'Mar criado!'
        },
		'energia-lama': {
            imageSrc: 'elementos/microorganismo.png',
            descricao: 'Microorganismos criados!'
        },
		'mar-microorganismo': {
            imageSrc: 'elementos/vida.jpg',
            descricao: 'Vida criada!'
        },
		'terra-vida': {
            imageSrc: 'elementos/vidaterrestre.png',
            descricao: 'Vida Terrestre criada!'
        },
		'lagotermal-vidaterrestre': {
            imageSrc: 'elementos/ednaldo.png',
            descricao: 'Ednaldo Pereira criado! (EASTER EGG)'
        },
		
    };

    if (novasImagens[combinacao]) {
        // Verifica se o elemento já existe antes de adicionar
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
        img.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', id);
        });

        container.appendChild(img);
        container.appendChild(span);
        hotbar.appendChild(container);
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
    }, 3000); // A mensagem desaparece após 3 segundos
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
    item.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', item.id);
    });
});

canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
});

canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const imgSrc = document.getElementById(id).src;
    const mousePos = getMousePos(e);
    adicionarElemento(imgSrc, mousePos.x, mousePos.y);
});

// Configura o evento de clique na lixeira para remover todos os elementos
const lixeira = document.getElementById('lixeira');

lixeira.addEventListener('click', function() {
    removerTodosElementos();
});

// Função para verificar a existência do elemento 'vidaterrestre' na hotbar e exibir o botão "Passar Tempo"
function verificarVidaterresteNaHotbar() {
    const vidaterresteNaHotbar = document.getElementById('vidaterrestre');

    if (vidaterresteNaHotbar && !document.getElementById('passarTempoBtn')) {
        const passarTempoBtn = document.createElement('button');
        passarTempoBtn.id = 'passarTempoBtn';
        passarTempoBtn.innerText = 'Passar Tempo';
        passarTempoBtn.className = 'passar-tempo-btn';
        document.body.appendChild(passarTempoBtn);

        passarTempoBtn.addEventListener('click', function() {
            abrirModalConfirmacao();
        });
    }
}

// Função para abrir o modal de confirmação com botões "Sim" e "Não"
function abrirModalConfirmacao() {
    const modal = document.createElement('div');
    modal.className = 'modal-confirmacao';
    modal.innerHTML = `
        <div class="modal-content">
            <p>Tem certeza que quer passar o tempo?</p>
            <button id="simBtn">Sim</button>
            <button id="naoBtn">Não</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('simBtn').addEventListener('click', function() {
        iniciarFadeOut(function() {
            window.location.href = 'fases/elemix2/elemix2.html';
        });
    });

    document.getElementById('naoBtn').addEventListener('click', function() {
        iniciarFadeOut(function() {
            window.location.href = 'fases/final1/final1.html';
        });
    });
}

// Função para iniciar o fade-out e redirecionar após 3 segundos
function iniciarFadeOut(callback) {
    document.body.style.transition = 'opacity 3s';
    document.body.style.opacity = '0';
    setTimeout(callback, 3000); // Redireciona após 3 segundos
}

// Verifica a cada 10 segundos se 'vidaterrestre' foi criado na hotbar
setInterval(verificarVidaterresteNaHotbar, 10000);

// Adiciona um pouco de estilo para o modal e o botão "Passar Tempo"
const style = document.createElement('style');
style.textContent = `
    .passar-tempo-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        z-index: 1000;
    }

    .modal-confirmacao {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 2px solid black;
        z-index: 1001;
    }

    .modal-content p {
        margin-bottom: 20px;
        font-size: 18px;
    }

    .modal-content button {
        margin-right: 10px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);


desenharelementos();
