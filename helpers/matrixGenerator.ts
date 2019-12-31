import * as fs from 'fs'
import { range } from 'ramda'

const MATRIX_WIDTH = 2e2
const MATRIX_HEIGHT = 2e2

const matrix: Number[][]  = []

for (const x of range(0, MATRIX_WIDTH)) {
    matrix[x] = []
    for (const y of range(0, MATRIX_HEIGHT)) {
        matrix[x][y] = Math.random() * 10
    }
}

const matrixASCIIRows = []
for (const row of matrix) {
    matrixASCIIRows.push(row.join(' '))
}

fs.writeFileSync('./matrix.data', matrixASCIIRows.join('\n'))