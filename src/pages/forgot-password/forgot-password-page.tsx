import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Smartphone, CheckCircle } from 'lucide-react';
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

const SuccessBox = styled.div`
  background: ${({ theme }) => theme.colors.successLight};
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;

  p {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    margin: 0;
  }
`;

const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
`;

const schema = z.object({
  email: z.string().email('Informe um e-mail valido.'),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao solicitar recuperacao. Tente novamente.';
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
          <h1>Recuperar Senha</h1>
          {!sent && <p>Informe seu e-mail para receber o link de recuperacao.</p>}
        </LogoArea>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <Button type="submit" $fullWidth disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        ) : (
          <SuccessBox>
            <SuccessIcon>
              <CheckCircle size={40} />
            </SuccessIcon>
            <p>
              Se o e-mail estiver cadastrado, voce recebera as instrucoes
              para redefinir sua senha em instantes.
            </p>
            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', opacity: 0.7 }}>
              Verifique tambem a pasta de spam.
            </p>
          </SuccessBox>
        )}

        <BackLink>
          <Link to="/login">Voltar ao login</Link>
        </BackLink>
      </Card>
    </Container>
  );
}
