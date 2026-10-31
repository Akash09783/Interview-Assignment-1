export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  currency: string;
  step?: number;
  stepName?: string;
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
    price: 35.00,
    currency: 'USD',
    step: 1,
    stepName: 'Cleanse',
    images: ['/assets/Beauty_In_Stem_12_13.jpg', '/assets/Beauty_In_Stem_1.jpg'],
    description: 'A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves skin balanced, supple, and revitalized.',
    volume: '150ml / 5.1 fl oz',
    keyIngredients: ['Salmon DNA (PDRN)', 'Centella Asiatica', 'Low-pH Surfactants'],
  },
  {
    id: 'reset-serum',
    name: 'Reset Serum',
    subtitle: 'RESET SERUM',
    price: 65.00,
    currency: 'USD',
    step: 2,
    stepName: 'Repair',
    images: ['/assets/Beauty_In_Stem_15.jpg', '/assets/Beauty_In_Stem_4.jpg'],
    description: 'A potent multi-action peptide and cellular repair serum engineered to target environmental stress, restore elasticity, and accelerate tissue recovery.',
    volume: '50ml / 1.7 fl oz',
    keyIngredients: ['Dual PDRN Concentrate', 'Epidermal Growth Factor', 'Niacinamide 5%'],
  },
  {
    id: 'hydra-nutrition-stick',
    name: 'Hydra-Nutrition Stick',
    subtitle: 'HYDRA-NUTRITION',
    price: 55.00,
    currency: 'USD',
    step: 3,
    stepName: 'Nourish',
    images: ['/assets/Beauty_In_Stem_16.jpg', '/assets/Beauty_In_Stem_2.jpg'],
    description: 'Portable, multi-depth moisture nourishment in a solid balmy stick. Glides seamlessly over skin to instantly infuse salmon DNA, essential ceramides, and vital lipids.',
    volume: '30g / 1.01 fl oz',
    keyIngredients: ['PDRN Salmon DNA', 'Phytosterols', 'Multi-Ceramide Complex'],
  },
  {
    id: 'barrier-recovery-cream',
    name: 'Barrier Recovery Cream',
    subtitle: 'BARRIER RECOVERY CREAM',
    price: 75.00,
    currency: 'USD',
    step: 4,
    stepName: 'Shield',
    images: ['/assets/Beauty_In_Stem_14.jpg', '/assets/803e3cd3c1410f61ee939257a7c88173.jpg'],
    description: 'The final seal in the skin fitness system. Formulated to fortify lipid bilayers, trap essential moisture, and shield against oxidative stress.',
    volume: '60ml / 2.0 fl oz',
    keyIngredients: ['Biomimetic Lipid Shield', 'Ectoin', 'Beta-Glucan'],
  },
];
