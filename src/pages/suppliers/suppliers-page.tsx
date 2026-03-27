import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import { suppliersApi } from '../../api/suppliers.api';
import { SupplierResponse } from '../../types/supplier.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, Column } from '../../components/shared/data-table';
import { ConfirmDialog } from '../../components/shared/confirm-dialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCpfCnpj, formatPhone } from '../../lib/utils';
import toast from 'react-hot-toast';

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export function SuppliersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['suppliers', page, filter],
    queryFn: () => suppliersApi.findAll(page, 20, filter || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.delete,
    onSuccess: () => {
      toast.success('Fornecedor excluido.');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDeleteId(null);
    },
  });

  const columns: Column<SupplierResponse>[] = [
    { header: 'Nome', accessor: 'name' },
    { header: 'CPF/CNPJ', accessor: (r) => formatCpfCnpj(r.cpfCnpj) },
    { header: 'Telefone', accessor: (r) => formatPhone(r.phone) },
    {
      header: 'Acoes',
      width: '120px',
      accessor: (r) => (
        <Actions>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/fornecedores/${r.id}/editar`); }}>
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
      <PageHeader title="Fornecedores" buttonLabel="Novo Fornecedor" buttonPath="/fornecedores/novo" />

      <FilterBar>
        <Input
          placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0); }}
          style={{ maxWidth: 400 }}
        />
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
        title="Excluir fornecedor"
        description="Tem certeza que deseja excluir este fornecedor? Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </>
  );
}
