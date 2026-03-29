import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { usersApi } from '../../api/users.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, ErrorText, FormGroup } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { UserRequest } from '../../types/user.types';

const createSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio.'),
  email: z.string().email('E-mail invalido.').or(z.literal('')).optional(),
  username: z.string().min(1, 'Usuario e obrigatorio.'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres.'),
  role: z.enum(['ADMIN', 'VENDEDOR', 'TECNICO'], { required_error: 'Perfil e obrigatorio.' }),
});

const editSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio.'),
  email: z.string().email('E-mail invalido.').or(z.literal('')).optional(),
  username: z.string().min(1, 'Usuario e obrigatorio.'),
  password: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: 'Senha deve ter no minimo 6 caracteres.',
  }),
  role: z.enum(['ADMIN', 'VENDEDOR', 'TECNICO'], { required_error: 'Perfil e obrigatorio.' }),
});

type FormData = z.infer<typeof createSchema>;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export function UserFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['users', Number(id)],
    queryFn: () => usersApi.findById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email ?? '',
        username: user.username,
        password: '',
        role: user.role,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload: UserRequest = {
        name: data.name,
        email: data.email || undefined,
        username: data.username,
        role: data.role,
      };
      if (data.password) {
        payload.password = data.password;
      }
      return isEdit ? usersApi.update(Number(id), payload) : usersApi.create(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Usuario atualizado.' : 'Usuario cadastrado.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/usuarios');
    },
    onError: () => {
      toast.error('Erro ao salvar usuario.');
    },
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Usuario' : 'Novo Usuario'} />
      <Card style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <Row>
            <FormGroup>
              <Label>Nome Completo *</Label>
              <Input {...register('name')} $hasError={!!errors.name} placeholder="Nome completo" />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>E-mail</Label>
              <Input type="email" {...register('email')} $hasError={!!errors.email} placeholder="E-mail do usuario" />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Usuario *</Label>
              <Input {...register('username')} $hasError={!!errors.username} placeholder="Nome de usuario" />
              {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>{isEdit ? 'Senha' : 'Senha *'}</Label>
              <Input
                type="password"
                {...register('password')}
                $hasError={!!errors.password}
                placeholder={isEdit ? 'Deixe em branco para manter' : 'Minimo 6 caracteres'}
              />
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Perfil *</Label>
              <Select {...register('role')} $hasError={!!errors.role}>
                <option value="">Selecione...</option>
                <option value="ADMIN">Admin</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="TECNICO">Tecnico</option>
              </Select>
              {errors.role && <ErrorText>{errors.role.message}</ErrorText>}
            </FormGroup>
          </Row>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" $variant="ghost" onClick={() => navigate('/usuarios')}>
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
