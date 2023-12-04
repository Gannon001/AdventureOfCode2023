import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = null // `onetwo`

const letter2Number = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}
const letterNumbers = Object.keys(letter2Number)

function getLetterGeneric (str, strWith, strPushAfter = true ) {
  let currentText = ''
  for (const c of str) {
    if (c>= '0' && c <= '9') {
      return c - '0'
    }
    currentText = strPushAfter ? currentText + c : c +currentText
    for (const ln of letterNumbers) {
      if (strWith.bind(currentText)(ln)) {
        return letter2Number[ln]
      }
    }
  }
  return 0
}

function getFristNumber (str, ) {
  return getLetterGeneric(str, String.prototype.endsWith, true)
}

function getLastNumber (str) {
  return getLetterGeneric(str.reverse(), String.prototype.startsWith, false)
}

function getValue(str) {
  const arrayStr = [...str]
  const f = getFristNumber(arrayStr)
  const l = getLastNumber(arrayStr)
  return f * 10 + l
}


function run (input) {
  const total = input
  .split('\n')
  .reduce((acc, s) => {
    return acc + getValue(s)
  }, 0)

  console.log(total)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(inputExample ?? input)
})()