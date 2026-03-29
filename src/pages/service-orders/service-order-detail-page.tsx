import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { serviceOrdersApi } from '../../api/service-orders.api';
import type { ServiceOrderStatus } from '../../types/service-order.types';
import { PageHeader } from '../../components/shared/page-header';
import { OSStatusBadge } from '../../components/shared/status-badge';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, FormGroup } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../components/ui/Table';
import { SERVICE_ORDER_STATUS_LABELS } from '../../lib/constants';
import { formatCurrency, formatDateTime } from '../../lib/utils';

const STATUS_FLOW: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
  RECEIVED: ['IN_DIAGNOSIS', 'CANCELED'],
  IN_DIAGNOSIS: ['AWAITING_APPROVAL', 'CANCELED'],
  AWAITING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['IN_PROGRESS'],
  REJECTED: ['DELIVERED', 'CANCELED'],
  IN_PROGRESS: ['READY_FOR_PICKUP'],
  READY_FOR_PICKUP: ['DELIVERED'],
  DELIVERED: [],
  CANCELED: [],
};

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Field = styled.div``;
const FieldLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const FieldValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const StepperContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const Step = styled.div<{ $active: boolean; $done: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  background: ${({ $active, $done, theme }) =>
    $active ? theme.colors.primary : $done ? theme.colors.successLight : theme.colors.border};
  color: ${({ $active, $done, theme }) =>
    $active ? '#fff' : $done ? theme.colors.success : theme.colors.textMuted};
`;

const MAIN_FLOW: ServiceOrderStatus[] = [
  'RECEIVED', 'IN_DIAGNOSIS', 'AWAITING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'DELIVERED',
];

export function ServiceOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showAddPart, setShowAddPart] = useState(false);
  const [partProductId, setPartProductId] = useState('');
  const [partQuantity, setPartQuantity] = useState('1');

  const { data: os, isLoading } = useQuery({
    queryKey: ['service-orders', Number(id)],
    queryFn: () => serviceOrdersApi.findById(Number(id)),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ServiceOrderStatus) => serviceOrdersApi.updateStatus(Number(id), status),
    onSuccess: () => {
      toast.success('Status atualizado.');
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
    },
  });

  const addPartMutation = useMutation({
    mutationFn: () => serviceOrdersApi.addPart(Number(id), {
      productId: Number(partProductId),
      quantity: Number(partQuantity),
    }),
    onSuccess: () => {
      toast.success('Peca adicionada.');
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      setShowAddPart(false);
      setPartProductId('');
      setPartQuantity('1');
    },
  });

  if (isLoading || !os) return <p>Carregando...</p>;

  const nextStatuses = STATUS_FLOW[os.status] || [];
  const currentIdx = MAIN_FLOW.indexOf(os.status);

  return (
    <>
      <PageHeader title={`OS #${os.id}`} />

      <StepperContainer>
        {MAIN_FLOW.map((s, i) => (
          <Step key={s} $active={s === os.status} $done={i < currentIdx}>
            {SERVICE_ORDER_STATUS_LABELS[s]}
          </Step>
        ))}
      </StepperContainer>

      <ActionBar>
        {nextStatuses.map((s) => (
          <Button
            key={s}
            $variant={s === 'CANCELED' ? 'danger' : 'primary'}
            $size="sm"
            onClick={() => statusMutation.mutate(s)}
            disabled={statusMutation.isPending}
          >
            {SERVICE_ORDER_STATUS_LABELS[s]}
          </Button>
        ))}
        <Button $variant="outline" $size="sm" onClick={() => setShowAddPart(true)}>
          Adicionar Peca
        </Button>
      </ActionBar>

      <Card>
        <InfoGrid>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <OSStatusBadge status={os.status} />
          </Field>
          <Field>
            <FieldLabel>Cliente</FieldLabel>
            <FieldValue>{os.clientName}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Aparelho</FieldLabel>
            <FieldValue>{os.deviceModel}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Abertura</FieldLabel>
            <FieldValue>{formatDateTime(os.createdAt)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Mao de Obra</FieldLabel>
            <FieldValue>{formatCurrency(os.laborCost)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Pecas</FieldLabel>
            <FieldValue>{formatCurrency(os.partsCost)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Total</FieldLabel>
            <FieldValue>{formatCurrency(os.totalAmount)}</FieldValue>
          </Field>
        </InfoGrid>

        <div style={{ marginBottom: '1rem' }}>
          <FieldLabel>Problema Relatado</FieldLabel>
          <p>{os.reportedIssue}</p>
        </div>

        {os.diagnostic && (
          <div style={{ marginBottom: '1rem' }}>
            <FieldLabel>Diagnostico</FieldLabel>
            <p>{os.diagnostic}</p>
          </div>
        )}

        {os.items.length > 0 && (
          <>
            <CardTitle style={{ marginTop: '1rem' }}>Pecas Utilizadas</CardTitle>
            <TableContainer style={{ marginTop: '0.75rem' }}>
              <Table>
                <Thead>
                  <Tr><Th>Peca</Th><Th>Qtd</Th><Th>Preco Unit.</Th><Th>Subtotal</Th></Tr>
                </Thead>
                <Tbody>
                  {os.items.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.productName}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{formatCurrency(item.unitPrice)}</Td>
                      <Td>{formatCurrency(item.subtotal)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>

      <Modal open={showAddPart} onOpenChange={setShowAddPart} title="Adicionar Peca">
        <FormGroup>
          <Label>ID do Produto (Peca) *</Label>
          <Input value={partProductId} onChange={(e) => setPartProductId(e.target.value)} type="number" placeholder="ID da peca" />
        </FormGroup>
        <FormGroup>
          <Label>Quantidade *</Label>
          <Input value={partQuantity} onChange={(e) => setPartQuantity(e.target.value)} type="number" min="1" />
        </FormGroup>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button $variant="ghost" onClick={() => setShowAddPart(false)}>Cancelar</Button>
          <Button onClick={() => addPartMutation.mutate()} disabled={addPartMutation.isPending}>
            Adicionar
          </Button>
        </div>
      </Modal>
    </>
  );
}
