import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`


const Nord = ['|', 'F', '7', 'S']
const Est = ['J', '-', '7', 'S']
const Sud = ['|', 'L', 'J', 'S']
const Ouest = ['-', 'F', 'L', 'S']
// Tuiles : [N, E, S, O]
const DirectionAccepts = {
  '-': [false, true , false, true ],
  '|': [true , false, true , false],

  'F': [false, true , true , false],
  '7': [false, false, true , true ],
  'L': [true , true , false, false],
  'J': [true , false, false, true ],

  'S': [true , true , true , true ],
  '.': [false, false, false, false],
}


function parseInput(str) {

  const map = str.split('\n')
    .map(l => l.split(''))
  
  // Find S
  let x = 0, y = 0
  for (let _y = 0; _y < map.length; _y++) {
    const _x = map[_y].findIndex(t => t === 'S')
    if (_x !== -1) {
      x = _x
      y = _y
      break
    }
  }

  const mapX2 = map.map(r => r.map(c => '.'))
  
  let count = 0
  let currentTuile = map[y][x]
  let from = null
  do {

    const tNord   = map[y - 1]?.[x] ?? '.'
    const tEst    = map[y]?.[x + 1] ?? '.'
    const tSud    = map[y + 1]?.[x] ?? '.'
    const tOuest  = map[y]?.[x - 1] ?? '.'

    const canNord  = DirectionAccepts[currentTuile][0] && Nord.includes(tNord)
    const canEst   = DirectionAccepts[currentTuile][1] && Est.includes(tEst)
    const canSud   = DirectionAccepts[currentTuile][2] && Sud.includes(tSud)
    const canOuest = DirectionAccepts[currentTuile][3] && Ouest.includes(tOuest)

    // console.log({
    //   tuilesAccepts, 
    //   a: tuilesAccepts[currentTuile],
    //   canNord,
    //   canEst,
    //   canSud,
    //   canOuest,
    // })

    if (from !== 'N' && canNord) {
      y = y - 1
      from = 'S'
    } else if (from !== 'E' && canEst) {
      x = x + 1
      from = 'O'
    } else if (from !== 'S' && canSud) {
      y = y + 1
      from = 'N'
    } else if (from !== 'O' && canOuest) {
      x = x - 1
      from = 'E'
    }
    currentTuile = map[y][x]
    count ++
    // console.log({
    //   currentTuile, y, x
    // })

  } while (currentTuile !== 'S')
    


  console.log({x, y}, count)

  // return count / 2

  return mapX2
}

function parseInput2(str) {

  const map = str.split('\n')
    .map(l => l.split(''))
  
  // Find S
  let x = 0, y = 0
  for (let _y = 0; _y < map.length; _y++) {
    const _x = map[_y].findIndex(t => t === 'S')
    if (_x !== -1) {
      x = _x
      y = _y
      break
    }
  }

  const mapX2 = Array(map.length * 2).fill(0).map(r => {
    return Array(map[0].length * 2).fill(' ')
  })
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      mapX2[y*2+1][x*2] = ':'
      mapX2[y*2][x*2+1] = ':'
      mapX2[y*2+1][x*2+1] = ':'
    }  
  }
  
  let count = 0
  let currentTuile = map[y][x]
  let from = null
  do {

    const tNord   = map[y - 1]?.[x] ?? '.'
    const tEst    = map[y]?.[x + 1] ?? '.'
    const tSud    = map[y + 1]?.[x] ?? '.'
    const tOuest  = map[y]?.[x - 1] ?? '.'

    const canNord  = DirectionAccepts[currentTuile][0] && Nord.includes(tNord)
    const canEst   = DirectionAccepts[currentTuile][1] && Est.includes(tEst)
    const canSud   = DirectionAccepts[currentTuile][2] && Sud.includes(tSud)
    const canOuest = DirectionAccepts[currentTuile][3] && Ouest.includes(tOuest)

    // console.log({
    //   tuilesAccepts, 
    //   a: tuilesAccepts[currentTuile],
    //   canNord,
    //   canEst,
    //   canSud,
    //   canOuest,
    // })

    mapX2[y*2 + 0][x*2 + 0] = '█' // map[y][x]
    mapX2[y*2 + 1][x*2 + 0] = mapX2[y*2 + 1][x*2 + 0] === '█' ? '█' : ':'
    mapX2[y*2 + 0][x*2 + 1] = mapX2[y*2 + 0][x*2 + 1] === '█' ? '█' : ':'
    mapX2[y*2 + 1][x*2 + 1] = mapX2[y*2 + 1][x*2 + 1] === '█' ? '█' : ':'

    if (from !== 'N' && canNord) {
      mapX2[y*2 - 1][x*2] = '█'
      y = y - 1
      from = 'S'
    } else if (from !== 'E' && canEst) {
      mapX2[y*2][x*2 + 1] = '█'
      x = x + 1
      from = 'O'
    } else if (from !== 'S' && canSud) {
      mapX2[y*2 + 1][x*2] = '█'
      y = y + 1
      from = 'N'
    } else if (from !== 'O' && canOuest) {
      mapX2[y*2][x*2 - 1] = '█'
      x = x - 1
      from = 'E'
    }
    
    currentTuile = map[y][x]
    count ++

  } while (currentTuile !== 'S')

  return { map, mapX2 }
}

function printMatrix(matrix) {
  const str = matrix.map(r => r.join(''))
    .join('\n')
    .replaceAll('.', ' ')
    .replaceAll('J', '╝')
    .replaceAll('F', '╔')
    .replaceAll('L', '╚')
    .replaceAll('7', '╗')
    .replaceAll('|', '║')
    .replaceAll('-', '═')
  console.log(str)
}

function printMatrixPos(matrix) {
  const str = matrix.map(r => r.map(p => p.value).join(''))
    .join('\n')
    .replaceAll('.', ' ')
    .replaceAll('J', '╝')
    .replaceAll('F', '╔')
    .replaceAll('L', '╚')
    .replaceAll('7', '╗')
    .replaceAll('|', '║')
    .replaceAll('-', '═')
  console.log(str)
}

function run (input) {
  // const tuiles = parseInput(input.replaceAll('\r', ''))


  const {map, mapX2} = parseInput2(input.replaceAll('\r', ''))
  printMatrix(map)
  printMatrix(mapX2)
  
  const witdh = mapX2[0].length
  const mapWithPos = mapX2.map((l, y) => {
    return l.map((r, x) => ({
      y: y,
      x: x,
      value: r,
      key: y * witdh + x
    }))
  })
  
  const mapKey = {}
  mapWithPos.forEach(ml => {
    ml.forEach(m => {
      mapKey[m.key] = m
    })
  })

  const queueCheck = [
    ...mapWithPos[0],
    ...mapWithPos[mapWithPos.length - 1],
    ...mapWithPos.map(r => r[0]),
    ...mapWithPos.map(r => r[r.length - 1])
  
  ]
  const dejaCheck = {}

  const checkNext = [
    [+1, 0],
    [-1, 0],
    [0, +1],
    [0, -1]
  ]

  while (queueCheck.length !== 0) {
    const pos = queueCheck.shift()
    if (pos.value === '█') {
      dejaCheck[pos.key] = true
      continue
    }
    pos.value = 'X'
    dejaCheck[pos.key] = true

    for (const [py, px] of checkNext) {
      const aCheck = mapWithPos[pos.y + py]?.[pos.x + px]
      if (aCheck && aCheck.value !== '█' && dejaCheck[aCheck.key] !== true) {
        dejaCheck[aCheck.key] = true
        queueCheck.push(aCheck)
      }
    }
  }

  let count = 0
  for (let y = 0; y < mapWithPos.length; y++) {
    for (let x = 0; x < mapWithPos[0].length; x++) {
      if (mapWithPos[y][x].value === ' ') {
        count++
      }
    }  
  }

  printMatrixPos(mapWithPos)
  console.log(count)


}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()