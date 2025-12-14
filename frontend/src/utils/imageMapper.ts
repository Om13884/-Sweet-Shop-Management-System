/**
 * Maps sweet names to their corresponding image files
 * This function normalizes the sweet name and matches it to available images
 */
export const getSweetImage = (sweetName: string): string => {
  // Normalize the name: lowercase, remove extra spaces, handle special cases
  const normalized = sweetName.toLowerCase().trim();
  
  // Map of normalized names to image filenames
  const imageMap: { [key: string]: string } = {
    'barfi': 'barfi.avif',
    'chocolate barfi': 'Chocolate-Barfi.jpg',
    'chocolate-barfi': 'Chocolate-Barfi.jpg',
    'gulab jamun': 'gulab jamun.jpg',
    'gulabjamun': 'gulab jamun.jpg',
    'jelebi': 'jelebi.jpg',
    'jalebi': 'jelebi.jpg',
    'kaju katli': 'kaju katli.jpg',
    'kajukatli': 'kaju katli.jpg',
    'motichuur ladu': 'motichuur ladu.jpg',
    'motichoor ladu': 'motichuur ladu.jpg',
    'motichoorladu': 'motichuur ladu.jpg',
    'motichuurladu': 'motichuur ladu.jpg',
    'rava barfi': 'RAVA barfi.jpg',
    'ravabarfi': 'RAVA barfi.jpg',
  };

  // Try exact match first
  if (imageMap[normalized]) {
    return `/menu-images/${imageMap[normalized]}`;
  }

  // Try partial matching (contains)
  for (const [key, image] of Object.entries(imageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `/menu-images/${image}`;
    }
  }

  // Default fallback image (you can add a default image later)
  return '/menu-images/barfi.avif'; // Default to barfi if no match found
};

