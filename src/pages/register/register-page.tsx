import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Smartphone } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { Input, FormGroup, Label, ErrorText } from '../../components/ui/Input';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const RegisterCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 400px;
`;

const LogoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = z.object({
  tenantName: z.string().min(3, 'Nome da empresa deve ter no minimo 3 caracteres.'),
  name: z.string().min(3, 'Nome completo deve ter no minimo 3 caracteres.'),
  email: z.string().email('E-mail invalido.'),
  username: z.string().min(3, 'Usuario deve ter no minimo 3 caracteres.'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres.'),
});

type RegisterFormData = z.infer<typeof schema>;

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authApi.register({
        ...data,
        role: 'ADMIN',
      });
      toast.success('Conta criada com sucesso! Faca login para continuar.');
      navigate('/login');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <LogoArea>
          <IconWrapper>
            <Smartphone size={24} />
          </IconWrapper>
          <h1>Criar Conta</h1>
          <p>Cadastre sua empresa para comecar</p>
        </LogoArea>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="tenantName">Nome da Empresa</Label>
            <Input
              id="tenantName"
              type="text"
              placeholder="Digite o nome da empresa"
              {...register('tenantName')}
              $hasError={!!errors.tenantName}
            />
            {errors.tenantName && <ErrorText>{errors.tenantName.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              {...register('name')}
              $hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              {...register('email')}
              $hasError={!!errors.email}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuario"
              {...register('username')}
              $hasError={!!errors.username}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
              $hasError={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <Button type="submit" $fullWidth disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <LoginLink>
          <Link to="/login">Ja tem conta? Faca login</Link>
        </LoginLink>
      </RegisterCard>
    </Container>
  );
}
