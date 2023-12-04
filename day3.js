import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

function parseInput (str) {
  return str.split('')
}

function isNumber (c) {
  return c >= '0' && c <= '9'
}
function isSymbol (c) {
  return c && c !== '.' && !isNumber(c)
}
function isSymbolGear (c) {
  return c === '*'
}

function hasSymbol (y, startX, endX, schematic) {
  // Check sur la meme ligne au extrémité 
  if (isSymbol(schematic[y][startX - 1]) || isSymbol(schematic[y][endX + 1])) {
    return true
  }
  // Ligne au dessus & en dessous
  const lY = [y-1, y+1]
  const xMin = startX - 1
  const xMax = endX + 1
  for (const _y of lY) {
    for (let _x = xMin; _x <= xMax; _x+= 1) {
      const c = schematic[_y]?.[_x]
      if (c && isSymbol(c)) {
        return true
      }
    }
  }
  return false
}

function getGearPos(y, startX, endX, schematic) {
  if (isSymbolGear(schematic[y][endX + 1])) {
    return [y, endX +1]
  }
  if (isSymbolGear(schematic[y][startX - 1]) ) {
    return [y, startX - 1]
  }
  // Ligne au dessus & en dessous
  const lY = [y-1, y+1]
  const xMin = startX - 1
  const xMax = endX + 1
  for (const _y of lY) {
    for (let _x = xMin; _x <= xMax; _x+= 1) {
      const c = schematic[_y]?.[_x]
      if (c && isSymbolGear(c)) {
        return [_y, _x]
      }
    }
  }
  return null
}

function run (input) {
  const schematic = input
  .replaceAll('\r', '')
  .split('\n')
  .map(parseInput)

  // let startX, endX, curVal
  // let x = 0
  // let y = 0
  // let total = 0
  // while (y < schematic.length) {
  //   x = 0
  //   startX = undefined
  //   endX = undefined
  //   curVal = 0
  //   while (x < schematic[y].length) {
  //     const c =  schematic[y][x]
  //     const isNum = isNumber(c)
  //     if (isNum) {
  //       const val = c - '0'
  //       if (curVal === 0) {
  //         startX = x
  //         endX = x
  //         curVal = val
  //       } else {
  //         curVal = (curVal * 10) + val
  //         endX = x
  //       }
  //     } else {
  //       if (curVal !== 0) {
  //         console.log('Ha', curVal)
  //         if (hasSymbol(y, startX, endX, schematic)) {
  //           total += curVal
  //         }
  //       }
  //       startX = undefined
  //       endX = undefined
  //       curVal = 0
  //     }
  //     x++
  //   }
  //   if (curVal !== 0) {
  //     if (hasSymbol(y, startX, endX, schematic)) {
  //       total += curVal
  //     }
  //   }


  //   y++
  // }
  // console.log('Total :', total)

  const gears = {}
  const toIndexMap = (x, y) => `${x}_${y}`


  let startX, endX, curVal
  let x = 0
  let y = 0
  while (y < schematic.length) {
    x = 0
    startX = undefined
    endX = undefined
    curVal = 0
    while (x < schematic[y].length) {
      const c =  schematic[y][x]
      const isNum = isNumber(c)
      if (isNum) {
        const val = c - '0'
        if (curVal === 0) {
          startX = x
          endX = x
          curVal = val
        } else {
          curVal = (curVal * 10) + val
          endX = x
        }
      } else {
        if (curVal !== 0) {
          const gearPos = getGearPos(y, startX, endX, schematic)
          if (gearPos) {
            const id = toIndexMap(...gearPos)
            if (!gears[id]) {
              gears[id] = [curVal]
            } else {
              gears[id].push(curVal)
            }
          }
        }
        startX = undefined
        endX = undefined
        curVal = 0
      }
      x++
    }
    if (curVal !== 0) {
      const gearPos = getGearPos(y, startX, endX, schematic)
      if (gearPos) {
        const id = toIndexMap(...gearPos)
        if (!gears[id]) {
          gears[id] = [curVal]
        } else {
          gears[id].push(curVal)
        }
      }
    }


    y++
  }

  // Somme des gears
  let total = 0
  for (const valGears of Object.values(gears)) {
    if (valGears.length === 2) {
      total += (valGears[0] * valGears[1])
    }
  }

  console.log('Total :', total)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()