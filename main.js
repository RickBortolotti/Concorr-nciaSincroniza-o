let operationType = null;
let operationValue = null;

const saldoWorker = new Worker('saldoWorker.js');
const rendimentoWorker = new Worker('rendimentoWorker.js');

document.getElementById('output').innerText = 'Saldo inicial: R$ 100.00';

function setOperation(type) {
    operationType = type;
    operationValue = parseFloat(document.getElementById('valueInput').value);
    if (isNaN(operationValue) && type !== 'visualizar' && type !== 'sair') {
        alert('Por favor, insira um valor válido.');
        operationType = null;
        operationValue = null;
    }
}

function confirmarOperacao() {
    if (operationType === null) {
        alert('Nenhuma operação selecionada.');
        return;
    }

    if (operationType === 'visualizar' || operationType === 'sair') {
        sendToSaldoWorker(operationType);
    } else {
        sendToSaldoWorker(operationType, operationValue);
    }

    operationType = null;
    operationValue = null;
}

function visualizar() {
    sendToSaldoWorker('visualizar');
}

function sair() {
    sendToSaldoWorker('sair');
}

function sendToSaldoWorker(type, value) {
    saldoWorker.postMessage({ type, value });
}

saldoWorker.onmessage = (event) => {
    const { type, saldoAtual } = event.data;
    if (type === 'visualizar') {
        document.getElementById('output').innerText = `Saldo: R$ ${saldoAtual.toFixed(2)}`;
    } else if (type === 'sair') {
        document.getElementById('output').innerText = `Saldo final: R$ ${saldoAtual.toFixed(2)}`;
        rendimentoWorker.terminate();
        saldoWorker.terminate();
    }
};

rendimentoWorker.onmessage = (event) => {
    saldoWorker.postMessage({ type: 'atualizarRendimento', rendimento: event.data });
};
