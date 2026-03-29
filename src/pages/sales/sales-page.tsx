import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { salesApi } from '../../api/sales.api';
import type { SaleResponse, SaleStatus } from '../../types/sale.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, type Column } from '../../components/shared/data-table';
import { SaleStatusBadge } from '../../components/shared/status-badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SALE_STATUS_LABELS } from '../../lib/constants';
import { formatCurrency, formatDateTime } from '../../lib/utils';

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export function SalesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<SaleStatus | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['sales', page, status, dateFrom, dateTo],
    queryFn: () => salesApi.findAll({
      page,
      size: 20,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
  });

  const columns: Column<SaleResponse>[] = [
    { header: '#', accessor: 'id', width: '60px' },
    { header: 'Cliente', accessor: 'clientName' },
    { header: 'Vendedor', accessor: 'sellerName' },
    { header: 'Status', accessor: (r) => <SaleStatusBadge status={r.status} /> },
    { header: 'Total', accessor: (r) => formatCurrency(r.netAmount) },
    { header: 'Data', accessor: (r) => formatDateTime(r.createdAt) },
    {
      header: 'Acoes',
      width: '80px',
      accessor: (r) => (
        <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/vendas/${r.id}`); }}>
          <Eye size={14} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Vendas" buttonLabel="Nova Venda" buttonPath="/vendas/novo" />

      <FilterBar>
        <Select value={status} onChange={(e) => { setStatus(e.target.value as SaleStatus | ''); setPage(0); }} style={{ maxWidth: 200 }}>
          <option value="">Todos Status</option>
          {Object.entries(SALE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(0); }} style={{ maxWidth: 170 }} />
        <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(0); }} style={{ maxWidth: 170 }} />
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
