import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { serviceOrdersApi } from '../../api/service-orders.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, ErrorText, FormGroup, TextArea } from '../../components/ui/Input';

const schema = z.object({
  clientId: z.coerce.number().min(1, 'Cliente e obrigatorio.'),
  deviceModel: z.string().min(1, 'Modelo do aparelho e obrigatorio.'),
  deviceImeiSerial: z.string().optional(),
  reportedIssue: z.string().min(1, 'Problema relatado e obrigatorio.'),
});

type FormData = z.infer<typeof schema>;

export function ServiceOrderFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: serviceOrdersApi.create,
    onSuccess: (os) => {
      toast.success('OS criada.');
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      navigate(`/assistencia/${os.id}`);
    },
  });

  return (
    <>
      <PageHeader title="Nova Ordem de Servico" />
      <Card style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <FormGroup>
            <Label>ID do Cliente *</Label>
            <Input {...register('clientId')} type="number" $hasError={!!errors.clientId} placeholder="ID do cliente" />
            {errors.clientId && <ErrorText>{errors.clientId.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Modelo do Aparelho *</Label>
            <Input {...register('deviceModel')} $hasError={!!errors.deviceModel} placeholder="Ex: iPhone 13 Pro Max" />
            {errors.deviceModel && <ErrorText>{errors.deviceModel.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>IMEI / Serial</Label>
            <Input {...register('deviceImeiSerial')} placeholder="IMEI ou numero de serie (opcional)" />
          </FormGroup>

          <FormGroup>
            <Label>Problema Relatado *</Label>
            <TextArea {...register('reportedIssue')} $hasError={!!errors.reportedIssue} placeholder="Descreva o problema..." />
            {errors.reportedIssue && <ErrorText>{errors.reportedIssue.message}</ErrorText>}
          </FormGroup>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button type="button" $variant="ghost" onClick={() => navigate('/assistencia')}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Criando...' : 'Criar OS'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
