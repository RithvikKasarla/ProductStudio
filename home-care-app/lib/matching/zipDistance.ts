/**
 * Simple ZIP code distance estimation utility.
 * For MVP, uses prefix-based approximation with numeric difference for nearby ZIPs.
 *
 * For production, consider using a proper geocoding API or ZIP code database.
 */

export function estimateZipDistance(zip1?: string | null, zip2?: string | null): number {
    // If either ZIP is missing, return a high distance
    if (!zip1 || !zip2) return 1000;

    // Normalize ZIPs
    const z1 = zip1.trim();
    const z2 = zip2.trim();

    // Same ZIP code
    if (z1 === z2) return 0;

    // For nearby ZIPs (same 3-digit prefix), use numeric difference
    // This gives granular sorting for ZIPs like 10001, 10002, 10003
    if (z1.substring(0, 3) === z2.substring(0, 3)) {
        const num1 = parseInt(z1, 10);
        const num2 = parseInt(z2, 10);
        // Each ZIP difference is approximately 0.5-1 mile apart
        return Math.abs(num1 - num2);
    }

    // Same 2-digit prefix (same general area, ~50 miles)
    if (z1.substring(0, 2) === z2.substring(0, 2)) return 50;

    // Same 1-digit prefix (same region, ~200 miles)
    if (z1.charAt(0) === z2.charAt(0)) return 200;

    // Different regions
    return 500;
}

/**
 * Format a ZIP code for display.
 * Just returns the ZIP as-is for now.
 */
export function formatLocation(zip?: string | null): string {
    if (!zip) return 'Location not provided';
    return `📍 ${zip}`;
}

