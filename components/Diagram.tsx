'use client';

import { useEffect, useId, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Loader2 } from 'lucide-react';
import { Diagram as DiagramData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  diagram: DiagramData;
  className?: string;
}

export default function Diagram({ diagram, className }: Props) {
  return (
    <figure
      className={cn(
        'rounded-2xl bg-canvas border-2 border-foreground p-4 sm:p-6 shadow-pop my-4',
        className
      )}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center text-foreground">
        {diagram.kind === 'mermaid' ? (
          <MermaidRenderer source={diagram.source} />
        ) : (
          <SvgRenderer source={diagram.source} />
        )}
      </div>
      {diagram.caption && (
        <figcaption className="mt-3 text-center text-xs font-medium tracking-wide text-neutral-500">
          {diagram.caption}
        </figcaption>
      )}
    </figure>
  );
}

function MermaidRenderer({ source }: { source: string }) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setSvg('');
    setError(null);

    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'strict',
          themeVariables: {
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            primaryColor: 'var(--color-canvas)',
            primaryTextColor: 'var(--color-foreground)',
            primaryBorderColor: 'var(--color-foreground)',
            lineColor: 'var(--color-foreground)',
            tertiaryColor: 'var(--color-cream)',
          },
        });
        const { svg: rendered } = await mermaid.render(`mmd-${reactId}`, source);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'render failed');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, reactId]);

  if (error) return <DiagramError message={error} />;
  if (!svg) return <DiagramLoading />;
  return (
    <div
      className="max-w-full [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function SvgRenderer({ source }: { source: string }) {
  const clean = DOMPurify.sanitize(source, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject', 'image'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick'],
  });

  if (!clean.trim().toLowerCase().startsWith('<svg')) {
    return <DiagramError message="Invalid SVG source." />;
  }

  return (
    <div
      className="max-w-full w-full [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

function DiagramLoading() {
  return (
    <div className="flex items-center gap-2 text-neutral-500 text-sm py-6">
      <Loader2 className="w-4 h-4 animate-spin" />
      Rendering diagram…
    </div>
  );
}

function DiagramError({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 py-4" role="alert">
      Could not render diagram: {message}
    </p>
  );
}
