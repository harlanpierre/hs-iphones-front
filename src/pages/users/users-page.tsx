import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, UserX, UserCheck } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import type { UserResponse } from '../../types/user.types';
import { PageHeader } from '../../components/shared/page-header';
import { DataTable, type Column } from '../../components/shared/data-table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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

const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN':
      return <Badge $color="#1e40af" $bg="#dbeafe">Admin</Badge>;
    case 'VENDEDOR':
      return <Badge $color="#166534" $bg="#dcfce7">Vendedor</Badge>;
    case 'TECNICO':
      return <Badge $color="#9a3412" $bg="#ffedd5">Tecnico</Badge>;
    default:
      return <Badge $color="#374151" $bg="#f3f4f6">{role}</Badge>;
  }
}

function getStatusBadge(active: boolean) {
  return active
    ? <Badge $color="#166534" $bg="#dcfce7">Ativo</Badge>
    : <Badge $color="#991b1b" $bg="#fee2e2">Inativo</Badge>;
}

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => usersApi.findAll(page, 20, search || undefined),
  });

  const toggleMutation = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      toast.success('Status do usuario atualizado.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Erro ao alterar status do usuario.');
    },
  });

  const handleToggleActive = (user: UserResponse) => {
    const action = user.active ? 'desativar' : 'reativar';
    if (window.confirm(`Deseja ${action} o usuario "${user.name}"?`)) {
      toggleMutation.mutate(user.id);
    }
  };

  const columns: Column<UserResponse>[] = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Usuario', accessor: 'username' },
    { header: 'Perfil', accessor: (r) => getRoleBadge(r.role) },
    { header: 'Status', accessor: (r) => getStatusBadge(r.active) },
    {
      header: 'Acoes',
      width: '120px',
      accessor: (r) => (
        <Actions>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/usuarios/${r.id}/editar`); }}>
            <Edit size={14} />
          </Button>
          <Button $variant="ghost" $size="sm" onClick={(e) => { e.stopPropagation(); handleToggleActive(r); }}>
            {r.active ? <UserX size={14} /> : <UserCheck size={14} />}
          </Button>
        </Actions>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Usuarios" buttonLabel="Novo Usuario" buttonPath="/usuarios/novo" />

      <FilterBar>
        <Input
          placeholder="Buscar por nome ou usuario..."
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
    </>
  );
}
