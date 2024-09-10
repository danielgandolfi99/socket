import dgram from 'dgram';
import { Worker } from 'worker_threads';

// Criar um worker e processar a mensagem
function processMessage(message: string, rinfo: dgram.RemoteInfo): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./dist/ex2/worker.js', {
      workerData: { message, rinfo }
    });

    worker.on('message', (reversedMessage: string) => {
      resolve(reversedMessage);
    });

    worker.on('error', (error) => {
      reject(error);
    });
  });
}

const server = dgram.createSocket('udp4');

server.on('message', async (msg, rinfo) => {
  console.log(`Mensagem recebida: ${msg.toString()} de ${rinfo.address}:${rinfo.port}`);

  try {
    const reversedMsg = await processMessage(msg.toString(), rinfo);
    server.send(reversedMsg, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Erro ao enviar a mensagem:', err);
      } else {
        console.log(`Mensagem invertida enviada de volta para ${rinfo.address}:${rinfo.port}`);
      }
    });
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }
});

server.on('error', (err) => {
  console.error(`Erro no servidor: ${err}`);
  server.close();
});

server.bind(41234, () => {
  console.log('Servidor UDP escutando na porta 41234');
});
