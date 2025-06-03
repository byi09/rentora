// ------------------------------------------------------------
// |   Utility functions for formatting strings and numbers   |
// ------------------------------------------------------------

/**
 * Format a number with commas as thousands separators.
 * @param num - Number to format
 */
export function formatPrice(num: number): string {
  if (isNaN(num)) return "0";
  const separated = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${separated}`;
}

/**
 * Format a large price with M for millions and K for thousands.
 */
export function formatLargeNumber(num: number): string {
  if (isNaN(num)) return "0";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

/**
 * Format a price range as a string.
 * @param min - Minimum price
 * @param max - Maximum price
 * @return Formatted price range string
 */
export function formatPriceRange(min?: number, max?: number): string {
  const isValidMin = typeof min === "number" && !isNaN(min) && min > 0;
  const isValidMax = typeof max === "number" && !isNaN(max) && max > 0;
  if (isValidMin && isValidMax)
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  if (isValidMin) return `From ${formatPrice(min)}`;
  if (isValidMax) return `Up to ${formatPrice(max)}`;
  return "Price";
}

/**
 * Format number of bedrooms and bathrooms.
 * @param bedrooms - Number of bedrooms
 * @param bathrooms - Number of bathrooms
 * @return Formatted string
 */
export function formatBedroomsAndBathrooms(
  bedrooms?: number,
  bathrooms?: number
): string {
  const numBeds = bedrooms || 0;
  const numBaths = bathrooms || 0;
  if (numBeds > 0 || numBaths > 0) {
    return `${numBeds}+ bd, ${numBaths}+ ba`;
  }
  return "Beds & Baths";
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove trailing zeros from a number string.
 */
export function trimZeros(str: string): string {
  if (str.includes(".")) {
    return str.replace(/\.?0+$/, "");
  }
  return str;
}
