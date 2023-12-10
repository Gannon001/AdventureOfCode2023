import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

function parseInput(str) {
  return str.split(' ').map(s => parseInt(s, 10))
}

function extrapole (values, prevValue = null) {
  
  let prevV = values[0]
  let derivValue = []
  for (let i = 1; i < values.length; i++) {
    const v = values[i]
    derivValue.push(v - prevV)
    prevV = v
  }
  
  // check 0
  let is0 = derivValue.filter(v => v !== 0).length === 0

  if (is0) {
    return values[values.length - 1] + derivValue[derivValue.length -1]
  } else {
    const derivPlus = extrapole(derivValue)
    return values[values.length - 1] + derivPlus
  }

}

function intrapole (values, prevValue = null) {
  return extrapole(values.reverse())
}

function run (input) {
  const releves = input
  .replaceAll('\r', '')
  .split('\n')
  .map(parseInput)
  
  // Part 1
  {
    const allExtrapole = releves.map(r => extrapole(r))
    const total = allExtrapole.reduce((acc, v) => acc + v, 0)
    console.log('Total Part 1',total)
  }

  // Part 2
  {
    const allExtrapole = releves.map(r => intrapole(r))
    const total = allExtrapole.reduce((acc, v) => acc + v, 0)
    console.log('Total Part 2',total)
  }
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()