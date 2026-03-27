import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  buttonPath?: string;
  onButtonClick?: () => void;
}

export function PageHeader({ title, buttonLabel, buttonPath, onButtonClick }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) return onButtonClick();
    if (buttonPath) navigate(buttonPath);
  };

  return (
    <Header>
      <Title>{title}</Title>
      {buttonLabel && (
        <Button onClick={handleClick}>
          <Plus size={16} />
          {buttonLabel}
        </Button>
      )}
    </Header>
  );
}
