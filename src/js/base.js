import {Spinner} from 'spin.js';
import { alert } from '@pnotify/core';
import { LuminousGallery } from 'luminous-lightbox';


const inputRef = document.querySelector('input');
const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('#search-form');
const btnMoreRef = document.querySelector('.buttonMore');
const sppinerRef = document.querySelector('#foo');
const apiKey = '25089730-30cdb6513c5907c1471e4acc8';
let numberPage = 1;
let inputValue = '';
const urlBase = 'https://pixabay.com/api';
hidenBtnMore();
spinHiden();

function spinHiden() {
  sppinerRef.classList.add('hiden');
}

function spinVisible() {
  sppinerRef.classList.remove('hiden');
}

function showNotification(message) {
  alert({
    title: 'Ooops!',
    text:  message,
    delay: 2000,
  });
}


console.dir(inputRef);

async function handlerImgserch(event) {
  event.preventDefault();
  let isNewRequest = inputRef.value !== inputValue;
  if (isNewRequest) {
    clearList();
    inputValue = inputRef.value;
    const data = await getData(inputValue);
    const isNotDataOrEmpty =  !data && !data.hits
    if (isNotDataOrEmpty) {
      showNotification('no search result try again') 
      return;
    }
    renderGaleryList(data);
    new LuminousGallery(document.querySelectorAll(".photo-card"),galleryOpts,optionsGalleryItem);
  }
}

function clearList() {
  galleryRef.innerHTML = '';
  numberPage =1;
  hidenBtnMore();
}

function hidenBtnMore() {
  btnMoreRef.classList.add('hiden');
}

function visibleBtnMore() {
  btnMoreRef.classList.remove('hiden');
}

async function getData(inputValue) {
  spinVisible();
  let urlResult = `${urlBase}/?image_type=photo&orientation=horizontal&q=${inputValue}&page=${numberPage}&per_page=12&key=${apiKey}`;
  const result = await fetch(urlResult);
  const data = await result.json();
  console.log('DATA', data)
  if(!data.total){
    showNotification('bad search pls change') 
    spinHiden();
    return
  }
  numberPage += 1;
    visibleBtnMore()
    spinHiden();
  return data;
}

function renderGaleryList(data) {
  data.hits.forEach(element => {
    let template = `<a class="photo-card" href="${element.largeImageURL}">
        <img src="${element.webformatURL}" alt="${element.tags}" />
        
        <div class="stats">
          <p class="stats-item">
            <i class="material-icons">thumb_up</i>
            ${element.likes}
          </p>
          <p class="stats-item">
            <i class="material-icons">visibility</i>
            ${element.views}
          </p>
          <p class="stats-item">
            <i class="material-icons">comment</i>
            ${element.comments}
          </p>
          <p class="stats-item">
            <i class="material-icons">cloud_download</i>
            ${element.downloads}
          </p>
        </div>
        </a>`;
    galleryRef.insertAdjacentHTML('beforeend', `${template}`);
  });
}

async function handlerShowMore() {
    const data = await getData(inputValue);
  renderGaleryList(data);
  new LuminousGallery(document.querySelectorAll(".photo-card"),galleryOpts,optionsGalleryItem);
}
var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};
var target = document.getElementById('foo');
var spinner = new Spinner(opts).spin(target);



var galleryOpts = {
  // Whether pressing the arrow keys should move to the next/previous slide.
  arrowNavigation: true,
  // A callback triggered when the image changes that is passed the image HTML element 
};
var optionsGalleryItem = {
  // Prefix for generated element class names (e.g. `my-ns` will
  // result in classes such as `my-ns-lightbox`. Default `lum-`
  // prefixed classes will always be added as well.
  namespace: null,
  // Which attribute to pull the lightbox image source from.
  sourceAttribute: "href",
  // Captions can be a literal string, or a function that receives the Luminous instance's trigger element as an argument and returns a string. Supports HTML, so use caution when dealing with user input.
  caption: null,
  // The event to listen to on the _trigger_ element: triggers opening.
  openTrigger: "click",
  // The event to listen to on the _lightbox_ element: triggers closing.
  closeTrigger: "click",
  // Allow closing by pressing escape.
  closeWithEscape: true,
  // Automatically close when the page is scrolled.
  closeOnScroll: false,
  // Disable close button
  showCloseButton: true,
  // A node to append the lightbox element to.
  appendToNode: document.body,
  // A selector defining what to append the lightbox element to.
  // This will take precedence over `appendToNode`.
  appendToSelector: null,
  // If present (and a function), this will be called
  // whenever the lightbox is opened.
  onOpen: null,
  // If present (and a function), this will be called
  // whenever the lightbox is closed.
  onClose: null,
  // When true, adds the `imgix-fluid` class to the `img`
  // inside the lightbox. See https://github.com/imgix/imgix.js
  // for more information.
  includeImgixJSClass: false,
  // Add base styles to the page. See the "Theming"
  // section of README.md for more information.
  injectBaseStyles: true
};



btnMoreRef.addEventListener('click', handlerShowMore);
formRef.addEventListener('submit', handlerImgserch);
