import { requestItems, type Item } from './items';

export const title = 'Request lab';

export async function loadItems(): Promise<readonly Item[]> {
  const items = await requestItems();

  setTimeout(() => {
    throw new Error('Item count was not recorded');
  });

  return items;
}
