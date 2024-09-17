const rendimentoInterval = 10000; 
const taxaRendimento = 1; 

setInterval(() => {
    postMessage(taxaRendimento);
}, rendimentoInterval);
