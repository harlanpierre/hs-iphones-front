import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products.api';
import { repairsApi } from '../../api/repairs.api';
import { ProductResponse } from '../../types/product.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, Column } from '../../components/shared/data-table';
import { ConfirmDialog } from '../../components/shared/confirm-dialog';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';

export function RepairsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [finishId, setFinishId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'in-repair', page],
    queryFn: () => productsApi.findByFilter('CELULAR', 'IN_REPAIR', page, 20),
  });

  const finishMutation = useMutation({
    mutationFn: repairsApi.finish,
    onSuccess: () => {
      toast.success('Reparo finalizado! Produto disponivel.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setFinishId(null);
    },
  });

  const columns: Column<ProductResponse>[] = [
    { header: 'Nome', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'IMEIs', accessor: (r) => r.imeis?.join(', ') || '-' },
    { header: 'Custo Reparo', accessor: (r) => formatCurrency(r.repairCost) },
    {
      header: 'Acoes',
      width: '200px',
      accessor: (r) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button $variant="outline" $size="sm" onClick={(e) => { e.stopPropagation(); navigate('/reparos/novo'); }}>
            <Wrench size={14} /> Reparar
          </Button>
          <Button $variant="primary" $size="sm" onClick={(e) => { e.stopPropagation(); setFinishId(r.id); }}>
            <CheckCircle size={14} /> Finalizar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Reparos Internos" buttonLabel="Novo Reparo" buttonPath="/reparos/novo" />

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
        open={finishId !== null}
        onOpenChange={(open) => !open && setFinishId(null)}
        title="Finalizar Reparo"
        description="Deseja finalizar o reparo? O produto voltara ao status DISPONIVEL."
        confirmLabel="Finalizar"
        variant="primary"
        onConfirm={() => finishId && finishMutation.mutate(finishId)}
      />
    </>
  );
}
