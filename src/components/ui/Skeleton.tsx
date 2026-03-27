import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: ${pulse} 1.5s ease-in-out infinite;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
`;
