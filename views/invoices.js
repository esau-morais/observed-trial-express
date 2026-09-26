import { escape, layout } from './layout.js';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function invoicesPage({ user, invoices }) {
  const rows = invoices
    .map(
      (invoice) => `<tr>
        <td>${escape(invoice.number)}</td>
        <td>${escape(invoice.client)}</td>
        <td>${currency.format(invoice.amount)}</td>
        <td><span class="status status-${escape(invoice.status.toLowerCase())}">${escape(invoice.status)}</span></td>
      </tr>`,
    )
    .join('');

  return layout(
    'Invoices',
    `<header>
      <h1>Invoices</h1>
      <p>Signed in as ${escape(user.name)}</p>
      <form method="post" action="/logout"><button type="submit">Sign out</button></form>
    </header>
    <table>
      <thead><tr><th>Number</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`,
  );
}
