/**
 * Natural sort function that handles numeric values within strings
 * 
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Negative if a < b, positive if a > b, zero if equal
 * 
 * @example
 * ```ts
 * const files = ['file1.txt', 'file10.txt', 'file2.txt'];
 * files.sort(naturalSort);
 * // Result: ['file1.txt', 'file2.txt', 'file10.txt']
 * ```
 */
export function naturalSort(a: string, b: string): number {
  const regex = /(\d+|\D+)/g;
  const aParts = a.match(regex) || [];
  const bParts = b.match(regex) || [];
  
  const maxLength = Math.max(aParts.length, bParts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] || '';
    const bPart = bParts[i] || '';
    
    const aIsNum = /^\d+$/.test(aPart);
    const bIsNum = /^\d+$/.test(bPart);
    
    if (aIsNum && bIsNum) {
      const numA = parseInt(aPart, 10);
      const numB = parseInt(bPart, 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      const comparison = aPart.localeCompare(bPart);
      if (comparison !== 0) {
        return comparison;
      }
    }
  }
  
  return 0;
}