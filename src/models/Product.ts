export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  step: number;
  stepName: string;
  images: string[];
  description: string;
  volume: string;
  keyIngredients: string[];
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'hydra-foam-cleanser',
    name: 'Hydra-Foam Cleanser',
    subtitle: 'HYDRA-FOAM CLEANSER',
    price: 35.0,
    currency: 'USD',
    step: 1,
    stepName: 'Cleanse',
    images: ['/assets/Beauty_In_Stem_12_13.jpg', '/assets/Beauty_In_Stem_1.jpg'],
    description:
      'A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves your skin feeling clean and hydrated.',
    volume: '150ml / 5.1 fl oz',
    keyIngredients: ['PDRN Salmon DNA', 'Centella Asiatica', 'Gentle Amino Surfactants'],
  },
  {
    id: 'reset-serum',
    name: 'Reset Serum',
    subtitle: 'RESET SERUM',
    price: 75.0,
    currency: 'USD',
    step: 2,
    stepName: 'Activate',
    images: ['/assets/Beauty_In_Stem_15.jpg', '/assets/Beauty_In_Stem_4.jpg'],
    description:
      'A targeted activation serum that stimulates the skin cells in regaining strength, density, and balance — preparing it for sustained resilience. Resulting in a more youthful, glowy texture.',
    volume: '50ml / 1.7 fl oz',
    keyIngredients: ['Purified PDRN', 'Epidermal Growth Factor', 'Niacinamide'],
  },
  {
    id: 'lash-and-eye-conditioner',
    name: 'Lash and Eye Conditioner',
    subtitle: 'EYE & LASH CONDITIONER',
    price: 65.0,
    currency: 'USD',
    step: 4,
    stepName: 'Maintain',
    images: ['/assets/Beauty_In_Stem_16.jpg', '/assets/Beauty_In_Stem_2.jpg'],
    description:
      'A multi-tasking eye fitness serum formulated to support the skin around the eyes and lashes, where is it most delicate. Eye skin and lashes will appears thicker over time, reducing dark areas and crepiness.',
    volume: '30g / 1.01 fl oz',
    keyIngredients: ['Salmon PDRN Peptide', 'Biotinoyl Tripeptide', 'Hyaluronic Acid'],
  },
  {
    id: 'hydra-nutrition-essence',
    name: 'Hydra-Nutrition Essence',
    subtitle: 'HYDRA-NUTRITION ESSENCE',
    price: 65.0,
    currency: 'USD',
    step: 3,
    stepName: 'Recovery',
    images: ['/assets/Beauty_In_Stem_14.jpg', '/assets/803e3cd3c1410f61ee939257a7c88173.jpg'],
    description:
      'A barrier-training moisturiser designed to strengthen the skin\'s tolerance over time, reinforcing hydration, structure, and defensive function. This light milky formula leaves your skin brighter and well hydrated.',
    volume: '60ml / 2.0 fl oz',
    keyIngredients: ['Ceramide NP', 'Phytosphingosine', 'PDRN Salmon Extract'],
  },
];
