import { escape, layout } from './layout.js';

export function loginPage({ error, username = '' } = {}) {
  return layout(
    'Sign in',
    `<h1>Sign in</h1>
    ${error ? `<p class="error" role="alert">${escape(error)}</p>` : ''}
    <form method="post" action="/login">
      <label for="username">Username</label>
      <input id="username" name="username" autocomplete="username" value="${escape(username)}" required />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required />
      <button type="submit">Sign in</button>
    </form>`,
  );
}
