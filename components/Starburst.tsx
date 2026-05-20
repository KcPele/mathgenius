import { cn } from '@/lib/utils';

type PopColor = 'purple' | 'yellow' | 'pink' | 'green' | 'blue';

interface Props {
  color?: PopColor;
  className?: string;
  children?: React.ReactNode;
}

const fillByColor: Record<PopColor, string> = {
  purple: 'fill-pop-purple',
  yellow: 'fill-pop-yellow',
  pink: 'fill-pop-pink',
  green: 'fill-pop-green',
  blue: 'fill-pop-blue',
};

export default function Starburst({ color = 'purple', className, children }: Props) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d={
            'M50 4 L58 22 L78 14 L72 34 L94 38 L78 52 L94 66 L72 70 L78 88 L58 80 L50 96 L42 80 L22 88 L28 70 L6 66 L22 52 L6 38 L28 34 L22 14 L42 22 Z'
          }
          className={cn(fillByColor[color], 'stroke-foreground')}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  );
}
