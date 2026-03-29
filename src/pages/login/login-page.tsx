import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import styled from 'styled-components';
import { Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
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

const LoginCard = styled.div`
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

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterLink = styled.div`
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

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch {
      setError('Usuario ou senha invalidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <LogoArea>
          <IconWrapper>
            <Smartphone size={24} />
          </IconWrapper>
          <h1>HS iPhones</h1>
          <p>Acesse sua conta</p>
        </LogoArea>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              $hasError={!!error}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $hasError={!!error}
            />
          </FormGroup>

          {error && <ErrorText style={{ marginBottom: '1rem' }}>{error}</ErrorText>}

          <Button type="submit" $fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <ForgotPasswordLink>
            <Link to="/forgot-password">Esqueceu sua senha?</Link>
          </ForgotPasswordLink>
        </form>

        <RegisterLink>
          <Link to="/register">Nao tem conta? Criar conta</Link>
        </RegisterLink>
      </LoginCard>
    </Container>
  );
}
