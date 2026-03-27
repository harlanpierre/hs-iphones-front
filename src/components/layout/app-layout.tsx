import { useState } from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const MainArea = styled.div`
  margin-left: ${({ theme }) => theme.sidebar.width};
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    padding-top: 3.5rem;
  }
`;

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutWrapper>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MainArea>
        <Topbar />
        <Content>
          <Outlet />
        </Content>
      </MainArea>
    </LayoutWrapper>
  );
}
