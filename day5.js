import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = 
`seeds: 100 100

seed-to-soil map:
50 666 100

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

class CartoMap {
  
  Seeds = [];
  SeedToSoil = [];
  SoilToFertilizer = [];
  FertilizerToWater = [];
  WaterToLight = [];
  LightToTemperature = [];
  TemperatureToHumidity = [];
  HumidityToLocation = [];

  orderMapKey = [
    'SeedToSoil',
    'SoilToFertilizer',
    'FertilizerToWater',
    'WaterToLight',
    'LightToTemperature',
    'TemperatureToHumidity',
    'HumidityToLocation',
  ]

  constructor (input) {
    this.parseInput(input)
  }

  parseInput (input) {
    const lines = input.replaceAll('\r', '').split('\n')
    this.Seeds = lines[0]
      .substring(7) // 'seeds: '.length
      .split(' ')
      .map(s => parseInt(s, 10))
    
    let i = 1
    let currentKeyMap = -1
    while (i < lines.length) {
      const line = lines[i]
      if (line === '') {
        currentKeyMap += 1
        i += 1
      } else {
        const key = this.orderMapKey[currentKeyMap]
        const [rangeStart, sourceRange, rangeLength] = line.split(' ').map(s => parseInt(s, 10))
        this[key].push({
          rangeStart, sourceRange, rangeLength
        })
      }
      i += 1
    }

  }

  inRange (seed, mapEntry) {
    const s = mapEntry.sourceRange
    const e = s + mapEntry.rangeLength
    return seed >= s && seed <= e
  }

  convert (seed, mapUse) {
    for (const entry of mapUse) {
      if (this.inRange(seed, entry)) {
        return seed - entry.sourceRange + entry.rangeStart
      }
    }
    return seed
  }

  SeedTolocation (seed) {
    let _seed = seed
    for (const mapKey of this.orderMapKey) {
      _seed = this.convert(_seed, this[mapKey])
    }
    return _seed
  }



}

class CartoMapRange extends CartoMap {

  SeedRange = [];

  constructor (input) {
    super(input)
    this.parseInputRange()
  }
  parseInputRange () {
    this.SeedRange = []
    for (let i = 0; i < this.Seeds.length; i += 2) {
      this.SeedRange.push({
        rangeStart: this.Seeds[i],
        rangeLength: this.Seeds[i + 1],
        rangeEnd: this.Seeds[i] + this.Seeds[i + 1]
      })
    }
  }

  getMapConvert (start, end, mapConvert) {

  }

  getLowerLocation () {
    // Trie des map de convertions
    for (const key of this.orderMapKey) {
      this[key] = this[key]
        .sort((r1, r2) => r1.rangeStart - r2.rangeStart)
        .map(r => ({
          ...r,
          rangeEnd: r.rangeStart + r.rangeLength
        }))
    }
   
    // Trie des seeds
    this.SeedRange = this.SeedRange
      .sort((r1, r2) => r1.rangeStart - r2.rangeStart)


    const currentItemConvert = [...this.SeedRange]
    const nextItemConvert = []
    const currentMapConvert = [...this.SeedToSoil]

    let continu = 3
    let ii = 0
    let mi = 0
    const rangesSplit = []

    
    const maxValueIn = currentItemConvert[currentItemConvert.length -1].rangeEnd
    let iItemIn = 0
    let iMapOut = 0
    let currentValue = -Infinity
    let inRange = false

    let iii = 5
    while (currentValue <= maxValueIn) {
      const currentRange = currentItemConvert[iItemIn]
      const currentMap = currentMapConvert[iMapOut]


      const nextStepIn =  currentValue < currentRange.rangeStart ? currentRange.rangeStart : currentRange.rangeEnd
      const nextStepOut = currentValue < currentMap.rangeStart ? currentMap.rangeStart : currentMap.rangeEnd

      console.log('\n\n')
      console.log({
        currentValue,
        inRange,
        nextStepIn,
        nextStepOut,
      })

      if (inRange) {
        rangesSplit.push({
          rangeStart: currentValue,
          rangeEnd: Math.min(nextStepIn, nextStepOut)
        })
      }

      if (nextStepIn <= nextStepOut) {
        currentValue = nextStepIn
        inRange = true
      } else {
        currentValue = nextStepOut
        inRange = false
      }

      if (currentValue > currentRange.rangeEnd) {
        iItemIn ++
      }
      if (currentValue > currentMap.rangeEnd) {
        iMapOut ++
      }


      console.log({
        nextCurrentValue: currentValue,
      })

      // currentValue = Infinity
      if (iii-- === 0) {
        console.log('FORCE BREAK')
        break
      }
    }
    console.log(rangesSplit)
    console.log('END')
    // const range = this.SeedRange[1]

    // console.log('SeedToSoil' ,this.SeedToSoil.map(r => r))
    // console.log('Seed' , this.SeedRange)


  }
}

function getScore({cardId, numeroGagnants, mesNumeros}) {
  let nbNumero = getNbNumGagant({cardId, numeroGagnants, mesNumeros})
  return nbNumero ? Math.pow(2, nbNumero - 1) : 0
}

function run (input) {
  // const cartoMap = new CartoMap(input)
  // const allLocation = cartoMap.Seeds.map(s => cartoMap.SeedTolocation(s))
  // const minLocation = Math.min(...allLocation)
  // console.log(minLocation)

  const cartoMap2 = new CartoMapRange(input)
  let minLocation2 = cartoMap2.getLowerLocation()
  console.log(minLocation2)

}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  run(inputExample)
})()