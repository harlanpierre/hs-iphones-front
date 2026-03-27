import styled, { css } from 'styled-components';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface BadgeProps {
  $variant?: BadgeVariant;
}

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: ${({ theme }) => theme.colors.success};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningLight};
    color: ${({ theme }) => theme.colors.warning};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoLight};
    color: ${({ theme }) => theme.colors.info};
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.secondary};
  `,
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;

  ${({ $variant = 'default' }) => variantStyles[$variant]}
`;
