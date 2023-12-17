import fs from 'node:fs/promises'
import path from 'node:path'

const OPERATION_REMOVE = 0
const OPERATION_ADD = 1

const inputExample = 
`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`



// Nord Est Sud Ouest
// Si le vaiseau vient du 'N'
// Il ira ver [Nord, Est, Sud, Ouest]
const T = true
const F = false

const N = 0
const E = 1
const S = 2
const O = 3
const _ = -1

const RelaiMirrorDirection = { 
  //         Nord           Est           Sud         Ouest
  //      N  E  S  O    N  E  S  O    N  E  S  O    N  E  S  O 
  '.' : [[_, _, N, _], [_, _, _, E], [S, _, _, _], [_, O, _, _]],

  '|' : [[_, _, N, _], [S, _, N, _], [S, _, _, _], [S, _, N, _]],
  '-' : [[_, O, _, E], [_, _, _, E], [_, O, _, E], [_, O, _, _]],

  '/' : [[_, _, _, E], [_, _, N, _], [_, O, _, _], [S, _, _, _]],
  '\\': [[_, O, _, _], [S, _, _, _], [_, _, _, E], [_, _, N, _]],
}
function parseInput(input) {
  return input.replaceAll('\r', '')
    .split('\n')
    .map(l => l.split(''))
}



function parcourtRelai (matrix, nextStep = []) {
  const FaisceauHistory = new Map()
  const matrixEnergise = [...matrix].map(l => l.map(_ => '.'))
  // console.log(matrixEnergise.map(l => l.join('')).join('\n'))

  if (nextStep.length === 0) {
    return
  }

  while (nextStep.length !== 0) {
    const laser = nextStep.shift()
    const y = laser.y
    const x = laser.x
    const key = y + '_' + x + '_' + laser.D

    if (FaisceauHistory.has(key)) {
      continue
    }

    const tuile = matrix[y][x]
    const continuLaser = RelaiMirrorDirection[tuile][laser.D]
    
    FaisceauHistory.set(key, true)

    matrixEnergise[y][x] = '#'


    if (continuLaser[N] !== _ && y !== 0) {
      nextStep.push({ y: y - 1, x, D: continuLaser[N] })
    }
    if (continuLaser[E] !== _ && x < matrix[0].length - 1) {
      nextStep.push({ y, x: x + 1, D: continuLaser[E] })
    }
    if (continuLaser[S] !== _ && y < matrix.length - 1) {
      nextStep.push({ y: y + 1, x, D: continuLaser[S] })
    }
    if (continuLaser[O] !== _ && x !== 0) {
      nextStep.push({ y, x: x - 1, D: continuLaser[O] })
    }

  }

  return matrixEnergise

}


function run (input) {

  // Part 1
  const matrix = parseInput(input)
  const matrixEnergise = parcourtRelai(matrix, [{y: 0, x: 0, D: O}])
  const totalEnergie = matrixEnergise.flat().reduce((acc, t) => {
    return acc + (t === '#' ? 1 : 0)
  }, 0)
  console.log('Part 1', totalEnergie)

  const possibleEntree = []
  for (let y = 0; y < matrix.length; y++) {
    possibleEntree.push({ y: y, x: 0, D: O })
    possibleEntree.push({ y: y, x: matrix.length - 1, D: E })
  }
  for (let x = 0; x < matrix[0].length; x++) {
    possibleEntree.push({ y: 0, x: x, D: N })
    possibleEntree.push({ y: matrix.length - 1, x: x, D: S })
  }


  let maxEnergi = 0
  for (const laserEntre of possibleEntree) {
    const matrixEnergise = parcourtRelai(matrix, [laserEntre])
    const totalEnergie = matrixEnergise.flat().reduce((acc, t) => {
      return acc + (t === '#' ? 1 : 0)
    }, 0)
    if (totalEnergie > maxEnergi) {
      maxEnergi = totalEnergie
    }
  }

  console.log('Part 2 :', maxEnergi)

}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()