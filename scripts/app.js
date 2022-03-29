import { wordsArray } from '/scripts/words.js'
import { dictionary } from '/scripts/dictionary.js'
const randomNumber = Math.floor(Math.random() * wordsArray.length)
const word = wordsArray[randomNumber].toUpperCase()
const letterCount = {}
let currentRowNumber = 1
let currentRow = `row-${currentRowNumber}`
let currentGuess = ''
const setLetterCount = () => {
  const wordArray = word.split('')
  for (const letter of wordArray) {
    if (letter in letterCount) {
      letterCount[letter]++
    } else {
      letterCount[letter] = 1
    }
  }
}
setLetterCount()

$(() => {
  $('#enter').on('click', e => {
    checkWord()
  })

  $('#delete').on('click', e => {
    deleteLetter()
  })

  $('.key-letter').on('click', e => {
    fillBox(e.target.innerText)
  })

  $(document).on('keypress, keydown', e => {
    const character = String.fromCharCode(e.keyCode).toUpperCase()
    if (e.keyCode === 13) {
      checkWord()
      return
    }
    if (e.keyCode === 8) {
      deleteLetter()
      return
    }
    if (e.keyCode < 64 || e.keyCode > 90) {
      showMessage('Not a letter. Try again.')
    } else {
      fillBox(character)
    }
  })

  const fillBox = letter => {
    currentGuess += letter
    for (let index = 0; index < currentGuess.length; index++) {
      $(`#${currentRow} .letter:nth-child(${index + 1})`).text(
        currentGuess[index]
      ).addClass('dark-border')
    }
  }

  const deleteLetter = () => {
    currentGuess = currentGuess.slice(0, -1)
    currentGuess += ' '
    $(`#${currentRow} .letter:nth-child(${currentGuess.length})`).removeClass(
      'dark-border'
    )

    for (let index = 0; index < 5; index++) {
      $(`#${currentRow} .letter:nth-child(${index + 1})`).text(
        currentGuess[index]
      )
    }
    currentGuess = currentGuess.slice(0, -1)
  }

  const checkWord = () => {
    if (currentGuess.length < 5) {
      showMessage('Not enough letters')
      return
    }
    if (!dictionary.includes(currentGuess.toLowerCase())) {
      showMessage("That's not in my huge dictionary")
      return
    }
    if (currentGuess === word) {
      showMessage('Well done!')
      setTimeout(() => {
        showFinishModal('win')
      }, 4500)
    }
    let guessArray = currentGuess.split('')
    for (let i = 0; i < 5; i++) {
      if (word[i] === guessArray[i]) {
        changeBGGreen(guessArray[i], i)
      } else if (word.includes(guessArray[i])) {
        changeBGYellow(guessArray[i], i)
      } else {
        changeBGGray(currentGuess[i])
      }
    }
    currentGuess = ''
    currentRowNumber++
    setLetterCount()
    checkCurrentRowNumber()
    currentRow = `row-${currentRowNumber}`
  }

  const checkCurrentRowNumber = () => {
    if (currentRowNumber > 6) {
      showFinishModal()
    }
  }

  const changeBGYellow = (letter, index) => {
    if (letterCount[letter] === 0) {
      $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass('flipped bad-letter').removeClass('dark-border')
      return
    }
    $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass('flipped close-guess').removeClass('dark-border')
    $(`.key-letter:contains(${letter})`).addClass('close-guess')
    letterCount[letter]--
  }

  const changeBGGreen = (letter, index) => {
    if (letterCount[letter] === 0) {
      $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass('flipped bad-letter')
      return
    }
    $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass(
      'flipped perfect-guess'
    )

    $(`.key-letter:contains(${letter})`).addClass('perfect-guess')
    letterCount[letter]--
  }
  const changeBGGray = letter => {
    $(`.letter:contains(${letter})`).addClass('flipped bad-letter').removeClass('dark-border')
    $(`.key-letter:contains(${letter})`).addClass('bad-letter')
  }

  const showMessage = message => {
    $('#message').text(message)
    $('.message-area').addClass('message-background-black')
    setTimeout(() => {
      $('.message-area').removeClass('message-background-black')
      $('#message').text('')
    }, 4500)
  }

  const showFinishModal = result => {
    if (result === 'win') {
      $('.finish-modal').css('display', 'block')
      $('#modal-message').html(
        '<div id="close"><a href="#">Close</a></div><h1>Congratulations</h1><h3>Thanks for playing</h3>'
      )
    } else {
      $('#message').text(word)
      $('.message-area').addClass('message-bg-no-fade')
    }
    const $modalClose = $('#close')
    $modalClose.on('click', e => {
      $('.finish-modal').css('display', 'none')
    })
  }
})
