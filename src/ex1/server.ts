import dgram from 'dgram';

const server = dgram.createSocket('udp4');

// Função para inverter a string
const reverseString = (str: string) => {
    return str.split('').reverse().join('');
};

server.on('message', (msg, rinfo) => {
    const message = msg.toString();
    console.log(`Recebido do cliente ${rinfo.address}:${rinfo.port} - Mensagem: ${message}`);

    // Inverte a mensagem recebida
    const reversedMessage = reverseString(message);

    console.log(`Enviando mensagem invertida: ${reversedMessage}`);
    server.send(reversedMessage, rinfo.port, rinfo.address);
});

server.bind(40001, () => {
    console.log('Servidor UDP está aguardando solicitações na porta 40001');
});
