import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Eye } from 'lucide-react';
import { productsApi } from '../../api/products.api';
import { ProductResponse, ProductCategory, ProductStatus } from '../../types/product.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, Column } from '../../components/shared/data-table';
import { ProductStatusBadge } from '../../components/shared/status-badge';
import { ConfirmDialog } from '../../components/shared/confirm-dialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { PRODUCT_CATEGORY_LABELS, PRODUCT_STATUS_LABELS } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export function ProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const useFilter = !!category && !!status;

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, category, status],
    queryFn: () =>
      useFilter
        ? productsApi.findByFilter(category as ProductCategory, status as ProductStatus, page, 20)
        : productsApi.findAll(page, 20),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success('Produto excluido.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteId(null);
    },
  });

  const columns: Column<ProductResponse>[] = [
    { header: 'SKU', accessor: 'sku', width: '100px' },
    { header: 'Nome', accessor: 'name' },
    { header: 'Categoria', accessor: (r) => PRODUCT_CATEGORY_LABELS[r.category] },
    { header: 'Status', accessor: (r) => <ProductStatusBadge status={r.status} /> },
    { header: 'Qtd', accessor: 'quantity', width: '60px' },
    { header: 'Preco Venda', accessor: (r) => formatCurrency(r.salePrice) },
    {
      header: 'Acoes',
      width: '140px',
      accessor: (r) => (
        <Actions>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/produtos/${r.id}`); }}>
            <Eye size={14} />
          </Button>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/produtos/${r.id}/editar`); }}>
            <Edit size={14} />
          </Button>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); }}>
            <Trash2 size={14} />
          </Button>
        </Actions>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Produtos" buttonLabel="Novo Produto" buttonPath="/produtos/novo" />

      <FilterBar>
        <Select value={category} onChange={(e) => { setCategory(e.target.value as ProductCategory | ''); setPage(0); }} style={{ maxWidth: 200 }}>
          <option value="">Todas Categorias</option>
          {Object.entries(PRODUCT_CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => { setStatus(e.target.value as ProductStatus | ''); setPage(0); }} style={{ maxWidth: 200 }}>
          <option value="">Todos Status</option>
          {Object.entries(PRODUCT_STATUS_LABELS).map(([k, v]) => (
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

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto?"
        confirmLabel="Excluir"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </>
  );
}
