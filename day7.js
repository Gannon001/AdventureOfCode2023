import fs from 'node:fs/promises'
import path from 'node:path'

const inputExample = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`


function ConvertCardStrToInteger (cardsList) {
  let cards = cardsList
  cards = cards.replaceAll('A', 'E')
  cards = cards.replaceAll('K', 'D')
  cards = cards.replaceAll('Q', 'C')
  cards = cards.replaceAll('J', 'B')
  cards = cards.replaceAll('T', 'A')
  return cards.split('').map(c => parseInt(c, 16))
}

// 5        => 0x6_00000
// 4        => 0x5_00000
// 3 + 2    => 0x4_00000
// 3        => 0x3_00000
// 2 + 2    => 0x2_00000
// 2        => 0x1_00000
// 1        => 0x0_00000
function getCardScore (cards) {
  const countCards = cards.reduce((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})

  const groupCount = Object.values(countCards)
  let baseValue = 0x0
  // XXXXX
  if (groupCount.length === 1) {
    baseValue = 0x6
  } 
  // XXXX Y
  // XXX YY
  else if (groupCount.length === 2) {
    if (groupCount[0] === 4 || groupCount[1] === 4) {
      baseValue = 0x5
    } else {
      baseValue = 0x4
    }
  } 
  // XXX Y Z
  // XX YY Z
  else if (groupCount.length === 3) {
    if (groupCount[0] === 3 || groupCount[1] === 3 || groupCount[2] === 3) {
      baseValue = 0x3
    } else {
      baseValue = 0x2
    }
  } 
  // XX Y Z A
  else if (groupCount.length === 4){
    baseValue = 0x1
  }
  // X Y Z A B => 0

  return (baseValue << 20)
    | (cards[0] << 16)
    | (cards[1] << 12)
    | (cards[2] << 8)
    | (cards[3] << 4)
    | (cards[4] << 0)

}

function parseInput (str) {
  let [cards, enchere] = str.split(' ')
  const cardsStr = cards
  cards = cards.replaceAll('A', 'E')
  cards = cards.replaceAll('K', 'D')
  cards = cards.replaceAll('Q', 'C')
  cards = cards.replaceAll('J', 'B')
  cards = cards.replaceAll('T', 'A')
  cards = cards.split('').map(c => parseInt(c, 16))

  const value = getCardScore(cards)

  enchere = parseInt(enchere, 10)
  return {
    cards,
    value,
    enchere
  }
}

function getCardScoreJoker (cards) {
  const countCards = cards.reduce((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})

  const nbJoker = countCards[0xF]
  delete countCards[0xF]


  let jokerValue = 0x0 // indéfini
  

  // Nombre de carte différente
  const groupCount = Object.values(countCards).length


  // Poid fort du score de la main
  let baseValue = 0x00


  // XXXXX = groupCount = 1
  // JJJJJ = groupCount = 0
  if (groupCount === 0 || groupCount === 1) {
    baseValue = 6
    if (groupCount === 0) {
      jokerValue = 0xE
    } else {
      jokerValue = Object.keys(countCards)[0]
    }
  } 

  // Si on a 2 valeur différente hors Joker
  // XXXX Y
  // XXX YY
  // 5 6 JJJJ
  else if (groupCount === 2) {
    baseValue = 4
    for (const [cardValue, count] of Object.entries(countCards)) {
      if (count === 4 - nbJoker) {
        baseValue = 5
        jokerValue = Math.max(jokerValue, cardValue)
      }
    }
  } 
  // XXX Y Z
  // XX YY Z
  // X Y Z JJ
  else if (groupCount === 3) {
    baseValue = 2
    for (const [cardValue, count] of Object.entries(countCards)) {
      if (count === 3 - nbJoker) {
        baseValue = 3
        jokerValue = Math.max(jokerValue, cardValue)
      }
    }
  } 
  // XX Y Z A
  // X Y Z A [J]
  else if (groupCount === 4){
    baseValue = 1
    if (nbJoker) {
      for (const [cardValue, count] of Object.entries(countCards)) {
        jokerValue = Math.max(jokerValue, cardValue)
      }
    }
  }
  // X Y Z A B => 0
  

  // On replacer les Jockers par la valeur de la carte
  console.log({ jokerValue })
  if (jokerValue === 0) {
    jokerValue = 0xE // As
  }
  cards = cards.map(e => e === 0xF ? jokerValue : e)

  return (baseValue << 20)
     + (cards[0] << 16)
     + (cards[1] << 12)
     + (cards[2] << 8)
     + (cards[3] << 4)
     + (cards[4] << 0)

}

function parseInputJoker (str) {
  let [cards, enchere] = str.split(' ')
  enchere = parseInt(enchere, 10)

  cards = ConvertCardStrToInteger(cards)

  let value

  const countCards = cards.reduce((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, [])

  // Avec Joker
  if (countCards[0xB]) {
    let nbCard = 0
    let jokerValue = 0x0
    // On replace les Joker, par la carte la plus présente
    // Si égalité, on prend la plus grande
    for (let cardValue = 2; cardValue <= 0xE; cardValue++) {
      if (cardValue === 0xB || !countCards[cardValue]) {
        continue
      }
      const count = countCards[cardValue]
      if (count === nbCard) {
        jokerValue = Math.max(jokerValue, cardValue)
      } else if (count > nbCard) {
        jokerValue = cardValue
        nbCard = count
      }
    }
    // Cas JJJJJ => AAAAA
    jokerValue = jokerValue ? jokerValue : 0xE 

    const cardsJoker = cards.map(c => c === 0xB ? jokerValue : c)
    const cards2 = cards.map(c => c === 0xB ? 0 : c) // Change value Joker (0xB) => 0

    const msb = getCardScore(cardsJoker) & (0xF << 20)
    const rest = (cards2[0] << 16)
      | (cards2[1] << 12)
      | (cards2[2] << 8)
      | (cards2[3] << 4)
      | (cards2[4] << 0)

    value = msb | rest

  } else {
    // Sans Joker
    value = getCardScore(cards)
  }


  return {
    cards,
    value,
    enchere
  }
}

function run (input) {
  // Part 1
  // {
  //   const mains = input
  //   .replaceAll('\r', '')
  //   .split('\n')
  //   .map(parseInput)
    
  //   const mainsTrie = mains.sort((m1, m2) => m1.value - m2.value)
  
  //   console.log(mainsTrie)
  
  //   let total = 0
  //   for (let i = 0; i < mainsTrie.length; i ++) {
  //     total += mainsTrie[i].enchere * (i + 1)
  //   }
  //   console.log('Total :', total)
  // }
  // Part 2
  {
    const mains = input
    .replaceAll('\r', '')
    .split('\n')
    .map(parseInputJoker)
    
    const mainsTrie = mains.sort((m1, m2) => m1.value - m2.value)
  
    let total = 0
    for (let i = 0; i < mainsTrie.length; i ++) {
      total += mainsTrie[i].enchere * (i + 1)
    }
    console.log('Total :', total)
  }
}


(async () => {
  const inputFileName = path.basename(process.argv[1]).replace('.js', '.txt')
  const pathInput = path.join('.', 'inputs', inputFileName)
  const input = await fs.readFile(pathInput, 'utf-8')
  // run(inputExample)
  run(input)
})()