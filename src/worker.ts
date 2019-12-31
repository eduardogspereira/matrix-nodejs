import * as fs from 'fs';
import { parentPort, workerData } from 'worker_threads';

const readFile = (filePath: string) => {
  const rawData = fs.readFileSync(filePath);
  return rawData.toString();
};

const parseMatrix = (rawData: string) => {
  const matrix: number[][] = [];

  // Not the most beautiful way to do it
  const matrixRows = rawData.split('\n');
  for (let i = 0; i < matrixRows.length; i += 1) {
    matrix[i] = [];
    const matrixColumns = matrixRows[i].split(' ');
    for (let j = 0; j < matrixColumns.length; j += 1) {
      const value = Number(matrixColumns[j]);
      matrix[i][j] = value;
    }
  }

  return matrix;
};

const main = async () => {
  const filePath = workerData;
  const rawData = readFile(filePath);
  const matrix = parseMatrix(rawData);
  parentPort?.postMessage(matrix);
};

main();
