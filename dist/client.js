"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const readline_1 = __importDefault(require("readline"));
const client = dgram_1.default.createSocket('udp4');
const serverPort = 40001;
const serverHost = 'localhost';
// Cria uma interface readline para ler a entrada do console
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Função para enviar uma mensagem ao servidor
const sendMessage = (filename) => {
    client.send(filename, serverPort, serverHost, (err) => {
        if (err) {
            console.error('Erro ao enviar mensagem:', err);
            client.close();
            return;
        }
        console.log('Mensagem enviada. Aguardando resposta...');
    });
};
// Lê a entrada do usuário e envia a mensagem
const promptForFilename = () => {
    rl.question('Digite o nome do arquivo para solicitar: ', (filename) => {
        if (!filename) {
            console.error('Por favor, forneça o nome do arquivo.');
            return promptForFilename();
        }
        sendMessage(filename);
    });
};
// Configura o evento de recebimento de mensagens
client.on('message', (msg) => {
    console.log('Resposta do servidor:');
    if (msg.toString() === 'Arquivo não encontrado') {
        console.log('Erro: O arquivo não foi encontrado no servidor.');
    }
    else {
        console.log('Conteúdo do arquivo recebido:');
        console.log(msg.toString());
    }
    client.close();
});
// Configura o evento de erro
client.on('error', (err) => {
    console.error('Erro no cliente:', err);
    client.close();
});
// Inicia o prompt para o usuário
promptForFilename();
