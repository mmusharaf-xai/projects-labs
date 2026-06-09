export const AVATARS = [
  { name: 'cricket', icon: 'sports-cricket' },
  { name: 'hand', icon: 'front-hand' },
  { name: 'baseball', icon: 'sports-baseball' },
  { name: 'medal', icon: 'military-tech' },
  { name: 'trophy', icon: 'emoji-events' },
] as const;

export const AVATAR_ICONS = [
  'sports-cricket',
  'front-hand',
  'sports-baseball',
  'military-tech',
  'emoji-events',
] as const;

export const OVERS_OPTIONS = [1, 3, 5] as const;

export const MOVE_NUMBERS = [1, 2, 3, 4, 5, 6] as const;

export const VALIDATION_RULES = {
  usernameMinLength: 3,
  usernameMaxLength: 50,
  passwordMinLength: 8,
  passwordMaxLength: 16,
} as const;