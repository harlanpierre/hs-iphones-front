import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { salesApi } from '../../api/sales.api';
import { clientsApi } from '../../api/clients.api';
import { productsApi } from '../../api/products.api';
import { SaleItemRequest, PaymentRequest, PaymentMethod } from '../../types/sale.types';
import { PageHeader } from '../../components/shared/page-header';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, FormGroup } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) { grid-template-columns: 1fr; }
`;

const ItemRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const TotalBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  padding: 1rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1rem;
`;

interface ItemForm {
  productId: string;
  imei: string;
  quantity: string;
  isFreebie: boolean;
}

interface PaymentForm {
  method: PaymentMethod | '';
  amount: string;
  installments: string;
  buybackProductId: string;
}

export function SaleCheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState('');
  const [items, setItems] = useState<ItemForm[]>([{ productId: '', imei: '', quantity: '1', isFreebie: false }]);
  const [payments, setPayments] = useState<PaymentForm[]>([{ method: '', amount: '', installments: '1', buybackProductId: '' }]);

  const { data: availableProducts } = useQuery({
    queryKey: ['products', 'available'],
    queryFn: () => productsApi.findAvailable(0, 100),
  });

  const products = availableProducts?.content ?? [];

  const buildPayload = () => {
    const saleItems: SaleItemRequest[] = items
      .filter((i) => i.productId)
      .map((i) => ({
        productId: Number(i.productId),
        imei: i.imei || undefined,
        quantity: Number(i.quantity) || 1,
        isFreebie: i.isFreebie,
      }));

    const salePayments: PaymentRequest[] = payments
      .filter((p) => p.method && p.amount)
      .map((p) => ({
        method: p.method as PaymentMethod,
        amount: Number(p.amount),
        installments: Number(p.installments) || 1,
        buybackProductId: p.buybackProductId ? Number(p.buybackProductId) : undefined,
      }));

    return {
      clientId: Number(clientId),
      sellerName: sellerName || undefined,
      notes: notes || undefined,
      discountAmount: discount ? Number(discount) : undefined,
      items: saleItems,
      payments: salePayments.length > 0 ? salePayments : undefined,
    };
  };

  const budgetMutation = useMutation({
    mutationFn: () => salesApi.createBudget(buildPayload()),
    onSuccess: (sale) => {
      toast.success('Orcamento criado.');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      navigate(`/vendas/${sale.id}`);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => salesApi.checkout(buildPayload()),
    onSuccess: (sale) => {
      toast.success('Venda concluida!');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(`/vendas/${sale.id}`);
    },
  });

  const addItem = () => setItems([...items, { productId: '', imei: '', quantity: '1', isFreebie: false }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof ItemForm, value: string | boolean) => {
    const copy = [...items];
    (copy[i] as any)[field] = value;
    setItems(copy);
  };

  const addPayment = () => setPayments([...payments, { method: '', amount: '', installments: '1', buybackProductId: '' }]);
  const removePayment = (i: number) => setPayments(payments.filter((_, idx) => idx !== i));
  const updatePayment = (i: number, field: keyof PaymentForm, value: string) => {
    const copy = [...payments];
    (copy[i] as any)[field] = value;
    setPayments(copy);
  };

  const itemsTotal = items.reduce((sum, item) => {
    if (item.isFreebie) return sum;
    const prod = products.find((p) => p.id === Number(item.productId));
    return sum + (prod?.salePrice ?? 0) * (Number(item.quantity) || 0);
  }, 0);

  const netTotal = itemsTotal - (Number(discount) || 0);

  return (
    <>
      <PageHeader title="Nova Venda" />

      <Card>
        <Section>
          <CardTitle>Informacoes</CardTitle>
          <Row>
            <FormGroup>
              <Label>ID do Cliente *</Label>
              <Input value={clientId} onChange={(e) => setClientId(e.target.value)} type="number" placeholder="ID do cliente" />
            </FormGroup>
            <FormGroup>
              <Label>Vendedor</Label>
              <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="Nome do vendedor" />
            </FormGroup>
          </Row>
        </Section>

        <Section>
          <CardTitle>Itens</CardTitle>
          {items.map((item, i) => (
            <ItemRow key={i}>
              <FormGroup style={{ flex: 2, marginBottom: 0 }}>
                <Label>Produto</Label>
                <Select value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)}>
                  <option value="">Selecione...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) - {formatCurrency(p.salePrice)}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup style={{ flex: 1, marginBottom: 0 }}>
                <Label>IMEI</Label>
                <Input value={item.imei} onChange={(e) => updateItem(i, 'imei', e.target.value)} placeholder="IMEI" />
              </FormGroup>
              <FormGroup style={{ width: 70, marginBottom: 0 }}>
                <Label>Qtd</Label>
                <Input value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} type="number" min="1" />
              </FormGroup>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem' }}>
                <input type="checkbox" checked={item.isFreebie} onChange={(e) => updateItem(i, 'isFreebie', e.target.checked)} />
                Brinde
              </label>
              {items.length > 1 && (
                <Button type="button" $variant="ghost" $size="sm" onClick={() => removeItem(i)}>
                  <X size={14} />
                </Button>
              )}
            </ItemRow>
          ))}
          <Button type="button" $variant="outline" $size="sm" onClick={addItem}>
            <Plus size={14} /> Adicionar Item
          </Button>
        </Section>

        <Section>
          <FormGroup>
            <Label>Desconto (R$)</Label>
            <Input value={discount} onChange={(e) => setDiscount(e.target.value)} type="number" step="0.01" style={{ maxWidth: 200 }} />
          </FormGroup>
        </Section>

        <Section>
          <CardTitle>Pagamentos</CardTitle>
          {payments.map((p, i) => (
            <ItemRow key={i}>
              <FormGroup style={{ flex: 1, marginBottom: 0 }}>
                <Label>Metodo</Label>
                <Select value={p.method} onChange={(e) => updatePayment(i, 'method', e.target.value)}>
                  <option value="">Selecione...</option>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup style={{ width: 140, marginBottom: 0 }}>
                <Label>Valor</Label>
                <Input value={p.amount} onChange={(e) => updatePayment(i, 'amount', e.target.value)} type="number" step="0.01" />
              </FormGroup>
              <FormGroup style={{ width: 80, marginBottom: 0 }}>
                <Label>Parcelas</Label>
                <Input value={p.installments} onChange={(e) => updatePayment(i, 'installments', e.target.value)} type="number" min="1" />
              </FormGroup>
              {p.method === 'BUYBACK' && (
                <FormGroup style={{ width: 120, marginBottom: 0 }}>
                  <Label>ID Retoma</Label>
                  <Input value={p.buybackProductId} onChange={(e) => updatePayment(i, 'buybackProductId', e.target.value)} type="number" />
                </FormGroup>
              )}
              {payments.length > 1 && (
                <Button type="button" $variant="ghost" $size="sm" onClick={() => removePayment(i)}>
                  <X size={14} />
                </Button>
              )}
            </ItemRow>
          ))}
          <Button type="button" $variant="outline" $size="sm" onClick={addPayment}>
            <Plus size={14} /> Adicionar Pagamento
          </Button>
        </Section>

        <FormGroup>
          <Label>Observacoes</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observacoes (opcional)" />
        </FormGroup>

        <TotalBar>
          <span>Total: {formatCurrency(netTotal)}</span>
        </TotalBar>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button type="button" $variant="ghost" onClick={() => navigate('/vendas')}>Cancelar</Button>
          <Button type="button" $variant="outline" onClick={() => budgetMutation.mutate()} disabled={budgetMutation.isPending}>
            Salvar como Orcamento
          </Button>
          <Button type="button" onClick={() => checkoutMutation.mutate()} disabled={checkoutMutation.isPending}>
            Finalizar Venda
          </Button>
        </div>
      </Card>
    </>
  );
}
