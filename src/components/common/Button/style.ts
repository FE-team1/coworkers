export type FontSize = '14' | '16';

export type ButtonVariant = keyof typeof buttonVariant;

export type ButtonSize = keyof typeof buttonSize;

export const buttonSize = {
  fullWidth: 'w-full h-[47px] rounded-xl',
  xs: 'w-[74px] h-8 rounded-xl',
  sm: 'w-[111px] h-10 rounded-[40px]',
  md: 'w-[125px] h-12 rounded-[40px]',
  lg: 'w-[138px] h-10 rounded-[40px]',
  xl: 'w-[343px] h-12 rounded-[40px]',
  custom: '',
} as const;

export const buttonVariant = {
  solid: 'bg-primary text-white',
  'outline-primary': 'bg-white text-primary border border-primary',
  'outline-gray': 'bg-white text-gray500 border border-gray300',
  'ghost-primary': 'bg-transparent text-primary border border-primary',
  'ghost-white': 'bg-transparent text-white border border-white',
  danger: 'bg-danger text-white',
  gradient: 'text-white',
} as const;

export const disabledButton: Partial<Record<ButtonVariant, string>> = {
  solid: 'bg-gray400 text-white',
  'outline-primary': 'bg-white text-gray400 border border-gray400',
  'ghost-primary': 'bg-transparent text-gray400 border border-gray400',
  danger: 'bg-gray400 text-white',
  gradient: 'bg-gray400 text-white',
};

export const buttonFontSize: Record<FontSize, string> = {
  '14': 'text-md-semi',
  '16': 'text-lg-semi',
};
