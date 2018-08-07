import '../styles/main.scss';
// import icons from '../images/icons.svg';

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug');
}

function ready() {
  // console.info('index.js - 10', icons);
  // const svg = `<img alt="ss" src="${icons}" width='200px' height='200px'>`;
  // document.body.insertAdjacentHTML('afterBegin', svg);
}

document.addEventListener('DOMContentLoaded', ready);
