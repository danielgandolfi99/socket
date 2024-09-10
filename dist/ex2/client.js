"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const readline_1 = __importDefault(require("readline"));
const client = dgram_1.default.createSocket("udp4");
const PORT = 41234;
const HOST = "localhost";
// Le entrada do console
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Envia uma mensagem para o servidor
const sendMessage = (message) => {
    client.send(message, PORT, HOST, (err) => {
        if (err) {
            console.error("Erro ao enviar a mensagem:", err);
        }
        else {
            console.log("Mensagem enviada. Aguardando resposta...");
        }
    });
};
// Função para continuar pedindo mensagens
const promptForMessage = () => {
    rl.question("Digite a mensagem para enviar ao servidor: ", (message) => {
        if (!message) {
            console.error("Por favor, forneça uma mensagem.");
            return promptForMessage(); // Se a mensagem estiver vazia, solicita novamente.
        }
        sendMessage(message);
    });
};
// Recebe a resposta do servidor
client.on("message", (msg) => {
    console.log("Resposta do servidor:", msg.toString());
    promptForMessage(); // Após receber a resposta, pede uma nova mensagem.
});
// Configura o evento de erro
client.on("error", (err) => {
    console.error("Erro no cliente:", err);
    client.close();
});
// Inicia o prompt para o usuário
promptForMessage();
