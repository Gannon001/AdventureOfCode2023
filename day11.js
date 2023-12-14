import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`


function parseInput(str) {
  return str.split('\n').map(l => l.split(''))
}

function expandUniver (univer) {
  let yExtand = []
  for (let x = 0; x < univer[0].length; x++) {
    const yLine = univer.map(l => l[x])
    const hasGalaxy = yLine.some(u => u !== '.')
    if (!hasGalaxy) {
      yExtand.push(x)
    }
  }

  const expand1 = univer.reduce((acc, lu) => {
    const nlu = lu.reduce((acc2, c, i) => {
      acc2.push(c)
      if (yExtand.includes(i)) {
        acc2.push(c)
      }
      return acc2
    }, [])
    acc.push(nlu)
    const hasGalaxy = lu.some(u => u !== '.')
    if (!hasGalaxy) {
      acc.push(nlu)
    }
    return acc
  }, [])

  console.log(yExtand)
  return expand1
}


function run (input) {
  // Part 1
  // const univer = parseInput(input.replaceAll('\r', ''))
  // const univerExpand = expandUniver(univer)

  // const galaxyPosition = []
  // for (let i = 0; i  < univerExpand.length; i++) {
  //   for (let j = 0; j < univerExpand[i].length; j++) {
  //     const symbole = univerExpand[i][j]
  //     if (symbole === '#') {
  //       galaxyPosition.push({y: i, x: j})
  //     }
  //   }
  // }
  // let totalDistance = 0

  // for (let i = 0; i  < galaxyPosition.length; i++) {
  //   for (let j = i + 1; j < galaxyPosition.length; j++) {
  //     const g1 = galaxyPosition[i]
  //     const g2 = galaxyPosition[j]
  //     const dist = Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y) // - 1 + 1
  //     totalDistance += dist
  //   }
  // }

  // console.log(totalDistance)

  // Part 2

  const expandMultiplicateur = 1000000
  const univer = parseInput(input.replaceAll('\r', ''))
  let xExtand = []
  for (let x = 0; x < univer[0].length; x++) {
    const yLine = univer.map(l => l[x])
    const hasGalaxy = yLine.some(u => u !== '.')
    if (!hasGalaxy) {
      xExtand.push(x)
    }
  }

  let yExtand = []
  for (let y = 0; y < univer.length; y++) {
    const lu = univer[y]
    const hasGalaxy = lu.some(u => u !== '.')
    if (!hasGalaxy) {
      yExtand.push(y)
    }
  }

  let galaxyPosition = []
  for (let i = 0; i  < univer.length; i++) {
    for (let j = 0; j < univer[i].length; j++) {
      const symbole = univer[i][j]
      if (symbole === '#') {
        galaxyPosition.push({y: i, x: j})
      }
    }
  }

  let totalDistance = 0
  for (let i = 0; i  < galaxyPosition.length; i++) {
    for (let j = i + 1; j < galaxyPosition.length; j++) {
      const g1 = galaxyPosition[i]
      const g2 = galaxyPosition[j]
      let x1 = g1.x
      let x2 = g2.x
      let y1 = g1.y
      let y2 = g2.y

      if (x1 > x2) {
        [x1, x2] = [x2, x1]
      }
      if (y1 > y2) {
        [y1, y2] = [y2, y1]
      }

      const nbVideX = xExtand.filter(x => x > x1 && x < x2).length
      const nbVideY = yExtand.filter(y => y > y1 && y < y2).length

      const dist = (x2 - x1) + (y2 - y1)
        + (expandMultiplicateur - 1) * nbVideX
        + (expandMultiplicateur - 1) * nbVideY
        // - 1 + 1
      // console.log({ g1, g2, dist })
      totalDistance += dist
    }
  }

  console.log(totalDistance)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()