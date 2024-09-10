"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const server = dgram_1.default.createSocket('udp4');
// Função para inverter a string
const reverseString = (str) => {
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
