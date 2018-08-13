import '../styles/main.scss';
/* eslint-disable-next-line */
import lyrn from '../assets/images/lyrn.svg';

// Import all svg icons from assets/svg
const req = require.context('../assets/svg', true, /\.svg$/);
req.keys().forEach((key) => {
  req(key);
});

if (process.env.NODE_ENV === 'production') {
  /* eslint-disable-next-line */
  // require('../index.pug');
  console.log('production');
}

if (process.env.NODE_ENV === 'development') {
  console.log('development');
}

function ready() {
  console.info('index.js - 10');
  // debugger;
  // const svg = `<img alt="ss" src="${icons}" width='200px' height='200px'>`;
  // document.body.insertAdjacentHTML('afterBegin', svg);
}

document.addEventListener('DOMContentLoaded', ready);
