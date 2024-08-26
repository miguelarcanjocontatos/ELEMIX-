const messages = [
    "Você será o deus de um novo mundo. Todo poderoso, seu objetivo será criar vida a partir de elementos limitados e um pouco de poder sobrenatural.",
    "Você pode se sentir um pouco poderoso nesta simulação, mas será que esse poder irá subir para a cabeça?",
    "Crie os humanos, e não deixe que as coisas desandem...",
    "Você saberá do que estou falando quando for o momento certo..."
];

function typeMessage(element, message, index, callback) {
    if (index < message.length) {
        element.innerHTML += message.charAt(index);
        index++;
        setTimeout(() => typeMessage(element, message, index, callback), 50);
    } else {
        setTimeout(callback, 3000);
    }
}

function showMessages(index = 0) {
    if (index >= messages.length) {
        fadeOutAndRedirect();
        return;
    }

    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    messageContainer.style.display = 'block';

    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageContainer.appendChild(messageElement);

    typeMessage(messageElement, messages[index], 0, () => {
        messageContainer.style.display = 'none';
        showMessages(index + 1);
    });
}

function fadeOutAndRedirect() {
    const container = document.querySelector('.container');
    container.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'elemix1.html';
    }, 1000); // Tempo para o efeito de fade-out
}

function startGame() {
    showMessages();
}

function showCredits() {
    document.getElementById('creditsModal').style.display = 'flex';
}

function closeCredits() {
    document.getElementById('creditsModal').style.display = 'none';
}
