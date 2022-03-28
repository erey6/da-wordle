import {wordsArray} from '/scripts/words.js';
import {dictionary} from '/scripts/dictionary.js';
const word = wordsArray[12].toUpperCase()

let currentRowNumber = 1
let currentRow = `row-${currentRowNumber}`
let currentGuess = ''


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

  const fillBox = letter => {
    currentGuess += letter
    for (let index = 0; index < currentGuess.length; index++) {
      $(`#${currentRow} .letter:nth-child(${index + 1})`).text(
        currentGuess[index]
      )
    }
  }

  const deleteLetter = () => {
    currentGuess = currentGuess.slice(0, -1)
    currentGuess += ' '
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
        console.log('not right')
        changeBGGray(currentGuess[i])
      }
    }
    currentGuess = ''
    currentRowNumber++
    checkCurrentRowNumber()
    currentRow = `row-${currentRowNumber}`
  }

  const checkCurrentRowNumber = () => {
    if (currentRowNumber > 6) {
      showFinishModal()
    }
  }

  const changeBGYellow = (letter, index) => {
    $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass('close-guess')
      $(`.key-letter:contains(${letter})`).addClass('close-guess')
  }

  const changeBGGreen = (letter, index) => {
    $(`#${currentRow} .letter:nth-child(${index + 1})`).addClass(
      'perfect-guess'
    )
    $(`.key-letter:contains(${letter})`).addClass('perfect-guess')
  }
  const changeBGGray = letter => {
    $(`.letter:contains(${letter})`).addClass('bad-letter')
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
      $('.finish-modal').css('display', 'block')
      $('#modal-message').html(
        '<h1>Sorry</h1><h3>You have run out of guesses</h3><p>The word was "Your mom"'
      )
    }
    const $modalClose = $('#close')
    $modalClose.on('click', (e) => {
        $('.finish-modal').css('display', 'none');
    })
  }

  
})
