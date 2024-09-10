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
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const server = dgram_1.default.createSocket('udp4');
// Defina o diretório base onde os arquivos estão localizados
const BASE_DIR = 'C:\\Users\\danie\\Downloads\\teste';
server.on('message', (msg, rinfo) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = msg.toString();
    const filePath = path_1.default.join(BASE_DIR, filename);
    console.log(`Recebido pedido para o arquivo: ${filename}`);
    try {
        const fileContent = yield (0, promises_1.readFile)(filePath);
        console.log(`Enviando conteúdo do arquivo: ${filename}`);
        // Envie o nome do arquivo e o conteúdo juntos, separados por um delimitador
        const response = `${filename}\n${fileContent}`;
        server.send(response, rinfo.port, rinfo.address);
    }
    catch (error) {
        const errorMsg = 'Arquivo não encontrado';
        console.log(`Erro ao encontrar o arquivo: ${filename}`);
        server.send(errorMsg, rinfo.port, rinfo.address);
    }
}));
server.bind(40001, () => {
    console.log('Servidor UDP está aguardando solicitações na porta 40001');
});
