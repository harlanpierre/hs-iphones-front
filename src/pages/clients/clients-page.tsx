import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import { clientsApi } from '../../api/clients.api';
import type { ClientResponse } from '../../types/client.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, type Column } from '../../components/shared/data-table';
import { ConfirmDialog } from '../../components/shared/confirm-dialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCpf, formatPhone } from '../../lib/utils';
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

export function ClientsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientsApi.findAll(page, 20, search || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      toast.success('Cliente excluido.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteId(null);
    },
  });

  const columns: Column<ClientResponse>[] = [
    { header: 'Nome', accessor: 'name' },
    { header: 'CPF', accessor: (r) => formatCpf(r.cpf) },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefone', accessor: (r) => formatPhone(r.phone) },
    { header: 'Cidade/UF', accessor: (r) => r.address ? `${r.address.city}/${r.address.state}` : '-' },
    {
      header: 'Acoes',
      width: '120px',
      accessor: (r) => (
        <Actions>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${r.id}/editar`); }}>
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
      <PageHeader title="Clientes" buttonLabel="Novo Cliente" buttonPath="/clientes/novo" />

      <FilterBar>
        <Input
          placeholder="Buscar por nome, CPF ou email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
        title="Excluir cliente"
        description="Tem certeza que deseja excluir este cliente? Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </>
  );
}
