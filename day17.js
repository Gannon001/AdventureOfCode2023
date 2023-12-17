import fs from 'node:fs/promises'
import path from 'node:path'

const OPERATION_REMOVE = 0
const OPERATION_ADD = 1
const e1 =
`11
11
19
19
11
11
11`
// `1111111
// 1199111`


const inputExample = 
// // `111111111111
// // 999999999991
// // 999999999991
// // 999999999991
// // 999999999991`
`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`


function parseInput(input) {
  return input.replaceAll('\r', '')
    .split('\n')
    .map(l => l.split('').map(v => parseInt(v, 10)))
}

const Nord  = 0
const Est   = 1
const Sud   = 2
const Ouest = 3

const MaxLigneDroite = 3

const AllDirection = [Nord, Est, Sud, Ouest]
const DirectionIndex = [
  // Nord
  { y: -1, x:  0 },
  { y:  0, x: +1 },
  { y: +1, x:  0 },
  { y:  0, x: -1 },
]

function buildModelRoute () {
  let graphPossibility = [
    { Direction: Nord   , Ligne: 1, y: -1, x:  0  },
    { Direction: Est    , Ligne: 1, y:  0, x:  1  },
    { Direction: Sud    , Ligne: 1, y:  1, x:  0  },
    { Direction: Ouest  , Ligne: 1, y:  0, x:  -1 },
  ]

  // for (let i = 1; i < MaxLigneDroite; i++) {
  //   graphPossibility = graphPossibility.map(oldPossibility => {
  //     return AllDirection.map(newDirection => ({
  //       Direction: newDirection,
  //       From: newDirection,
  //       Ligne: oldPossibility.From === newDirection ? oldPossibility.Ligne + 1 : 1,
  //       y: oldPossibility.y + DirectionIndex[newDirection].y,
  //       x: oldPossibility.x + DirectionIndex[newDirection].x
  //     }))
  //   }).flat()
  // }
  // console.log(graphPossibility)
  return graphPossibility
}

function buildGraph (regions) {

  const emptyNextCity = () => [null, null, null, null]

  // Item de depart
  const start = {
    Direction: Est, // Impossible d'arrive sur cette ville en marchant vers l'Est en 0,0
    Ligne: 0,
    x: 0,
    y: 0,
    chaleur: 0,
    nextCity: [
      null,
      null,
      null,
      null,
    ]
  }

  const destinationChoix = buildModelRoute()
  const graphItem = new Map()
  const graphAllItem = new Map()

  graphItem.set('0_0', start)

  let graphStep = [start]

  let i = 0
  let currentDistationCost = Infinity
  while (graphStep.length !== 0) {
    i++
    const cityFrom = graphStep.shift()
    if (cityFrom.chaleur > currentDistationCost) {
      console.log(cityFrom, graphStep)
      break
    }
    

    for (const dc of destinationChoix) {
      if (
        (cityFrom.Direction === Nord && dc.Direction === Sud)
        || (cityFrom.Direction === Sud && dc.Direction === Nord)
        || (cityFrom.Direction === Est && dc.Direction === Ouest)
        || (cityFrom.Direction === Ouest && dc.Direction === Est)
      ) { continue }

      const newLigne = cityFrom.Direction === dc.Direction ? cityFrom.Ligne + 1 : 1
      if (newLigne > 3) {
        continue
      }
      const newX = cityFrom.x + dc.x
      const newY = cityFrom.y + dc.y
      if (newY < 0 || newY >= regions.length || newX < 0 || newX >= regions[newY].length) {
        continue
      }

      const newChaleur = cityFrom.chaleur + regions[newY][newX]
      
      // Direction
      const newGraphKey = newX + '_' + newY + '_' + dc.Direction + '_' + newLigne

      const newCityGraph = {
        Direction: dc.Direction,
        Ligne: newLigne,
        x: newX,
        y: newY,
        chaleur: newChaleur,
        nextCity: emptyNextCity(),
      }
      
      // if (newX === 13 && newY === 1) {
      //   console.log('DEBUG 0 0', graphItem.has(newGraphKey), newCityGraph.chaleur)
        
      // }

      if (graphItem.has(newGraphKey)) {

        const prevCityGraph = graphItem.get(newGraphKey)
        
        if (prevCityGraph.chaleur > newCityGraph.chaleur) {
          // 
          graphStep.push(newCityGraph)
          cityFrom.nextCity[dc.Direction] = newCityGraph
          graphItem.set(newGraphKey, newCityGraph)
        }
      } else {
        graphStep.push(newCityGraph)
        cityFrom.nextCity[dc.Direction] = newCityGraph
        graphItem.set(newGraphKey, newCityGraph)
      }

      if (newX === regions[0].length  - 1 && newY === regions.length - 1) {
        console.log('SET', newChaleur)
        currentDistationCost = newChaleur
      }
      
      graphStep = graphStep.sort((t1, t2) => t1.chaleur - t2.chaleur)
      // console.log(graphStep.map(g => g.chaleur))
      
      
    }
    
  }
  console.log('Iteration :', i)
  return {
    graphStart: start,
    graphItem,
  }

}

function printDebug (regions, graphItem) {
  const newRegion = JSON.parse(JSON.stringify(regions))
    .map(l => l.map(_ => Infinity))
  console.log('graphItem.values()', graphItem.size)
  let i = 0
  for (const city of graphItem.values()) {
    newRegion[city.y][city.x] = Math.min(city.chaleur, newRegion[city.y][city.x])
    i++
  }

  console.log(newRegion.map(l => l.map(c => c === Infinity ? '____' : c.toString().padStart(4)).join('|')).join('\n'))
}

function buildModelRoute__2 () {
  let graphPossibility = [
    { Direction: Nord   , Ligne: 1, y: -1, x:  0  },
    { Direction: Est    , Ligne: 1, y:  0, x:  1  },
    { Direction: Sud    , Ligne: 1, y:  1, x:  0  },
    { Direction: Ouest  , Ligne: 1, y:  0, x:  -1 },
  ]
  return graphPossibility
}
function buildGraph__2 (regions) {

  const emptyNextCity = () => [null, null, null, null]

  // Item de depart
  const start = {
    Direction: -1 , // Impossible d'arrive sur cette ville en marchant vers l'Est en 0,0
    Ligne: 0,
    x: 0,
    y: 0,
    chaleur: 0,
    nextCity: [
      null,
      null,
      null,
      null,
    ]
  }

  const destinationChoix = buildModelRoute__2()
  const graphItem = new Map()
  const graphAllItem = new Map()

  graphItem.set('0_0', start)

  let graphStep = [start]

  let i = 0
  let currentDistationCost = Infinity
  while (graphStep.length !== 0) {
    i++
    const cityFrom = graphStep.shift()
    // Si toutes les routes sont suppérieur au coup actuelle vers la destination, on stop !
    if (cityFrom.chaleur > currentDistationCost) {
      // console.log(cityFrom, graphStep)
      break
    }
    
    if (i%1000 === 0) {
      console.log({ i, currentDistationCost, graphMin: cityFrom.chaleur  })
    }

    for (let dist = 4; dist <= 10; dist++) {
      for (const dc of destinationChoix) {

        if ( cityFrom.Direction === dc.Direction
          || (cityFrom.Direction === Nord && dc.Direction === Sud)
          || (cityFrom.Direction === Sud && dc.Direction === Nord)
          || (cityFrom.Direction === Est && dc.Direction === Ouest)
          || (cityFrom.Direction === Ouest && dc.Direction === Est)
        ) { continue }
  
        // const newLigne = cityFrom.Direction === dc.Direction ? cityFrom.Ligne + 1 : 1
        // if (newLigne > 3) {
        //   continue
        // }

        // Check limits
        const newX = cityFrom.x + (dc.x * dist)
        const newY = cityFrom.y + (dc.y * dist)
        if (newY < 0 || newY >= regions.length || newX < 0 || newX >= regions[newY].length) {
          continue
        }
  
        let newChaleur = cityFrom.chaleur 
        // console.log('Direction => ', dc.Direction, 'Dist => ', dist, cityFrom, dc)
        for (let i = 1; i <= dist; i++) {
          newChaleur += regions[cityFrom.y + (i * dc.y)][cityFrom.x + (i * dc.x)]
        }
        // if (newX === 8 && newY === 0) {
        //   process.exit(1)
        // }
        
        // Direction
        const newGraphKey = newX + '_' + newY + '_' + dc.Direction
  
        const newCityGraph = {
          Direction: dc.Direction,
          // Ligne: newLigne,
          x: newX,
          y: newY,
          chaleur: newChaleur,
          nextCity: emptyNextCity(),
        }
        
        // if (newX === 13 && newY === 1) {
        //   console.log('DEBUG 0 0', graphItem.has(newGraphKey), newCityGraph.chaleur)
          
        // }
  
        if (graphItem.has(newGraphKey)) {
  
          const prevCityGraph = graphItem.get(newGraphKey)
          
          if (prevCityGraph.chaleur > newCityGraph.chaleur) {
            // 
            graphStep.push(newCityGraph)
            cityFrom.nextCity[dc.Direction] = newCityGraph
            graphItem.set(newGraphKey, newCityGraph)
          }
        } else {
          graphStep.push(newCityGraph)
          cityFrom.nextCity[dc.Direction] = newCityGraph
          graphItem.set(newGraphKey, newCityGraph)
        }
  
        if (newX === regions[0].length  - 1 && newY === regions.length - 1) {
          console.log('SET', newChaleur)
          currentDistationCost = newChaleur
        }
        
        graphStep = graphStep.sort((t1, t2) => t1.chaleur - t2.chaleur)
        // console.log(graphStep.map(g => g.chaleur))
        
        
      }
    }


    
  }
  console.log('Iteration :', i)
  return {
    graphStart: start,
    graphItem,
  }

}

function run (input) {

  // Part 1
  const regions = parseInput(input)
   {
    const { graphItem } = buildGraph(regions)
    printDebug (regions, graphItem)
   }
  // {
  //     const { graphItem } = buildGraph__2(regions)
  //     printDebug (regions, graphItem)
  //     console.log()
  //   }
  // buildModelRoute()
  // console.log(cityGraph)
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  // run(e1)
  console.time('Run')
  run(input)
  console.timeEnd('Run')
})()