declare module '@phosphor-icons/react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    mirrored?: boolean;
  }

  // Ícones usados no projeto
  export const Sparkle: ComponentType<IconProps>;
  export const Shield: ComponentType<IconProps>;
  export const ChartLine: ComponentType<IconProps>;
  export const Bell: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const FacebookLogo: ComponentType<IconProps>;
  export const TwitterLogo: ComponentType<IconProps>;
  export const InstagramLogo: ComponentType<IconProps>;
  export const GithubLogo: ComponentType<IconProps>;
  export const Skull: ComponentType<IconProps>;
  export const TrendUp: ComponentType<IconProps>;
  export const TrendDown: ComponentType<IconProps>;
  export const ArrowDown: ComponentType<IconProps>;
  export const ArrowUp: ComponentType<IconProps>;
  export const List: ComponentType<IconProps>;
  export const House: ComponentType<IconProps>;
  export const Gear: ComponentType<IconProps>;
  export const SignOut: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const CircleNotch: ComponentType<IconProps>;
  export const CurrencyBtc: ComponentType<IconProps>;
  export const Lightning: ComponentType<IconProps>;
  export const ArrowRight: ComponentType<IconProps>;
  export const Star: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const Globe: ComponentType<IconProps>;
  export const MagnifyingGlass: ComponentType<IconProps>;
  export const Camera: ComponentType<IconProps>;
  export const Palette: ComponentType<IconProps>;
  export const Download: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const Warning: ComponentType<IconProps>;
}
