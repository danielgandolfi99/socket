"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const client = dgram_1.default.createSocket('udp4');
const PORT = 40001;
const HOST = 'localhost';
// Interface para ler entrada do console
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Função para enviar uma solicitação de arquivo para o servidor
const requestFile = (filename) => {
    const msg = Buffer.from(filename);
    client.send(msg, PORT, HOST, (err) => {
        if (err) {
            console.error('Erro ao enviar a solicitação:', err);
        }
        else {
            console.log('Solicitação de arquivo enviada. Aguardando resposta...');
        }
    });
};
// Recebe o conteúdo do arquivo e salva no disco
client.on('message', (msg) => {
    const data = msg.toString();
    const [filename, fileContent] = data.split('\n', 2);
    if (fileContent) {
        fs_1.default.writeFile(filename, fileContent, (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
            }
            else {
                console.log(`Arquivo recebido e salvo como "${filename}"`);
            }
        });
    }
    else {
        // Caso o conteúdo da mensagem seja um erro
        console.log(`Erro do servidor: ${filename}`);
    }
    client.close(); // Fecha o cliente após receber a resposta
});
// Lê o nome do arquivo do console e envia a solicitação
rl.question('Digite o nome do arquivo para solicitar: ', (filename) => {
    requestFile(filename);
    rl.close();
});
