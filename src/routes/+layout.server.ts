import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  return {
    siteTitle: 'Revolution Trading Pros',
    siteUrl: 'https://revolutiontradingpros.com'
  };
};
