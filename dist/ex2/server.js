"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const worker_threads_1 = require("worker_threads");
// Criar um worker e processar a mensagem
function processMessage(message, rinfo) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker('./dist/ex2/worker.js', {
            workerData: { message, rinfo }
        });
        worker.on('message', (reversedMessage) => {
            resolve(reversedMessage);
        });
        worker.on('error', (error) => {
            reject(error);
        });
    });
}
const server = dgram_1.default.createSocket('udp4');
server.on('message', (msg, rinfo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Mensagem recebida: ${msg.toString()} de ${rinfo.address}:${rinfo.port}`);
    try {
        const reversedMsg = yield processMessage(msg.toString(), rinfo);
        server.send(reversedMsg, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Erro ao enviar a mensagem:', err);
            }
            else {
                console.log(`Mensagem invertida enviada de volta para ${rinfo.address}:${rinfo.port}`);
            }
        });
    }
    catch (error) {
        console.error('Erro ao processar a mensagem:', error);
    }
}));
server.on('error', (err) => {
    console.error(`Erro no servidor: ${err}`);
    server.close();
});
server.bind(41234, () => {
    console.log('Servidor UDP escutando na porta 41234');
});
