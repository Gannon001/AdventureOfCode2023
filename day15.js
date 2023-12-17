import fs from 'node:fs/promises'
import path from 'node:path'

const OPERATION_REMOVE = 0
const OPERATION_ADD = 1

const inputExample = 
`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

function hash (str) {
  let val = 0
  for (const c of str) {
    val += c.charCodeAt(0)
    val *= 17
    val %= 256
  }
  return val
}

function parseInput(input) {
  return input
  .replaceAll('\r', '').replaceAll('\n', '')
  .split(',')
  .map(seqStr => {
    let ope = undefined
    let focal = undefined
    let chaine = undefined
    if (seqStr[seqStr.length -1] === '-') {
      ope = OPERATION_REMOVE
      chaine = seqStr.slice(0, -1)
    } else {
      focal = seqStr[seqStr.length -1] - '0'
      ope = OPERATION_ADD
      chaine = seqStr.slice(0, -2)
    }
    
    return {
      seq: seqStr,
      label: chaine,
      boxNumber: hash(chaine),
      operation: ope,
      focal: focal
    }
  })
}


function printBox (boxs) {
  let str = ''
  for (let i = 0; i < boxs.length; i++) {
    if (boxs[i].length !== 0) {
      str += 'Box ' + i.toString().padEnd(4, ' ') + ': '
      str += boxs[i].map(f => `[${f.label} ${f.focal}]`).join(' ')
      str += '\n'
    }
  }
  process.stdout.write(str)
}


function run (input) {
  const sequences = parseInput(input)

  // Part 1
  // {
  //   const total = sequences
  //   .map(({seq}) => hash(seq))
  //   .reduce((acc, v) => acc + v, 0)
  //   console.log('Part 1 :', total)
  // }


  // Part 2
  {
    const boxs = Array(256).fill(0).map(_ => [])
    for (const s of sequences) {
      // console.log(s)
      const index = s.boxNumber
      if (s.operation === OPERATION_ADD) {
        const indexFocal = boxs[index].findIndex(f => f.label === s.label)
        if (indexFocal === -1) {
          boxs[index].push({ label: s.label, focal: s.focal })
        } else {
          
          boxs[index][indexFocal].focal = s.focal
        }
      } else {
        boxs[index] = boxs[index].filter(f => f.label !== s.label)
      }
      // printBox(boxs)
      // console.log('=======================================================================')
    }

    let focusPower = 0
    for (let i = 0; i < boxs.length; i++) {
      for (let j = 0; j < boxs[i].length; j++) {
        focusPower += (i + 1) * (j + 1) * boxs[i][j].focal
      }
    }

    console.log('Part 2 :', focusPower)

  }


}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()