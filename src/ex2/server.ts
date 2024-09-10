import dgram from 'dgram';
import { Worker } from 'worker_threads';

// Função para processar a mensagem em um worker
function processMessage(message: string, rinfo: dgram.RemoteInfo): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./dist/ex2/worker.js', {
      workerData: { message, rinfo } // Passa os dados para o worker
    });

    // Recebe a mensagem processada
    worker.on('message', (reversedMessage: string) => {
      resolve(reversedMessage);
    });

    worker.on('error', (error) => {
      reject(error); // Tratamento de erros
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker finalizado com código de saída ${code}`));
      }
    });
  });
}

// Criar o servidor UDP
const server = dgram.createSocket('udp4');

server.on('message', async (msg, rinfo) => {
  console.log(`Mensagem recebida: ${msg.toString()} de ${rinfo.address}:${rinfo.port}`);

  try {
    // Processa a mensagem utilizando um worker em uma thread separada
    const reversedMsg = await processMessage(msg.toString(), rinfo);

    // Envia a resposta para o cliente
    server.send(reversedMsg, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Erro ao enviar a mensagem:', err);
      } else {
        console.log(`Mensagem invertida enviada para ${rinfo.address}:${rinfo.port}`);
      }
    });
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }
});

// Tratamento de erros no servidor
server.on('error', (err) => {
  console.error(`Erro no servidor: ${err}`);
  server.close();
});

// O servidor escuta na porta 41234
server.bind(41234, () => {
  console.log('Servidor UDP escutando na porta 41234');
});
