import { group } from 'node:console'
import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`.# 1`
let debugCount = 0
function isValidSchema (schema, groups) {
  // console.log('TESTE : ' + schema, groups)
  let result = true
  const schemagroups = schema
    .split(/\.+/)
    .filter(s => {
      return s !== ''
    })
    .map(s => s.length)
  if (schemagroups.length !== groups.length) {
    result = false
  } else {
    for (let i = 0; i < schemagroups.length; i++) {
      if (schemagroups[i] !== groups[i]) {
        result = false
        break
      }
    }
  }
  // console.log('isValidSchema', schema, groups, schemagroups, result)
  return result
}

function parseInput(str) {
  return str.split('\n').map(l => l.split(''))
}

function replaceAt(str, index, char) {
  const arr = [...str]
  arr[index] = char
  return arr.join('')
}

function checkSchema (str, groups, resteMark) {
  const nextIndex = str.indexOf('?')

  if (resteMark === 0 && nextIndex === -1) {
    return isValidSchema(str, groups) ? 1 : 0
  }

  if (nextIndex === -1) {
    return 0
  }

  return checkSchema(replaceAt(str, nextIndex, '#'), groups, resteMark - 1)
    + checkSchema(replaceAt(str, nextIndex, '.'), groups, resteMark)

}

function run (input) {
  // const test = input
  //   .split('\n')
  //   .map(l => {
  //     const [schema, groupstr] = l.split(' ')
  //     const groups = groupstr.split(',').map(s => parseInt(s, 10))
  //     return [schema, groups]
  //   })

  // let sum = 0
  // test.forEach(([schema, groups]) => {

  //   const nbMark = schema.split('').filter(c => c === '#').length
  //   const totalMarkNeed = groups.reduce((acc, v) => acc + v, 0)

  //   const nbArrangements = checkSchema(schema, groups, totalMarkNeed - nbMark)
  //   console.log(schema, groups, nbArrangements)
  //   sum += nbArrangements
  //   // console.log(isValidSchema(schema, groups))
  // })
  // console.log('SUM :', sum)

  const test = input
    .split('\n')
    .map(l => {
      const [schema, groupstr] = l.split(' ')
      const groups = groupstr.split(',').map(s => parseInt(s, 10))
      return [schema, groups]
    })
    .map(([schema, group]) => {
      return [
        Array(5).fill(schema).join('?'),
        [...group, ...group, ...group, ...group, ...group]
      ]
    })

  let sum = 0
  test.forEach(([schema, groups]) => {

    const nbMark = schema.split('').filter(c => c === '#').length
    const totalMarkNeed = groups.reduce((acc, v) => acc + v, 0)

    const nbArrangements = checkSchema(schema, groups, totalMarkNeed - nbMark)
    console.log(schema, groups, nbArrangements)
    sum += nbArrangements
    // console.log(isValidSchema(schema, groups))
  })
  console.log('SUM :', sum)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()