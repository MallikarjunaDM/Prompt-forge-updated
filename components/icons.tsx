import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {children}
  </svg>
);

export const ForgeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="M12 11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
    <rect x="2" y="11" width="20" height="10" rx="2" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 1" /><path d="m19 3-1 1" /><path d="m5 21 1-1" /><path d="m19 21-1-1" />
  </IconWrapper>
);

export const LoadingSpinnerIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </IconWrapper>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </IconWrapper>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <polyline points="20 6 9 17 4 12" />
  </IconWrapper>
);

export const HistoryIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </IconWrapper>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </IconWrapper>
);

export const SaveIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </IconWrapper>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconWrapper>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </IconWrapper>
);

export const CodeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </IconWrapper>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </IconWrapper>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </IconWrapper>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconWrapper>
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </IconWrapper>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </IconWrapper>
);