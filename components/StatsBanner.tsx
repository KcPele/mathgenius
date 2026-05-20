import { MathQuestion } from '@/lib/types';
import Starburst from './Starburst';

interface Props {
  question: MathQuestion | null;
  revealedSteps: number;
}

export default function StatsBanner({ question, revealedSteps }: Props) {
  const totalSteps = question?.workingSteps.length ?? 0;
  const progress = totalSteps > 0 ? Math.round((revealedSteps / totalSteps) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard color="purple" label="Topic" value={question?.topic ?? '—'} />
      <StatCard color="yellow" label="Steps" value={`${revealedSteps}/${totalSteps}`} />
      <StatCard color="pink" label="Progress" value={`${progress}%`} />
    </div>
  );
}

function StatCard({
  color,
  label,
  value,
}: {
  color: 'purple' | 'yellow' | 'pink';
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-paper border-2 border-foreground px-5 py-4 flex items-center gap-4 shadow-pop-md">
      <div className="w-14 h-14 shrink-0">
        <Starburst color={color} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">{label}</p>
        <p className="font-display text-lg text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
