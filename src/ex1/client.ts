import dgram from "dgram";
import readline from "readline";

const client = dgram.createSocket("udp4");
const PORT = 40001;
const HOST = "localhost";

// Le entrada do console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Envia uma mensagem para o servidor
const sendMessage = (message: string) => {
  client.send(message, PORT, HOST, (err) => {
    if (err) {
      console.error("Erro ao enviar a mensagem:", err);
    } else {
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
