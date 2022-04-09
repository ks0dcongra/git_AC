// define sample function to randomly return an item in an array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}


function generatePassword(options) {

  // define dummy data
  // const options = {
  //   length: 12,
  //   // lowercase: 'on',
  //   // uppercase: 'on',
  //   numbers: 'on',
  //   excludeCharacters: '04'
  // }
  // console.log('options', options)

  // define things user might want
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const symbols = '`~!@$%^&*()-_+={}[]|;:"<>,.?/'
  // create a collection to store things user picked up
  let collection = []
  if (options.lowercase === 'on') {
    collection = collection.concat(lowerCaseLetters.split(''))
  }

  if (options.uppercase === 'on') {
    collection = collection.concat(upperCaseLetters.split(''))
  }

  if (options.numbers === 'on') {
    collection = collection.concat(numbers.split(''))
  }

  if (options.symbols === 'on') {
    collection = collection.concat(symbols.split(''))
  }

  // console.log('collection', collection)
  // remove things user do not need
  //原本是這樣：
  // if (options.excludeCharacters.includes(character) == true) {
  //   return false
  // } else {
  //   return true
  // }
  //之後簡化為：
  if (options.excludeCharacters) {
    collection = collection.filter(character => !options.excludeCharacters.includes(character))
  }

  if (collection.length === 0) {
    return 'There is no valid character in your selection.'
  }
  // start generating password
  let password = '';
  for (let i = 0; i < Number(options.length); i++) {
    password += sample(collection)

  }
  // console.log('sample(collection)', password)
  // return the generated password
  return password
}

// invoke generatePassword function
// generatePassword(options)

//export generatePassword function for other files to use
module.exports = generatePassword