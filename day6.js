import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`Time:      7  15   30
Distance:  9  40  200`



function parseInput (str) {
  const lignes = str.replaceAll('\r', '').split('\n')
  const times  = lignes[0].substring('Time:'.length).trim().split(/\s+/).map(s => parseInt(s, 10))
  const distances  = lignes[1].substring('Distance:'.length).trim().split(/\s+/).map(s => parseInt(s, 10))

  return times.map((t, i) => ({
    time: t,
    dist: distances[i]
  }))
}


function run (input) {
  // const races = parseInput(input)
  
  // let allWinConditions = []
  // for (const race of races) {
  //   const funcTime = function (tempsAppuiye) { return (race.time - tempsAppuiye) * tempsAppuiye}
  //   let winCondition = 0
  //   for (let i = 1; i < race.time; i++) {
  //     if (funcTime(i) > race.dist) {
  //       winCondition += 1
  //     }
  //   }
  //   allWinConditions.push(winCondition)
  // }

  // console.log(allWinConditions)
  // const totalMul = allWinConditions.reduce((acc, v) => acc * v, 1)
  // console.log(totalMul)

  const races = parseInput(input.replace(/ /g, ''))
  const {time: T, dist: D} = races[0]
  // Function = (T - X) * X = D
  // => TX - X^2 - D = 0
  // => -1 * X^2 + T * x - D = 0
  // => A = -1 , B = T, C = -D
  // => Delta = B*B - 4 * A * C
  // => T*T - 4 * -1 * -D

  const A = -1
  const B = T
  const C = -D

  const delta = T*T - 4 * -1 * -D
  if (delta > 0) {
    const sqrtDelta = Math.sqrt(delta)
    const s1 = (-B + sqrtDelta) / (2 * A)
    const s2 = (-B - sqrtDelta) / (2 * A)
   
    
    const min = Math.ceil(s1)
    const max = Math.ceil(s2)
    // console.log({min, max, nb: max - min})
    const result = max - min
    console.log('Resultat : ', result)

  }
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()