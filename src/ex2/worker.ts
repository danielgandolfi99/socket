import { parentPort, workerData } from 'worker_threads';

const reversedMsg = workerData.message.split('').reverse().join('');
parentPort?.postMessage(reversedMsg);
