import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusLabelProps {
  status: string;
  tone?: 'success' | 'pending' | 'error' | 'neutral';
}

const TONE_MAP = {
  success: {
    color: 'text-[#3F7D4E]',
    Icon: CheckCircle2,
  },
  pending: {
    color: 'text-[#B7791F]',
    Icon: Clock,
  },
  error: {
    color: 'text-[#A33A2A]',
    Icon: AlertCircle,
  },
  neutral: {
    color: 'text-[#5C4E41]',
    Icon: Clock,
  },
};

export function inferTone(status: string): 'success' | 'pending' | 'error' | 'neutral' {
  const s = status.toLowerCase();
  if (
    s.includes('disponible') ||
    s.includes('aprobada') ||
    s.includes('confirmada') ||
    s.includes('confirmado') ||
    s.includes('entregado') ||
    s.includes('adoptado') ||
    s.includes('listo')
  ) {
    return 'success';
  }
  if (s.includes('rechazad') || s.includes('cancelad') || s.includes('agotado')) {
    return 'error';
  }
  return 'pending';
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status, tone }) => {
  const resolvedTone = tone || inferTone(status);
  const { color, Icon } = TONE_MAP[resolvedTone];

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${color} whitespace-nowrap`}>
      <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
