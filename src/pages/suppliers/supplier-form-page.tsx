import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { suppliersApi } from '../../api/suppliers.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, ErrorText, FormGroup } from '../../components/ui/Input';

const schema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio.'),
  cpfCnpj: z.string().optional(),
  phone: z.string().min(1, 'Telefone e obrigatorio.'),
});

type FormData = z.infer<typeof schema>;

export function SupplierFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: supplier } = useQuery({
    queryKey: ['suppliers', Number(id)],
    queryFn: () => suppliersApi.findById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (supplier) {
      reset({ name: supplier.name, cpfCnpj: supplier.cpfCnpj || '', phone: supplier.phone });
    }
  }, [supplier, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? suppliersApi.update(Number(id), data) : suppliersApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Fornecedor atualizado.' : 'Fornecedor cadastrado.');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      navigate('/fornecedores');
    },
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'} />
      <Card style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <FormGroup>
            <Label>Nome *</Label>
            <Input {...register('name')} $hasError={!!errors.name} placeholder="Nome do fornecedor" />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>CPF/CNPJ</Label>
            <Input {...register('cpfCnpj')} placeholder="CPF ou CNPJ (opcional)" />
          </FormGroup>

          <FormGroup>
            <Label>Telefone *</Label>
            <Input {...register('phone')} $hasError={!!errors.phone} placeholder="(XX) XXXXX-XXXX" />
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
          </FormGroup>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button type="button" $variant="ghost" onClick={() => navigate('/fornecedores')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
