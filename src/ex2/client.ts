import dgram from 'dgram';
import readline from 'readline';

const client = dgram.createSocket('udp4');
const PORT = 41234;
const HOST = 'localhost';

// Ler entrada do console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Envia uma mensagem para o servidor
const sendMessage = (message: string) => {
  const msg = Buffer.from(message);

  client.send(msg, PORT, HOST, (err) => {
    if (err) {
      console.error('Erro ao enviar a mensagem:', err);
    } else {
      console.log('Mensagem enviada. Aguardando resposta...');
    }
  });
};

// Recebe a resposta do servidor
client.on('message', (msg) => {
  console.log(`Mensagem recebida do servidor: ${msg.toString()}`);
  client.close(); // Fecha o cliente após receber a resposta
});

// Lê a mensagem do console e envia
rl.question('Digite a mensagem para enviar ao servidor: ', (message) => {
  sendMessage(message);
  rl.close();
});
