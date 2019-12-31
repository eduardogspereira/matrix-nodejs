import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { Worker } from 'worker_threads';

const WORKER_NUMBERS = os.cpus().length;

const listMatrixFiles = (folderPath: string): string[] => {
  const files = fs.readdirSync(folderPath);
  return files.map(f => path.join(process.cwd(), folderPath, f));
};

const processMatrixFile = (filePath: string, callback: Function) => {
  const worker = new Worker(path.join(__dirname, 'worker.js'), {
    workerData: filePath,
  });

  return new Promise((resolve, reject) => {
    worker.once('message', v => resolve(callback(v)));
    worker.once('error', reject)
  });
};

export const main = async () => {
  const matrixFiles: string[] = listMatrixFiles('./matrix_files');

  const matrix: number[][] = [];

  // Not the most beautiful way to do it
  const sumMatrix = (newMatrix: number[][]) => {
    for (let i = 0; i < newMatrix.length; i += 1) {
      matrix[i] = matrix[i] || [];
      for (let j = 0; j < newMatrix.length; j += 1) {
        matrix[i][j] += newMatrix[i][j];
      }
    }
  };

  const makeWorker = async () => {
    while (matrixFiles.length >= 1) {
      const matrixFile = matrixFiles.pop();
      if (matrixFile != null) {
        await processMatrixFile(matrixFile, sumMatrix);
      }
    }
  };

  await Promise.all([...new Array(WORKER_NUMBERS)].map(makeWorker));

  console.log('Done!');
};
