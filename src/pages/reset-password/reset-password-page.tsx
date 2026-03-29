import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
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

const Card = styled.div`
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
    text-align: center;
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

const BackLink = styled.div`
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

const schema = z
  .object({
    token: z.string().min(1, 'Token e obrigatorio.'),
    newPassword: z.string().min(6, 'Senha deve ter no minimo 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirmacao de senha e obrigatoria.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas nao coincidem.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: searchParams.get('token') ?? '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await authApi.resetPassword(data.token, data.newPassword);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao redefinir senha. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <LogoArea>
          <IconWrapper>
            <Smartphone size={24} />
          </IconWrapper>
          <h1>Redefinir Senha</h1>
          <p>Informe o token recebido e sua nova senha.</p>
        </LogoArea>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('token')} />

          <FormGroup>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              {...register('newPassword')}
              $hasError={!!errors.newPassword}
            />
            {errors.newPassword && <ErrorText>{errors.newPassword.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              {...register('confirmPassword')}
              $hasError={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
          </FormGroup>

          <Button type="submit" $fullWidth disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>
        </form>

        <BackLink>
          <Link to="/login">Voltar ao login</Link>
        </BackLink>
      </Card>
    </Container>
  );
}
