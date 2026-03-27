import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { salesApi } from '../../api/sales.api';
import { PageHeader } from '../../components/shared/page-header';
import { SaleStatusBadge } from '../../components/shared/status-badge';
import { ConfirmDialog } from '../../components/shared/confirm-dialog';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../components/ui/Table';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/utils';
import { PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { useState } from 'react';

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

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

export function SaleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = useState<'cancel' | 'return' | 'reserve' | null>(null);

  const { data: sale, isLoading } = useQuery({
    queryKey: ['sales', Number(id)],
    queryFn: () => salesApi.findById(Number(id)),
  });

  const actionMutation = useMutation({
    mutationFn: async (action: 'cancel' | 'return' | 'reserve') => {
      const fns = { cancel: salesApi.cancel, return: salesApi.returnSale, reserve: salesApi.reserve };
      return fns[action](Number(id));
    },
    onSuccess: () => {
      toast.success('Venda atualizada.');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setConfirmAction(null);
    },
  });

  const handleReceipt = async () => {
    const html = await salesApi.getReceipt(Number(id));
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  if (isLoading || !sale) return <p>Carregando...</p>;

  const { status } = sale;

  return (
    <>
      <PageHeader title={`Venda #${sale.id}`} />

      <ActionBar>
        {status === 'ORCAMENTO' && (
          <>
            <Button onClick={() => setConfirmAction('reserve')}>Reservar</Button>
            <Button $variant="danger" onClick={() => setConfirmAction('cancel')}>Cancelar</Button>
          </>
        )}
        {status === 'RESERVADO' && (
          <>
            <Button onClick={() => navigate(`/vendas/${id}`)}>Pagar e Concluir</Button>
            <Button $variant="danger" onClick={() => setConfirmAction('cancel')}>Cancelar</Button>
          </>
        )}
        {status === 'CONCLUIDO' && (
          <>
            <Button $variant="danger" onClick={() => setConfirmAction('return')}>Registrar Devolucao</Button>
            <Button $variant="outline" onClick={handleReceipt}>Imprimir Recibo</Button>
          </>
        )}
      </ActionBar>

      <Card>
        <InfoGrid>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <SaleStatusBadge status={sale.status} />
          </Field>
          <Field>
            <FieldLabel>Cliente</FieldLabel>
            <FieldValue>{sale.clientName}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Vendedor</FieldLabel>
            <FieldValue>{sale.sellerName || '-'}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Data</FieldLabel>
            <FieldValue>{formatDateTime(sale.createdAt)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Total Bruto</FieldLabel>
            <FieldValue>{formatCurrency(sale.totalAmount)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Desconto</FieldLabel>
            <FieldValue>{formatCurrency(sale.discountAmount)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Total Liquido</FieldLabel>
            <FieldValue>{formatCurrency(sale.netAmount)}</FieldValue>
          </Field>
        </InfoGrid>

        <Section>
          <CardTitle>Itens</CardTitle>
          <TableContainer style={{ marginTop: '0.75rem' }}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Produto</Th><Th>SKU</Th><Th>IMEI</Th><Th>Qtd</Th><Th>Subtotal</Th><Th>Garantia ate</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sale.items.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.productName}{item.isFreebie ? ' (Brinde)' : ''}</Td>
                    <Td>{item.sku}</Td>
                    <Td>{item.imei || '-'}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{formatCurrency(item.subtotal)}</Td>
                    <Td>{formatDate(item.warrantyEndDate)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Section>

        {sale.payments.length > 0 && (
          <Section>
            <CardTitle>Pagamentos</CardTitle>
            <TableContainer style={{ marginTop: '0.75rem' }}>
              <Table>
                <Thead>
                  <Tr><Th>Metodo</Th><Th>Valor</Th><Th>Parcelas</Th><Th>Retoma</Th></Tr>
                </Thead>
                <Tbody>
                  {sale.payments.map((p) => (
                    <Tr key={p.id}>
                      <Td>{PAYMENT_METHOD_LABELS[p.method]}</Td>
                      <Td>{formatCurrency(p.amount)}</Td>
                      <Td>{p.installments > 1 ? `${p.installments}x` : '-'}</Td>
                      <Td>{p.buybackProductName || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Section>
        )}
      </Card>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction === 'cancel' ? 'Cancelar Venda' : confirmAction === 'return' ? 'Registrar Devolucao' : 'Reservar Venda'}
        description={confirmAction === 'cancel' ? 'Deseja cancelar esta venda? O estoque sera restaurado.' : confirmAction === 'return' ? 'Deseja registrar a devolucao? O estoque sera restaurado.' : 'Deseja reservar esta venda? O estoque sera deduzido.'}
        confirmLabel="Confirmar"
        variant={confirmAction === 'reserve' ? 'primary' : 'danger'}
        onConfirm={() => confirmAction && actionMutation.mutate(confirmAction)}
      />
    </>
  );
}
