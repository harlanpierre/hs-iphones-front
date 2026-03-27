import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { repairsApi } from '../../api/repairs.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, FormGroup, TextArea } from '../../components/ui/Input';

const PartRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-bottom: 0.75rem;
`;

interface PartForm {
  partId: string;
  quantity: string;
}

export function RepairFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [phoneId, setPhoneId] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [laborDescription, setLaborDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState<PartForm[]>([{ partId: '', quantity: '1' }]);

  const mutation = useMutation({
    mutationFn: () =>
      repairsApi.create({
        phoneId: Number(phoneId),
        parts: parts.filter((p) => p.partId).map((p) => ({
          partId: Number(p.partId),
          quantity: Number(p.quantity) || 1,
        })),
        laborCost: laborCost ? Number(laborCost) : undefined,
        laborDescription: laborDescription || undefined,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      toast.success('Reparo registrado.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/reparos');
    },
  });

  const addPart = () => setParts([...parts, { partId: '', quantity: '1' }]);
  const removePart = (i: number) => setParts(parts.filter((_, idx) => idx !== i));
  const updatePart = (i: number, field: keyof PartForm, value: string) => {
    const copy = [...parts];
    copy[i][field] = value;
    setParts(copy);
  };

  return (
    <>
      <PageHeader title="Novo Reparo Interno" />
      <Card style={{ maxWidth: 600 }}>
        <FormGroup>
          <Label>ID do Telefone (BuyBack) *</Label>
          <Input value={phoneId} onChange={(e) => setPhoneId(e.target.value)} type="number" placeholder="ID do produto com status IN_REPAIR" />
        </FormGroup>

        <CardTitle style={{ marginBottom: '0.75rem' }}>Pecas</CardTitle>
        {parts.map((p, i) => (
          <PartRow key={i}>
            <FormGroup style={{ flex: 2, marginBottom: 0 }}>
              <Label>ID da Peca</Label>
              <Input value={p.partId} onChange={(e) => updatePart(i, 'partId', e.target.value)} type="number" placeholder="ID da peca" />
            </FormGroup>
            <FormGroup style={{ width: 80, marginBottom: 0 }}>
              <Label>Qtd</Label>
              <Input value={p.quantity} onChange={(e) => updatePart(i, 'quantity', e.target.value)} type="number" min="1" />
            </FormGroup>
            {parts.length > 1 && (
              <Button type="button" $variant="ghost" $size="sm" onClick={() => removePart(i)}>
                <X size={14} />
              </Button>
            )}
          </PartRow>
        ))}
        <Button type="button" $variant="outline" $size="sm" onClick={addPart} style={{ marginBottom: '1rem' }}>
          <Plus size={14} /> Adicionar Peca
        </Button>

        <FormGroup>
          <Label>Custo Mao de Obra</Label>
          <Input value={laborCost} onChange={(e) => setLaborCost(e.target.value)} type="number" step="0.01" placeholder="R$ 0,00" />
        </FormGroup>

        <FormGroup>
          <Label>Descricao da Mao de Obra</Label>
          <Input value={laborDescription} onChange={(e) => setLaborDescription(e.target.value)} placeholder="Ex: Troca de tela terceirizada" />
        </FormGroup>

        <FormGroup>
          <Label>Observacoes</Label>
          <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observacoes adicionais..." />
        </FormGroup>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button type="button" $variant="ghost" onClick={() => navigate('/reparos')}>Cancelar</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Registrando...' : 'Registrar Reparo'}
          </Button>
        </div>
      </Card>
    </>
  );
}
