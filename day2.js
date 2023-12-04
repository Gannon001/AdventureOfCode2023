import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

function parseInput (str) {
  const [strGameId, str2] = str.split(': ')
  const gameId = parseInt(strGameId.substr(5))
  const strTirages = str2.split('; ')
  const tirages = []
  for (const st of strTirages) {
    const tis = st.split(', ')
    const newTirages = {}
    for (const _tis of tis) {
      const [strCount, strColor] = _tis.split(' ')
      newTirages[strColor] = (newTirages[strColor] ?? 0) + parseInt(strCount)
    }
    tirages.push(newTirages)
  }
  return {
    id: gameId,
    tirages: tirages
  }
}

function run (input) {
  const games = input
  .split('\r\n')
  .map(parseInput)
  
  // let sumGameId = 0
  // for (const g of games) {
  //   let isOk = true
  //   for (const t of g.tirages) {
  //     if (t.red > 12 || t.green > 13 || t.blue > 14) {
  //       isOk = false
  //       break
  //     }
  //   }
  //   if (isOk) {
  //     console.log(g.id)
  //     sumGameId += g.id
  //   }
  // }
  // console.log('Total :', sumGameId)

  let sumPower = 0
  for (const g of games) {
    const colors = ['red', 'blue', 'green']
    const minColor = colors.map(c => {
      const lirCol = g.tirages.filter(t => t[c]).map(t => t[c])
      return Math.max(...lirCol)
    })
    sumPower += minColor[0] * minColor[1] * minColor[2]
  }
  console.log('Total :', sumPower)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()