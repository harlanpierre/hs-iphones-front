import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import styled, { useTheme } from 'styled-components';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Wrench,
  Package,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardApi } from '../../api/dashboard.api';
import { Card, CardTitle } from '../../components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../lib/utils';

// -- Mapeamento de status para labels em portugues --

const SALE_STATUS_LABELS: Record<string, string> = {
  ORCAMENTO: 'Orcamento',
  RESERVADO: 'Reservado',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
  DEVOLVIDO: 'Devolvido',
};

const OS_STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Recebido',
  IN_DIAGNOSIS: 'Em Diagnostico',
  AWAITING_APPROVAL: 'Aguardando Aprovacao',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  IN_PROGRESS: 'Em Andamento',
  READY_FOR_PICKUP: 'Pronto p/ Retirada',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

const CATEGORY_LABELS: Record<string, string> = {
  CELULAR: 'Celulares',
  ACESSORIO: 'Acessorios',
  PECA: 'Pecas',
  OUTROS: 'Outros',
};

// -- Cores para graficos de pizza --

const SALE_STATUS_COLORS: Record<string, string> = {
  ORCAMENTO: '#d97706',
  RESERVADO: '#0891b2',
  CONCLUIDO: '#16a34a',
  CANCELADO: '#dc2626',
  DEVOLVIDO: '#64748b',
};

const OS_STATUS_COLORS: Record<string, string> = {
  RECEIVED: '#0891b2',
  IN_DIAGNOSIS: '#64748b',
  AWAITING_APPROVAL: '#d97706',
  APPROVED: '#0891b2',
  REJECTED: '#dc2626',
  IN_PROGRESS: '#d97706',
  READY_FOR_PICKUP: '#16a34a',
  DELIVERED: '#16a34a',
  CANCELED: '#dc2626',
};

const CATEGORY_COLORS: Record<string, string> = {
  CELULAR: '#2563eb',
  ACESSORIO: '#16a34a',
  PECA: '#d97706',
  OUTROS: '#64748b',
};

// -- Styled Components --

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SelectStyled = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const HeaderRow = styled.div`
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

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const KpiIcon = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const KpiInfo = styled.div``;

const KpiLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.125rem;
`;

const KpiValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerLight};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const AlertName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const AlertQty = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
`;

const LoadingGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

// -- Helpers --

function getMonthOptions() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, i);
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMMM yyyy', { locale: ptBR }),
    };
  });
}

// Custom tooltip formatado em portugues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CurrencyTooltip(props: any) {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
      <p>{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// -- Component --

export function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = monthOptions[selectedIndex];

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', selected.month, selected.year],
    queryFn: () => dashboardApi.getData(selected.month, selected.year),
  });

  // Preparar dados dos graficos
  const salesByDayData = useMemo(() => {
    if (!data?.salesByDay) return [];
    return data.salesByDay.map((d) => ({
      ...d,
      label: format(new Date(d.date + 'T00:00:00'), 'dd/MM', { locale: ptBR }),
    }));
  }, [data?.salesByDay]);

  const salesByStatusData = useMemo(() => {
    if (!data?.salesByStatus) return [];
    return data.salesByStatus.map((d) => ({
      ...d,
      label: SALE_STATUS_LABELS[d.status] || d.status,
      color: SALE_STATUS_COLORS[d.status] || '#64748b',
    }));
  }, [data?.salesByStatus]);

  const osByStatusData = useMemo(() => {
    if (!data?.serviceOrdersByStatus) return [];
    return data.serviceOrdersByStatus.map((d) => ({
      ...d,
      label: OS_STATUS_LABELS[d.status] || d.status,
      color: OS_STATUS_COLORS[d.status] || '#64748b',
    }));
  }, [data?.serviceOrdersByStatus]);

  const productsByCategoryData = useMemo(() => {
    if (!data?.productsByCategory) return [];
    return data.productsByCategory.map((d) => ({
      ...d,
      label: CATEGORY_LABELS[d.category] || d.category,
      color: CATEGORY_COLORS[d.category] || '#64748b',
    }));
  }, [data?.productsByCategory]);

  return (
    <>
      <HeaderRow>
        <Title>Dashboard</Title>
        <MonthSelector>
          <SelectStyled
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {monthOptions.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label}
              </option>
            ))}
          </SelectStyled>
        </MonthSelector>
      </HeaderRow>

      {/* KPI Cards */}
      <KpiGrid>
        <KpiCard>
          <KpiIcon $color={theme.colors.primary}><ShoppingCart size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Vendas Concluidas</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="60px" $height="1.5rem" /> : data?.kpis.salesCount ?? 0}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.success}><DollarSign size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Faturamento</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="100px" $height="1.5rem" /> : formatCurrency(data?.kpis.revenue ?? 0)}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.info}><TrendingUp size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Ticket Medio</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="80px" $height="1.5rem" /> : formatCurrency(data?.kpis.avgTicket ?? 0)}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.warning}><Wrench size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>OS Abertas</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="40px" $height="1.5rem" /> : data?.kpis.openServiceOrders ?? 0}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.secondary}><Package size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Produtos em Estoque</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="40px" $height="1.5rem" /> : data?.kpis.productsInStock ?? 0}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.danger}><AlertTriangle size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Estoque Baixo</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="40px" $height="1.5rem" /> : data?.kpis.lowStockProducts ?? 0}
            </KpiValue>
          </KpiInfo>
        </KpiCard>

        <KpiCard>
          <KpiIcon $color={theme.colors.primary}><UserPlus size={22} /></KpiIcon>
          <KpiInfo>
            <KpiLabel>Novos Clientes</KpiLabel>
            <KpiValue>
              {isLoading ? <Skeleton $width="40px" $height="1.5rem" /> : data?.kpis.newClients ?? 0}
            </KpiValue>
          </KpiInfo>
        </KpiCard>
      </KpiGrid>

      {/* Graficos - Linha 1 */}
      <SectionGrid>
        <Card>
          <CardTitle>Vendas por Dia</CardTitle>
          <ChartWrapper>
            {isLoading ? (
              <LoadingGrid>
                <Skeleton $width="100%" $height="250px" />
              </LoadingGrid>
            ) : salesByDayData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                  <XAxis dataKey="label" fontSize={12} tick={{ fill: theme.colors.textSecondary }} />
                  <YAxis fontSize={12} tick={{ fill: theme.colors.textSecondary }} tickFormatter={(v) => formatCurrency(Number(v))} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar dataKey="revenue" fill={theme.colors.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMessage>Nenhuma venda no periodo.</EmptyMessage>
            )}
          </ChartWrapper>
        </Card>

        <Card>
          <CardTitle>OS por Status</CardTitle>
          <ChartWrapper>
            {isLoading ? (
              <LoadingGrid>
                <Skeleton $width="100%" $height="250px" />
              </LoadingGrid>
            ) : osByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={osByStatusData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={PieLabel}
                    labelLine={false}
                  >
                    {osByStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend formatter={(value) => <span style={{ fontSize: '0.75rem' }}>{value}</span>} />
                  <Tooltip formatter={(value) => [value, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMessage>Nenhuma OS no periodo.</EmptyMessage>
            )}
          </ChartWrapper>
        </Card>
      </SectionGrid>

      {/* Graficos - Linha 2 */}
      <SectionGrid>
        <Card>
          <CardTitle>Vendas por Status</CardTitle>
          <ChartWrapper>
            {isLoading ? (
              <LoadingGrid>
                <Skeleton $width="100%" $height="250px" />
              </LoadingGrid>
            ) : salesByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByStatusData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={PieLabel}
                    labelLine={false}
                  >
                    {salesByStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend formatter={(value) => <span style={{ fontSize: '0.75rem' }}>{value}</span>} />
                  <Tooltip formatter={(value) => [value, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMessage>Nenhuma venda no periodo.</EmptyMessage>
            )}
          </ChartWrapper>
        </Card>

        <Card>
          <CardTitle>Estoque por Categoria</CardTitle>
          <ChartWrapper>
            {isLoading ? (
              <LoadingGrid>
                <Skeleton $width="100%" $height="250px" />
              </LoadingGrid>
            ) : productsByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productsByCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                  <XAxis type="number" fontSize={12} tick={{ fill: theme.colors.textSecondary }} />
                  <YAxis dataKey="label" type="category" fontSize={12} tick={{ fill: theme.colors.textSecondary }} width={90} />
                  <Tooltip formatter={(value) => [value, 'Quantidade']} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {productsByCategoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMessage>Nenhum produto cadastrado.</EmptyMessage>
            )}
          </ChartWrapper>
        </Card>
      </SectionGrid>

      {/* Tabelas */}
      <SectionGrid>
        <Card>
          <SectionHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </SectionHeader>
          {isLoading ? (
            <LoadingGrid>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} $width="100%" $height="1.5rem" />
              ))}
            </LoadingGrid>
          ) : data?.recentSales?.length ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr><Th>Cliente</Th><Th>Valor</Th><Th>Status</Th><Th>Data</Th></Tr>
                </Thead>
                <Tbody>
                  {data.recentSales.map((sale) => (
                    <Tr key={sale.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/vendas/${sale.id}`)}>
                      <Td>{sale.clientName}</Td>
                      <Td>{formatCurrency(sale.netAmount)}</Td>
                      <Td>
                        <StatusBadge $color={SALE_STATUS_COLORS[sale.status] || '#64748b'}>
                          {SALE_STATUS_LABELS[sale.status] || sale.status}
                        </StatusBadge>
                      </Td>
                      <Td>{formatDate(sale.createdAt)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyMessage>Nenhuma venda no periodo.</EmptyMessage>
          )}
        </Card>

        <Card>
          <SectionHeader>
            <CardTitle>OS Pendentes</CardTitle>
          </SectionHeader>
          {isLoading ? (
            <LoadingGrid>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} $width="100%" $height="1.5rem" />
              ))}
            </LoadingGrid>
          ) : data?.pendingServiceOrders?.length ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr><Th>Cliente</Th><Th>Aparelho</Th><Th>Status</Th><Th>Data</Th></Tr>
                </Thead>
                <Tbody>
                  {data.pendingServiceOrders.map((os) => (
                    <Tr key={os.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/assistencia/${os.id}`)}>
                      <Td>{os.clientName}</Td>
                      <Td>{os.deviceModel}</Td>
                      <Td>
                        <StatusBadge $color={OS_STATUS_COLORS[os.status] || '#64748b'}>
                          {OS_STATUS_LABELS[os.status] || os.status}
                        </StatusBadge>
                      </Td>
                      <Td>{formatDate(os.createdAt)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyMessage>Nenhuma OS pendente.</EmptyMessage>
          )}
        </Card>
      </SectionGrid>

      {/* Alertas de Estoque Baixo */}
      {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
        <Card>
          <SectionHeader>
            <CardTitle>Alertas de Estoque Baixo</CardTitle>
          </SectionHeader>
          <AlertList>
            {data.lowStockAlerts.map((item) => (
              <AlertItem key={item.id}>
                <AlertName>{item.name}</AlertName>
                <AlertQty>
                  {item.quantity} / {item.minStock} (minimo)
                </AlertQty>
              </AlertItem>
            ))}
          </AlertList>
        </Card>
      )}
    </>
  );
}
