import styled from 'styled-components';
import { PageHeader } from '../../components/shared/page-header';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const KpiCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const KpiLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const KpiValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Grid>
        <KpiCard>
          <KpiLabel>Vendas Hoje</KpiLabel>
          <KpiValue>-</KpiValue>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Faturamento Hoje</KpiLabel>
          <KpiValue>-</KpiValue>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Produtos em Estoque</KpiLabel>
          <KpiValue>-</KpiValue>
        </KpiCard>
        <KpiCard>
          <KpiLabel>OS Abertas</KpiLabel>
          <KpiValue>-</KpiValue>
        </KpiCard>
      </Grid>
    </>
  );
}
