import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { clientsApi } from '../../api/clients.api';
import { cepApi } from '../../api/cep.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, ErrorText, FormGroup } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const schema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio.'),
  cpf: z.string().min(11, 'CPF invalido.'),
  email: z.string().email('Email invalido.'),
  phone: z.string().optional(),
  address: z.object({
    zipCode: z.string().min(8, 'CEP e obrigatorio.'),
    street: z.string().min(1, 'Rua e obrigatoria.'),
    number: z.string().min(1, 'Numero e obrigatorio.'),
    complement: z.string().optional(),
    district: z.string().min(1, 'Bairro e obrigatorio.'),
    city: z.string().min(1, 'Cidade e obrigatoria.'),
    state: z.string().min(2, 'Estado e obrigatorio.'),
  }),
});

type FormData = z.infer<typeof schema>;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

export function ClientFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingCep, setLoadingCep] = useState(false);

  const { data: client } = useQuery({
    queryKey: ['clients', Number(id)],
    queryFn: () => clientsApi.findById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        cpf: client.cpf,
        email: client.email,
        phone: client.phone || '',
        address: {
          zipCode: client.address?.zipCode || '',
          street: client.address?.street || '',
          number: client.address?.number || '',
          complement: client.address?.complement || '',
          district: client.address?.district || '',
          city: client.address?.city || '',
          state: client.address?.state || '',
        },
      });
    }
  }, [client, reset]);

  const handleCepBlur = async (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setLoadingCep(true);
    try {
      const addr = await cepApi.lookup(digits);
      if (addr.street) setValue('address.street', addr.street);
      if (addr.district) setValue('address.district', addr.district);
      if (addr.city) setValue('address.city', addr.city);
      if (addr.state) setValue('address.state', addr.state);
    } catch {
      toast.error('CEP nao encontrado.');
    } finally {
      setLoadingCep(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? clientsApi.update(Number(id), data) : clientsApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Cliente atualizado.' : 'Cliente cadastrado.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clientes');
    },
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Cliente' : 'Novo Cliente'} />
      <Card style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <Row>
            <FormGroup>
              <Label>Nome *</Label>
              <Input {...register('name')} $hasError={!!errors.name} placeholder="Nome completo" />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>CPF *</Label>
              <Input {...register('cpf')} $hasError={!!errors.cpf} placeholder="000.000.000-00" />
              {errors.cpf && <ErrorText>{errors.cpf.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Email *</Label>
              <Input {...register('email')} $hasError={!!errors.email} placeholder="email@exemplo.com" />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Telefone</Label>
              <Input {...register('phone')} placeholder="(XX) XXXXX-XXXX" />
            </FormGroup>
          </Row>

          <SectionTitle>Endereco</SectionTitle>

          <Row>
            <FormGroup>
              <Label>CEP *</Label>
              <Input
                {...register('address.zipCode')}
                $hasError={!!errors.address?.zipCode}
                placeholder="00000-000"
                onBlur={(e) => handleCepBlur(e.target.value)}
                disabled={loadingCep}
              />
              {errors.address?.zipCode && <ErrorText>{errors.address.zipCode.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Rua *</Label>
              <Input {...register('address.street')} $hasError={!!errors.address?.street} placeholder="Rua / Avenida" />
              {errors.address?.street && <ErrorText>{errors.address.street.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Numero *</Label>
              <Input {...register('address.number')} $hasError={!!errors.address?.number} placeholder="Numero" />
              {errors.address?.number && <ErrorText>{errors.address.number.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Complemento</Label>
              <Input {...register('address.complement')} placeholder="Apto, sala, etc." />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Bairro *</Label>
              <Input {...register('address.district')} $hasError={!!errors.address?.district} placeholder="Bairro" />
              {errors.address?.district && <ErrorText>{errors.address.district.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Cidade *</Label>
              <Input {...register('address.city')} $hasError={!!errors.address?.city} placeholder="Cidade" />
              {errors.address?.city && <ErrorText>{errors.address.city.message}</ErrorText>}
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Estado *</Label>
            <Select {...register('address.state')} $hasError={!!errors.address?.state}>
              <option value="">Selecione...</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </Select>
            {errors.address?.state && <ErrorText>{errors.address.state.message}</ErrorText>}
          </FormGroup>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" $variant="ghost" onClick={() => navigate('/clientes')}>
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
