"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const readline_1 = __importDefault(require("readline"));
const client = dgram_1.default.createSocket('udp4');
const PORT = 41234;
const HOST = 'localhost';
// Ler entrada do console
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Envia uma mensagem para o servidor
const sendMessage = (message) => {
    const msg = Buffer.from(message);
    client.send(msg, PORT, HOST, (err) => {
        if (err) {
            console.error('Erro ao enviar a mensagem:', err);
        }
        else {
            console.log('Mensagem enviada. Aguardando resposta...');
        }
    });
};
// Recebe a resposta do servidor
client.on('message', (msg) => {
    console.log(`Mensagem recebida do servidor: ${msg.toString()}`);
    client.close(); // Fecha o cliente após receber a resposta
});
// Lê a mensagem do console e envia
rl.question('Digite a mensagem para enviar ao servidor: ', (message) => {
    sendMessage(message);
    rl.close();
});
