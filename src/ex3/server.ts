import dgram from 'dgram';
import { readFile } from 'fs/promises';
import path from 'path';

const server = dgram.createSocket('udp4');

// Defina o diretório base onde os arquivos estão localizados
const BASE_DIR = 'C:\\Users\\danie\\Downloads\\teste';

server.on('message', async (msg, rinfo) => {
    const filename = msg.toString();
    const filePath = path.join(BASE_DIR, filename);

    console.log(`Recebido pedido para o arquivo: ${filename}`);

    try {
        const fileContent = await readFile(filePath);
        console.log(`Enviando conteúdo do arquivo: ${filename}`);
        const response = `${filename}\n${fileContent}`;
        server.send(response, rinfo.port, rinfo.address);
    } catch (error) {
        const errorMsg = 'Arquivo não encontrado';
        console.log(`Erro ao encontrar o arquivo: ${filename}`);
        server.send(errorMsg, rinfo.port, rinfo.address);
    }
});

server.bind(40001, () => {
    console.log('Servidor UDP está aguardando solicitações na porta 40001');
});
