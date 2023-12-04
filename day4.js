import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

function parseInput (str) {
  const [strCardId, strNums] = str.split(': ')
  const cardId = parseInt(strCardId.substr(4))
  const [
    numeroGagnants,
    mesNumeros
  ] = strNums.split(' | ')
    .map(srtListNum => {
      return srtListNum
        .split(' ')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseInt(s, 10))
    })
  return {
    cardId,
    numeroGagnants,
    mesNumeros,
  }
}

function getNbNumGagant({cardId, numeroGagnants, mesNumeros}) {
  let nbNumero = 0
  for (const num of numeroGagnants) {
    if (mesNumeros.includes(num)) {
      nbNumero ++
    }
  }
  return nbNumero
}

function getScore({cardId, numeroGagnants, mesNumeros}) {
  let nbNumero = getNbNumGagant({cardId, numeroGagnants, mesNumeros})
  return nbNumero ? Math.pow(2, nbNumero - 1) : 0
}

function run (input) {
  const cards = input
  .replaceAll('\r', '')
  .split('\n')
  .map(parseInput)
 
  const nbCard = Array(cards.length).fill(1)

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const nbNumGagant = getNbNumGagant(card)
    const currentNbCard = nbCard[i]
    for (let j = 0; j < nbNumGagant; j++) {
      nbCard[i + 1 + j] += currentNbCard
    }
  }

  const total = nbCard.reduce((acc, c) => acc + c, 0)
  console.log('Total :', total)

}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()