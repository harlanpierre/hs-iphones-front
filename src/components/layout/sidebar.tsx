import { NavLink } from 'react-router';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Wrench,
  Hammer,
  CreditCard,
  Smartphone,
  UserCog,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import type { UserRole } from '../../types/auth.types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'VENDEDOR', 'TECNICO'] },
  { label: 'Produtos', path: '/produtos', icon: <Package size={20} />, roles: ['ADMIN', 'VENDEDOR', 'TECNICO'] },
  { label: 'Clientes', path: '/clientes', icon: <Users size={20} />, roles: ['ADMIN', 'VENDEDOR'] },
  { label: 'Usuarios', path: '/usuarios', icon: <UserCog size={20} />, roles: ['ADMIN'] },
  { label: 'Fornecedores', path: '/fornecedores', icon: <Truck size={20} />, roles: ['ADMIN'] },
  { label: 'Vendas / PDV', path: '/vendas', icon: <ShoppingCart size={20} />, roles: ['ADMIN', 'VENDEDOR'] },
  { label: 'Assistencia (OS)', path: '/assistencia', icon: <Wrench size={20} />, roles: ['ADMIN', 'TECNICO'] },
  { label: 'Reparos Internos', path: '/reparos', icon: <Hammer size={20} />, roles: ['ADMIN', 'TECNICO'] },
  { label: 'Assinatura', path: '/assinatura', icon: <CreditCard size={20} />, roles: ['ADMIN'] },
];

const SidebarContainer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ theme }) => theme.sidebar.width};
  background: ${({ theme }) => theme.colors.bgSidebar};
  color: ${({ theme }) => theme.colors.textOnDark};
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: transform 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.colors.overlay};
    z-index: 39;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 700;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0.75rem 0.5rem;
  overflow-y: auto;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  transition: all 0.15s ease;
  margin-bottom: 0.25rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 41;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgSidebar};
  color: #fff;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const { hasRole } = useAuth();

  const filteredItems = NAV_ITEMS.filter((item) => hasRole(...item.roles));

  return (
    <>
      <MobileToggle onClick={onToggle}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </MobileToggle>

      {open && <Overlay onClick={onToggle} />}

      <SidebarContainer $open={open}>
        <Logo>
          <Smartphone size={24} />
          <h1>HS iPhones</h1>
        </Logo>
        <Nav>
          {filteredItems.map((item) => (
            <StyledNavLink key={item.path} to={item.path} onClick={() => onToggle()}>
              {item.icon}
              {item.label}
            </StyledNavLink>
          ))}
        </Nav>
      </SidebarContainer>
    </>
  );
}
