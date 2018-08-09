import '../assets/styles/main.scss';
/* eslint-disable-next-line */
import lyrn from '../assets/images/lyrn.svg';

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable-next-line */
  require('../index.pug');
}

function ready() {
  console.info('index.js - 10');
  // debugger;
  // const svg = `<img alt="ss" src="${icons}" width='200px' height='200px'>`;
  // document.body.insertAdjacentHTML('afterBegin', svg);
}

document.addEventListener('DOMContentLoaded', ready);
