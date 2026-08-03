/**
 * Build a 5→1 star breakdown whose weighted average matches `rating`
 * and whose counts sum to `reviewCount`.
 */
export function getRatingBarDistribution(rating: number, reviewCount: number) {
  const n = Math.max(1, Math.round(reviewCount));
  const r = Math.min(5, Math.max(1, rating));
  const targetSum = Math.round(r * n);
  const gap = 5 - r;

  let n1 = Math.round(n * Math.min(0.02, gap * 0.05));
  let n2 = Math.round(n * Math.min(0.03, gap * 0.08));
  let n3 = Math.round(n * Math.min(0.06, gap * 0.18));

  const rebalanceLower = () => {
    let lowerCount = n1 + n2 + n3;
    let lowerSum = n1 + 2 * n2 + 3 * n3;
    let rem = n - lowerCount;
    let remSum = targetSum - lowerSum;

    while (lowerCount > 0 && rem > 0 && (remSum > 5 * rem || remSum < 4 * rem)) {
      if (n1 > 0) {
        n1 -= 1;
        lowerSum -= 1;
      } else if (n2 > 0) {
        n2 -= 1;
        lowerSum -= 2;
      } else if (n3 > 0) {
        n3 -= 1;
        lowerSum -= 3;
      } else {
        break;
      }
      lowerCount = n1 + n2 + n3;
      rem = n - lowerCount;
      remSum = targetSum - lowerSum;
    }
  };

  rebalanceLower();

  const rem = n - n1 - n2 - n3;
  const remSum = targetSum - (n1 + 2 * n2 + 3 * n3);

  let n5 = remSum - 4 * rem;
  let n4 = rem - n5;

  if (n5 < 0) {
    n4 += n5;
    n5 = 0;
  }
  if (n4 < 0) {
    n5 += n4;
    n4 = 0;
  }

  const total = n5 + n4 + n3 + n2 + n1;
  if (total !== n) {
    n5 += n - total;
    if (n5 < 0) {
      n4 += n5;
      n5 = 0;
    }
  }

  const counts = [n1, n2, n3, n4, n5];

  return ([5, 4, 3, 2, 1] as const).map((stars) => {
    const count = counts[stars - 1];
    return {
      stars,
      count,
      pct: (count / n) * 100,
    };
  });
}
