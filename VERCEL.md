# Vercel Deployment

## Environment Variables

Add these 4 variables in Vercel:

```
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x717D92da7276Fe3E9254539A68A3758640250372
NEXT_PUBLIC_PLATFORM_WALLET=0x5ce89d95b7222b3f44873cafa7166f5915b2abce
```

Add to all environments (Production, Preview, Development).

## Cron Job

The cleanup cron runs daily at 2 AM UTC (free tier compatible).

To manually trigger cleanup, visit: `your-domain.vercel.app/api/cleanup`

That's it. Deploy and it works.
