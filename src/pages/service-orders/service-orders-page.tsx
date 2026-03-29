import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { serviceOrdersApi } from '../../api/service-orders.api';
import type { ServiceOrderResponse, ServiceOrderStatus } from '../../types/service-order.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, type Column } from '../../components/shared/data-table';
import { OSStatusBadge } from '../../components/shared/status-badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { SERVICE_ORDER_STATUS_LABELS } from '../../lib/constants';
import { formatCurrency, formatDateTime } from '../../lib/utils';

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export function ServiceOrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<ServiceOrderStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['service-orders', page, status],
    queryFn: () => serviceOrdersApi.findAll({ page, size: 20, status: status || undefined }),
  });

  const columns: Column<ServiceOrderResponse>[] = [
    { header: '#OS', accessor: 'id', width: '60px' },
    { header: 'Cliente', accessor: 'clientName' },
    { header: 'Aparelho', accessor: 'deviceModel' },
    { header: 'Problema', accessor: (r) => (r.reportedIssue?.length > 50 ? r.reportedIssue.slice(0, 50) + '...' : r.reportedIssue) },
    { header: 'Status', accessor: (r) => <OSStatusBadge status={r.status} /> },
    { header: 'Total', accessor: (r) => formatCurrency(r.totalAmount) },
    { header: 'Abertura', accessor: (r) => formatDateTime(r.createdAt) },
    {
      header: 'Acoes',
      width: '80px',
      accessor: (r) => (
        <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/assistencia/${r.id}`); }}>
          <Eye size={14} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Ordens de Servico" buttonLabel="Nova OS" buttonPath="/assistencia/nova" />

      <FilterBar>
        <Select value={status} onChange={(e) => { setStatus(e.target.value as ServiceOrderStatus | ''); setPage(0); }} style={{ maxWidth: 220 }}>
          <option value="">Todos Status</option>
          {Object.entries(SERVICE_ORDER_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements}
        onPageChange={setPage}
        isLoading={isLoading}
        keyExtractor={(r) => r.id}
      />
    </>
  );
}
