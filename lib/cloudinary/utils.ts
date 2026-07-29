import { VARIABLES } from "@/constants/variables";

function popcount(n: bigint): number {
   let count = 0;
   while (n > 0n) {
      count += Number(n & 1n);
      n >>= 1n;
   }
   return count;
}

export function phashDistance(hash1: string, hash2: string): number {
   const n1 = BigInt(`0x${hash1}`);
   const n2 = BigInt(`0x${hash2}`);
   return popcount(n1 ^ n2);
}

export function phashSimilarity(hash1: string, hash2: string): number {
   const distance = phashDistance(hash1, hash2);
   return 1 - distance / 64.0;
}

export function isSimilarImage(hash1: string, hash2: string): boolean {
   return (
      phashSimilarity(hash1, hash2) >=
      VARIABLES.FILES.USER_AVATAR.PHASH_SIMILARITY_THRESHOLD
   );
}
