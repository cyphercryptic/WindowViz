export const WINDOW_TYPES = [
  'Double-Hung',
  'Casement',
  'Bay',
  'Bow',
  'Picture',
  'Awning',
  'Sliding',
  'Hopper',
  'Garden',
  'Egress',
] as const;

export const SLIDING_DOOR_CONFIGS = [
  '2-Panel',
  '3-Panel',
  '4-Panel',
  'Pocket',
  'Stacking',
] as const;

export const ENTRY_DOOR_STYLES = [
  'Panel',
  'Craftsman',
  'Modern',
  'Traditional',
  'Rustic',
  'Farmhouse',
  'Contemporary',
] as const;

export const COMMON_BRANDS = [
  'Andersen',
  'Pella',
  'Marvin',
  'Milgard',
  'JELD-WEN',
  'Simonton',
  'Therma-Tru',
  'Masonite',
  'Provia',
] as const;

export const FRAME_MATERIALS = [
  'Vinyl',
  'Wood',
  'Fiberglass',
  'Aluminum',
  'Composite',
  'Steel',
  'Clad-Wood',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
