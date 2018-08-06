import '../styles/main.scss'
import icons from '../images/icons.svg'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

function ready () {
  // alert('DOM готов')
  console.info('index.js - 10', icons)
  const svg = `
<img alt="ss" src="${icons}" width='200px' height='200px'>
`
  document.body.insertAdjacentHTML('afterBegin', svg)
  // alert('Размеры картинки: ' + img.offsetWidth + 'x' + img.offsetHeight);
}

document.addEventListener('DOMContentLoaded', ready)
