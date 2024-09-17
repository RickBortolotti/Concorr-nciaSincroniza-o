let saldo = 100;
const queue = [];
let isProcessing = false;

self.onmessage = (event) => {
    const { type, value, rendimento } = event.data;

    if (type === 'visualizar') {
        self.postMessage({ type: 'visualizar', saldoAtual: saldo });
    } else if (type === 'sair') {
        self.postMessage({ type: 'sair', saldoAtual: saldo });
    } else if (type === 'atualizarRendimento') {
        saldo += saldo * (rendimento / 100);
        processQueue();
    } else {
        queue.push({ type, value });
        if (!isProcessing) {
            processQueue();
        }
    }
};

function processQueue() {
    isProcessing = true;
    while (queue.length > 0) {
        const { type, value } = queue.shift();
        if (type === 'saque') {
            saldo -= value;
        } else if (type === 'deposito') {
            saldo += value;
        }
    }
    isProcessing = false;
}
