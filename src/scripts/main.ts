import Swiper from 'swiper'
let formSwiper: Swiper

/**
 * The function `setActiveStep` takes a step number as input and adds the class 'step--active' to the
 * HTML element with the corresponding data-step-number attribute, while removing the class from all
 * other elements.
 * @param {number} step - The `step` parameter is a number that represents the step number you want to
 * set as active.
 */
function setActiveStep (step: number) {
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll('[data-step-number]')
  )
  elements.forEach(element => {
    const stepNumber = element.dataset.stepNumber

    if (stepNumber && +stepNumber === step) {
      element.classList.add('step--active')
    } else {
      element.classList.remove('step--active')
    }
  })
}

/**
 * The function sets the visibility and disabled state of previous, next, and submit buttons based on
 * the current state of a form swiper.
 */
function setButtonStates () {
  if (formSwiper) {
    const isBeginning = formSwiper.isBeginning
    const isEnd = formSwiper.isEnd

    const prevButton = document.querySelector('[data-button-type="prev"]')
    const nextButton = document.querySelector('[data-button-type="next"]')
    const submitButton = document.querySelector('[data-button-type="submit"]')

    if (prevButton) {
      if (isBeginning) {
        prevButton.setAttribute('style', 'visibility: hidden')
        prevButton.setAttribute('disabled', 'true')
      } else {
        prevButton.removeAttribute('style')
        prevButton.removeAttribute('disabled')
      }
    }

    if (nextButton && submitButton) {
      if (isEnd) {
        nextButton.setAttribute('style', 'display: none')
        submitButton.removeAttribute('style')
      } else {
        submitButton.setAttribute('style', 'display: none')
        nextButton.removeAttribute('style')
      }
    }
  }
}

/**
 * The function slideNext() is used to slide to the next item in a swiper component.
 */
function slideNext () {
  if (formSwiper) {
    formSwiper.slideNext()
  }
}

/**
 * The function `slidePrev` is used to slide to the previous slide in a swiper instance called
 * `formSwiper`.
 */
function slidePrev () {
  if (formSwiper) {
    formSwiper.slidePrev()
  }
}

function submit (button: HTMLInputElement) {
  console.log(button.form)
}

/**
 * The function adds event listeners to buttons with specific data attributes and performs different
 * actions based on the button type.
 */
function addEventListeners () {
  const buttons: HTMLElement[] = Array.from(
    document.querySelectorAll('[data-button-type]')
  )
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      const type = button.dataset.buttonType
      switch (type) {
        case 'prev':
          slidePrev()
          break
        case 'next':
          slideNext()
          break
        case 'submit':
          e.preventDefault()
          submit(button as any)
          break
      }

      setButtonStates()
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  formSwiper = new Swiper('.form__swiper', {
    loop: false,
    autoHeight: true,
    centeredSlides: true,
    direction: 'horizontal',
    observer: true,
    mousewheel: false
  })

  formSwiper.on('activeIndexChange', swiper => {
    setActiveStep(swiper.activeIndex + 1)
    setButtonStates()
  })

  addEventListeners()
  setButtonStates()
})
