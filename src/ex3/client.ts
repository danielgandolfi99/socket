import dgram from 'dgram';
import fs from 'fs';
import readline from 'readline';

const client = dgram.createSocket('udp4');
const PORT = 40002;
const HOST = 'localhost';

// Le entrada do console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para enviar uma solicitação de arquivo ao servidor
const requestFile = (filename: string) => {
    const msg = Buffer.from(filename);
    client.send(msg, PORT, HOST, (err) => {
        if (err) {
            console.error('Erro ao enviar a solicitação:', err);
        } else {
            console.log('Solicitação de arquivo enviada. Aguardando resposta...');
        }
    });
};

// Recebe o conteúdo do arquivo e salvá-lo no disco
client.on('message', (msg) => {
    // Converte para string para ver se é uma mensagem de erro
    const response = msg.toString('utf-8');

    if (response.startsWith('Erro:')) {
        // Caso o conteúdo da mensagem seja um erro
        console.log(response);

        // Continua pedindo o nome do arquivo após o erro
        promptForFilename();
    } else {
        // Salvar o arquivo binário
        const [filename, fileData] = response.split('\n', 2);
        fs.writeFile(filename, fileData, 'binary', (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
            } else {
                console.log(`Arquivo recebido e salvo como "${filename}"`);
                client.close();
            }
        });
    }
});

// Continua perguntando o nome do arquivo
const promptForFilename = () => {
    rl.question('Digite o nome do arquivo para baixar: ', (filename) => {
        requestFile(filename);
    });
};

// Iniciar o prompt
promptForFilename();
