import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

function parseInput(input) {
  return input
    .split('\n')
    .map(l => l.split(''))
}

function tilt(platform , direction = 'E') {

  const getItemIndexByDirection = function (y, x) {
    if (direction === 'E') {
      return (y, x) => platform[y][x]
    } else if (direction === 'O') {
      return (y, x) => platform[y][platform.length - 1 - x]
    } else if (direction === 'S') {
      return (y, x) => platform[x][y]
    } else if (direction === 'N') {
      return (y, x) => platform[platform.length - 1 -x][y]
    }
  }

  const setItemIndexByDirection = function (y, x, value) {
    if (direction === 'E') {
      return (y, x, value) => { platform[y][x] = value }
    } else if (direction === 'O') {
      return (y, x, value) => { platform[y][platform.length - 1 - x] = value }
    } else if (direction === 'S') {
      return (y, x, value) => { platform[x][y] = value }
    } else if (direction === 'N') {
      return (y, x, value) => { platform[platform.length - 1 -x][y] = value }
    }
  }


  const maxY = platform.length
  const maxX = platform[0].length

  const getItemIndex = getItemIndexByDirection(direction)
  const setItemIndex = setItemIndexByDirection(direction)

  for (let y = 0; y < maxY; y++) {
    let roundedRock = 0
    for (let x = 0; x < maxX; x++) {
      const currentVal = getItemIndex(y, x)
      // const currentVal = platform[y][x]
      if (currentVal === 'O') {
        roundedRock ++
        setItemIndex(y, x, '.')
        // platform[y][x] = '.'
      } else if (currentVal === '#') {
        for (let bx = 0; bx < roundedRock; bx++) {
          setItemIndex(y, x - 1 - bx, 'O')
          // platform[y][x - 1 -bx] = 'O'
        }
        roundedRock = 0
      }
    }

    for (let bx = 0; bx < roundedRock; bx++) {
      setItemIndex(y, platform[y].length - 1 - bx, 'O')
      //platform[y][platform[y].length - 1 - bx] = 'O'
    }

  }
  return platform
}

function getTotalLoad (platform) {
  return platform.reduce((acc, l, i) => {
    return acc + l.filter(t => t === 'O').length * (platform.length - i)
  }, 0)
}

function getPlatfornKey (platform) {
  return platform.map(l => l.join('')).join('\n')
}

function run (input) {
  // Part 1
  {
    let platform = parseInput(input.replaceAll('\r', ''))
    platform = tilt(platform, 'N')
    console.log('Part 1 :', getTotalLoad(platform))
  }

  // Part 2
  {
    let platform = parseInput(input.replaceAll('\r', ''))

    let iteration = 0
    let resultTilt = {}
    let fristIter = undefined
    let nextIter = undefined

    while (true) {

      platform = tilt(platform, 'N')
      platform = tilt(platform, 'O')
      platform = tilt(platform, 'S')
      platform = tilt(platform, 'E')

      iteration += 1

      const key = getPlatfornKey(platform)
      if (resultTilt[key]) {
        // console.log(key)
        fristIter = resultTilt[key]
        nextIter = iteration
        break
      } else {
        resultTilt[key] = iteration
      }

      // DebugPrint
      // if (iteration === 3) {
      //   console.log('Iteration', iteration)
      //   console.log(platform.map(l => l.join('')).join('\n') )
      //   break
      // }
    }


    let nbIterRequire = 1000000000
    let nbIterStep = (nextIter - fristIter)
    let iterMulti = Math.floor((nbIterRequire - fristIter) / nbIterStep)
    let currentIter = fristIter + iterMulti * nbIterStep

    for (; currentIter < nbIterRequire; currentIter++) {
      platform = tilt(platform, 'N')
      platform = tilt(platform, 'O')
      platform = tilt(platform, 'S')
      platform = tilt(platform, 'E')
    }

    console.log('Part 2 :', getTotalLoad(platform))
  }
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()