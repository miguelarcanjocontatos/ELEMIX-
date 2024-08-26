const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hotbarWidth = document.getElementById('hotbar').offsetWidth;
canvas.width = window.innerWidth - hotbarWidth;
canvas.height = window.innerHeight;

let elementos = [];

function adicionarElemento(imageSrc, x, y, tipo = 'neutro') {
    const existeElemento = elementos.some(e => e.imageSrc === imageSrc && e.x === x && e.y === y);
    if (existeElemento) return;

    let novoElemento = {
        x: x - hotbarWidth,
        y: y,
        size: 75,
        imageSrc: imageSrc,
        tipo: tipo, // Adiciona o tipo
        dragging: false
    };

    const img = new Image();
    img.src = imageSrc;
    novoElemento.image = img;
    elementos.push(novoElemento);

    desenharelementos();
    adicionarElementoNaHotbar(imageSrc);
}

function removerTodosElementos() {
    elementos = [];
    desenharelementos();
}

function desenharelementos() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elementos.forEach(q => {
        ctx.drawImage(q.image, q.x, q.y, q.size, q.size);
    });
}

function getMousePos(e) {
    return {
        x: e.clientX - hotbarWidth,
        y: e.clientY
    };
}

function verificarSobreposicao(elemento1, elemento2) {
    return elemento1.x === elemento2.x && elemento1.y === elemento2.y;
}

function misturarElementos(elemento1, elemento2) {
    const nome1 = elemento1.imageSrc.split('/').pop().split('.').shift();
    const nome2 = elemento2.imageSrc.split('/').pop().split('.').shift();

    const combinacao = [nome1, nome2].sort().join('-');

    const novasImagens = {
        'ambicao-ferramentas': {
            imageSrc: 'elementos/armas.png',
            descricao: 'Armas criadas CUIDADO!',
            tipo: 'guerra' // Define o tipo como guerra
        },
        'energia-ferramentas': {
            imageSrc: 'elementos/maquina.png',
            descricao: 'Maquinas criadas!',
            tipo: 'neutro'
        },
        'ambicao-conhecimento': {
            imageSrc: 'elementos/tecnologia.png',
            descricao: 'Tecnologia criada!',
            tipo: 'neutro'
        },
        'tecnologia-tecnologia': {
            imageSrc: 'elementos/tecnologia.png',
            descricao: 'IMD criado! (EASTER EGG)',
            tipo: 'neutro'
        },
        'energia-tecnologia': {
            imageSrc: 'elementos/computacao.png',
            descricao: 'Computação criada!',
            tipo: 'neutro'
        },
        'conhecimento-fe': {
            imageSrc: 'elementos/filosofia.png',
            descricao: 'Filosofia criada!',
            tipo: 'paz' // Define o tipo como paz
        }
    };

    if (novasImagens[combinacao]) {
        if (!elementos.some(e => e.imageSrc === novasImagens[combinacao].imageSrc && e.x === elemento1.x && e.y === elemento1.y)) {
            const novoElemento = {
                x: elemento1.x,
                y: elemento1.y,
                size: 75,
                imageSrc: novasImagens[combinacao].imageSrc,
                tipo: novasImagens[combinacao].tipo, // Define o tipo do novo elemento
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

    removerTodosElementos();
}

function adicionarElementoNaHotbar(imageSrc) {
    const hotbar = document.getElementById('hotbar');

    const id = imageSrc.split('/').pop().split('.').shift();
    
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
        span.innerText = id.charAt(0).toUpperCase() + id.slice(1);

        img.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', id);
        });

        container.appendChild(img);
        container.appendChild(span);
        hotbar.appendChild(container);
    }
}

function exibirMensagem(mensagem) {
    const mensagemElemento = document.createElement('div');
    mensagemElemento.className = 'mensagem';
    mensagemElemento.innerText = mensagem;
    document.body.appendChild(mensagemElemento);

    setTimeout(() => {
        mensagemElemento.remove();
    }, 3000);
}

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

const lixeira = document.getElementById('lixeira');
lixeira.addEventListener('click', function() {
    removerTodosElementos();
});

// Função para verificar se algum elemento está próximo da área de evoluir
function verificarProximidadeEvoluir() {
    const evoluirArea = document.getElementById('evoluir');
    const evoluirRect = evoluirArea.getBoundingClientRect();
    const distanciaMinima = 50;

    elementos = elementos.filter(elemento => {
        const elementoRect = {
            left: elemento.x + hotbarWidth,
            top: elemento.y,
            right: elemento.x + hotbarWidth + elemento.size,
            bottom: elemento.y + elemento.size
        };

        const isCloseToEvoluir = (
            elementoRect.right >= evoluirRect.left - distanciaMinima &&
            elementoRect.left <= evoluirRect.right + distanciaMinima &&
            elementoRect.bottom >= evoluirRect.top - distanciaMinima &&
            elementoRect.top <= evoluirRect.bottom + distanciaMinima
        );

        if (isCloseToEvoluir) {
            console.log('Elemento próximo a evoluir:', elemento.imageSrc, elemento.tipo); // Log de depuração

            // Verifica se o elemento tem um tipo associado e processa conforme o tipo
            if (elemento.tipo) {
                if (elemento.tipo === "guerra") {
                    const contadorGuerra = document.getElementById('contador-guerra');
                    contadorGuerra.textContent = parseInt(contadorGuerra.textContent) + 1;
                    console.log('Incrementando contador de guerra');
                } else if (elemento.tipo === "paz") {
                    const contadorPaz = document.getElementById('contador-paz');
                    contadorPaz.textContent = parseInt(contadorPaz.textContent) + 1;
                    console.log('Incrementando contador de paz');
                }
                return false; // Remove o elemento da lista
            }
        }

        return true; // Mantém o elemento na lista
    });

    desenharelementos();
}

// Configura o intervalo para verificar a proximidade a cada 1 segundo
setInterval(verificarProximidadeEvoluir, 1000);
