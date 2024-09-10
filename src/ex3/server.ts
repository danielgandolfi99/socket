import dgram from 'dgram';
import { readFile } from 'fs/promises';
import path from 'path';

const server = dgram.createSocket('udp4');

// Definir o diretório base onde os arquivos estão localizados
const BASE_DIR = 'C:\\Users\\daniel\\Downloads\\teste';

server.on('message', async (msg, rinfo) => {
    const filename = msg.toString().trim(); // Remover espaços em branco ao redor
    const filePath = path.join(BASE_DIR, filename);

    console.log(`Recebido pedido para o arquivo: ${filename}`);

    try {
        // Le o conteúdo do arquivo como buffer binário
        const fileContent = await readFile(filePath);
        console.log(`Enviando conteúdo do arquivo: ${filename}`);

        // Enviar o conteúdo como buffer
        const response = Buffer.concat([Buffer.from(`${filename}\n`), fileContent]);
        server.send(response, rinfo.port, rinfo.address);
    } catch (error) {
        const errorMsg = `Erro: Arquivo "${filename}" não encontrado`;
        console.log(errorMsg);
        
        // Enviar uma mensagem de erro para o cliente
        server.send(errorMsg, rinfo.port, rinfo.address);
    }
});

// Iniciar o servidor na porta 40002
server.bind(40002, () => {
    console.log('Servidor UDP está aguardando solicitações na porta 40002');
});
