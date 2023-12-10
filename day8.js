import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

function parseInput (str) {
  const lines = str.replaceAll('\r', '').split('\n')
  const direction = lines[0].split('')

  const graphElement = {}
  for (let i = 2; i < lines.length; i++) {
    const l = lines[i]
    const label = l.substr(0, 3)
    const left = l.substr(7, 3)
    const right = l.substr(12, 3)
    graphElement[label] = {label, left, right}
  }

  for (const k of Object.keys(graphElement)) {
    graphElement[k].L = graphElement[graphElement[k].left]
    graphElement[k].R = graphElement[graphElement[k].right]
  }

  const graph = graphElement['AAA']

  return {
    direction,
    graph,
    graphElement
  }
}

function run (input) {

  // console.log({direction, graph})

  // Part 1
  // {
  //   const {direction, graph} = parseInput(input)
  //   let i = 0
  //   let steps = 0
  //   let currentGraph = graph
  //   while (currentGraph.label !== 'ZZZ') {
  //     const kDirect = direction[i]
  //     i = (i + 1) % direction.length
  //     currentGraph = currentGraph[kDirect]
  //     steps += 1
  //   }
  //   console.log(steps)
  // }

  // Part 2
  {
    const {direction, graph, graphElement} = parseInput(input)

    let currentGraphs = Object.values(graphElement)
      .filter(g => g.label.endsWith('A'))

    let steps = []
    for (const _currentGraph of currentGraphs) {
      let i = 0
      let step = 0
      let currentGraph = _currentGraph
      while (!currentGraph.label.endsWith('Z')) {
        const kDirect = direction[i]
        i = (i + 1) % direction.length
        currentGraph = currentGraph[kDirect]
        step += 1
      }
      steps.push(step)
    }

    const isSame = function (arr) {
      let val = arr[0]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== val) {
          return false
        }
      }
      return true
    }
 
    // steps = [19631, 13771, 21389, 17287, 23147, 20803]
    const currentSteps = [...steps]
    console.log(currentSteps)

    while (!isSame(currentSteps)) {
      const min = Math.min(...currentSteps)
      const minIndex = currentSteps.indexOf(min)
      currentSteps[minIndex] += steps[minIndex]
    }
    
    console.log('Finaly ... ', currentSteps)
    // 22289513667691

  }

  // [ 19631, 13771, 21389, 17287, 23147, 20803 ]


}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(input)
})()