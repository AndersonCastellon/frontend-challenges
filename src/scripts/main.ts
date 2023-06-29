import Swiper from 'swiper'

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.form__swiper', {
    loop: false,
    autoHeight: true,
    centeredSlides: true,
    direction: 'horizontal'
  })
})
