const requestCount = 1;
const resultText = 'Items loaded';
const button = document.querySelector('button');
const result = document.querySelector('#result');

if (button === null || result === null) {
  throw new Error('Missing fixture elements');
}

button.addEventListener('click', () => {
  Promise.all(Array.from({ length: requestCount }, () => fetch('/api/items')))
    .then(() => {
      result.textContent = resultText;
      result.setAttribute('data-saved', 'false');
      document.body.dataset.done = 'true';
    })
    .catch((error: unknown) => console.error(error));
});

export {};
