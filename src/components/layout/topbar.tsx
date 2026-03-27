import styled from 'styled-components';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useNavigate } from 'react-router';
import { Badge } from '../ui/Badge';
import { USER_ROLE_LABELS } from '../../lib/constants';

const TopbarContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radii.md};

  &:hover {
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <TopbarContainer>
      <UserInfo>
        <UserName>{user?.name}</UserName>
        <Badge $variant="info">{user ? USER_ROLE_LABELS[user.role] : ''}</Badge>
      </UserInfo>
      <LogoutButton onClick={handleLogout}>
        <LogOut size={16} />
        Sair
      </LogoutButton>
    </TopbarContainer>
  );
}
