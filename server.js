import express from 'express';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { loginPage } from './views/login.js';
import { invoicesPage } from './views/invoices.js';

const port = Number(process.env.PORT ?? 3000);
const secret = process.env.SESSION_SECRET ?? 'development-only-secret';
const users = JSON.parse(readFileSync(new URL('./data/users.json', import.meta.url), 'utf8'));
const invoices = JSON.parse(readFileSync(new URL('./data/invoices.json', import.meta.url), 'utf8'));

function sign(value) {
  return `${value}.${createHmac('sha256', secret).update(value).digest('hex')}`;
}

function unsign(cookie) {
  const index = cookie?.lastIndexOf('.') ?? -1;
  if (index < 0) return null;
  const value = cookie.slice(0, index);
  return sign(value) === cookie ? value : null;
}

function currentUser(request) {
  const cookie = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('session='))
    ?.slice('session='.length);
  const username = unsign(cookie ? decodeURIComponent(cookie) : null);
  return users.find((user) => user.username === username) ?? null;
}

function verify(user, password) {
  const hash = scryptSync(password, user.salt, 64);
  return timingSafeEqual(hash, Buffer.from(user.hash, 'hex'));
}

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(new URL('./public', import.meta.url).pathname));

app.get('/', (request, response) => {
  response.redirect(currentUser(request) ? '/invoices' : '/login');
});

app.get('/login', (request, response) => {
  response.send(loginPage());
});

app.post('/login', (request, response) => {
  const { username = '', password = '' } = request.body;
  const user = users.find((candidate) => candidate.username === username);

  if (!user || !verify(user, password)) {
    response.status(401).send(loginPage({ error: 'Wrong username or password', username }));
    return;
  }

  response.cookie('session', sign(user.username), { httpOnly: true, sameSite: 'lax' });
  response.redirect('/invoices');
});

app.post('/logout', (request, response) => {
  response.clearCookie('session');
  response.redirect('/login');
});

app.get('/invoices', (request, response) => {
  const user = currentUser(request);
  if (!user) {
    response.redirect('/login');
    return;
  }
  response.send(invoicesPage({ user, invoices }));
});

app.listen(port, () => {
  console.log(`Team invoices on http://localhost:${port}`);
});
