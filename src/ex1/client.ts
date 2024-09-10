import dgram from 'dgram';
import readline from 'readline';

const client = dgram.createSocket('udp4');
const serverPort = 40001;
const serverHost = 'localhost';

// Ler entrada do console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Envia uma mensagem para o servidor
const sendMessage = (message: string) => {
    client.send(message, serverPort, serverHost, (err) => {
        if (err) {
            console.error('Erro ao enviar mensagem:', err);
            client.close();
            return;
        }
        console.log('Mensagem enviada. Aguardando resposta...');
    });
};

// Lê a entrada do usuário e envia a mensagem
const promptForMessage = () => {
    rl.question('Digite a mensagem para enviar ao servidor: ', (message) => {
        if (!message) {
            console.error('Por favor, forneça uma mensagem.');
            return promptForMessage();
        }
        sendMessage(message);
    });
};

// Configura o evento de recebimento de mensagens
client.on('message', (msg) => {
    console.log('Resposta do servidor:', msg.toString());
    promptForMessage();
});

// Configura o evento de erro
client.on('error', (err) => {
    console.error('Erro no cliente:', err);
    client.close();
});

// Inicia o prompt para o usuário
promptForMessage();
