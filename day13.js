import { group } from 'node:console'
import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

function parseInput(input) {
  const motifs = []
  const lignes = input.split('\n')
  let currentMotif = []
  for (const l of lignes) {
    if (l === '') {
      motifs.push(currentMotif)
      currentMotif = []
    } else {
      currentMotif.push(l.split(''))
    }
  }

  if (currentMotif.length !== 0) {
    motifs.push(currentMotif)
  }
  return motifs
}

function compareArrays (a, b) {
  if (a.length !== b.length) {
    return false
  }
  else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
function compareArraysDiff (a, b) {
  let nbError = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      nbError++
    }
  }
  return nbError
}

function getHorizontalSymmetry (arr) {
  let symHorizontal = null
  for (let i = 1; i < arr.length; i++) {
    const currentLine = arr[i]
    const symLine = arr[i - 1]
    if (compareArrays(currentLine, symLine)) {
      let next = i + 1
      let prev = i - 2
      let isRealSym = true
      while (next < arr.length && prev >= 0) {
        if (!compareArrays(arr[next], arr[prev])) {
          isRealSym = false
          break
        } else {
          next += 1
          prev -= 1
        }
      }
      if (isRealSym) {
        symHorizontal = i
        break
      }
      
    }
  }
  return symHorizontal
}

function getSymmetry (arr) {
  let symHorizontal = getHorizontalSymmetry(arr)

  const arr90 = Array(arr[0].length).fill([]).map((_, i) => {
    return arr.map(a => a[i])
  })

  let symVertial = getHorizontalSymmetry(arr90)

  return {
    symHorizontal,
    symVertial
  }
}

function getHorizontalSymmetryWithError (arr, maxError = 1) {
  let symHorizontal = null
  for (let i = 1; i < arr.length; i++) {
    const currentLine = arr[i]
    const symLine = arr[i - 1]
    const initialError = compareArraysDiff(currentLine, symLine)
    if (initialError <= maxError) {
      let next = i + 1
      let prev = i - 2
      let restError = maxError - initialError
      while (next < arr.length && prev >= 0) {
        const nbError = compareArraysDiff(arr[next], arr[prev])
        restError -= nbError
        if (restError < 0) {
          break
        } else {
          next += 1
          prev -= 1
        }
      }
      if (restError === 0) {
        symHorizontal = i
        break
      }
      
    }
  }
  return symHorizontal
}
function getSymmetryWithError (arr) {
  let symHorizontal = getHorizontalSymmetryWithError(arr, 1)
  let symVertial = null
  if (symHorizontal === null) {
    const arr90 = Array(arr[0].length).fill([]).map((_, i) => {
      return arr.map(a => a[i])
    })
    symVertial = getHorizontalSymmetryWithError(arr90, 1)
  }

  return {
    symHorizontal,
    symVertial
  }
}

function run (input) {
  const motifs = parseInput(input.replaceAll('\r', ''))

  {
    let scoreSym = 0
    motifs.forEach(motif => {
      const {symHorizontal, symVertial} = getSymmetry(motif)
      scoreSym += symHorizontal * 100 + symVertial
    })
    console.log(scoreSym)
  }

  {
    let scoreSym = 0
    motifs.forEach(motif => {
      const {symHorizontal, symVertial} = getSymmetryWithError(motif)
      scoreSym += symHorizontal * 100 + symVertial
    })
    console.log('Total', scoreSym)
  }
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()