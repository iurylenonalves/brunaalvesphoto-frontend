export const PAYMENT_CONFIG = {
  // The fixed price ID for the £50 deposit (created in Stripe Dashboard)
  DEPOSIT_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_PRICE_ID || 'price_1Q...', 

  // Mapping of Package Slugs/IDs to their Stripe Price IDs
  // Since we fetch packages from DB, we'll try to match by 'name' or 'id' if possible.
  // Ideally, this should come from the DB (Package table), but for now we map it here.
  PACKAGES: {
    'bronze-collection': {
      full: 'price_bronze_full_...',
      balance: 'price_bronze_balance_...',
    },
    'silver-collection': {
      full: 'price_silver_full_...',
      balance: 'price_silver_balance_...',
    },
    'gold-collection': {
      full: 'price_gold_full_...',
      balance: 'price_gold_balance_...',
    },
    'newborn-session': {
      full: 'price_newborn_full_...',
      balance: 'price_newborn_balance_...',
    }
  } as Record<string, { full: string; balance: string }>
};
