import { useNavigate, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import { Smartphone, Check } from 'lucide-react';
import { plansApi } from '../../api/plans.api';
import type { PlanResponse } from '../../types/subscription.types';
import { Button } from '../../components/ui/Button';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div<{ $highlighted?: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 2px solid ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme, $highlighted }) =>
    $highlighted ? theme.shadows.lg : theme.shadows.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  padding: 0.25rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PlanName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Price = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PriceValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const PricePeriod = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.5;
`;

const LimitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const LimitItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

function formatLimit(value: number, label: string): string {
  if (value >= 999999) {
    return `Ilimitado ${label}`;
  }
  return `Ate ${value.toLocaleString('pt-BR')} ${label}`;
}

function formatPrice(price: number): { value: string; period: string } {
  if (price === 0) {
    return { value: 'Gratis', period: '' };
  }
  const formatted = price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return { value: `R$ ${formatted}`, period: '/mes' };
}

function PlanCard({ plan }: { plan: PlanResponse }) {
  const navigate = useNavigate();
  const isHighlighted = plan.slug === 'pro';
  const price = formatPrice(plan.priceMonthly);

  const limits = [
    { value: plan.maxProducts, label: 'produtos' },
    { value: plan.maxClients, label: 'clientes' },
    { value: plan.maxUsers, label: 'usuarios' },
    { value: plan.maxSalesPerMonth, label: 'vendas/mes' },
    { value: plan.maxServiceOrdersPerMonth, label: 'OS/mes' },
  ];

  return (
    <Card $highlighted={isHighlighted}>
      {isHighlighted && <RecommendedBadge>Recomendado</RecommendedBadge>}
      <PlanName>{plan.name}</PlanName>
      <Price>
        <PriceValue>{price.value}</PriceValue>
        {price.period && <PricePeriod>{price.period}</PricePeriod>}
      </Price>
      <Description>{plan.description}</Description>
      <LimitsList>
        {limits.map((limit) => (
          <LimitItem key={limit.label}>
            <Check size={16} />
            {formatLimit(limit.value, limit.label)}
          </LimitItem>
        ))}
      </LimitsList>
      <Button
        $variant={isHighlighted ? 'primary' : 'outline'}
        $fullWidth
        $size="lg"
        onClick={() => navigate('/register')}
      >
        Comecar agora
      </Button>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Grid>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i}>
          <SkeletonLine $width="60%" $height="1.5rem" />
          <SkeletonLine $width="40%" $height="2rem" />
          <SkeletonLine $width="100%" />
          <SkeletonLine $width="90%" />
          <div style={{ marginTop: '1rem' }}>
            <SkeletonLine $width="80%" />
            <SkeletonLine $width="75%" />
            <SkeletonLine $width="70%" />
            <SkeletonLine $width="85%" />
            <SkeletonLine $width="65%" />
          </div>
          <SkeletonLine $width="100%" $height="2.5rem" />
        </SkeletonCard>
      ))}
    </Grid>
  );
}

export function PlansPage() {
  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: plansApi.listPlans,
  });

  return (
    <Container>
      <Content>
        <Header>
          <LogoArea>
            <IconWrapper>
              <Smartphone size={20} />
            </IconWrapper>
            <LogoText>HS iPhones</LogoText>
          </LogoArea>
          <Title>Planos e Precos</Title>
          <Subtitle>Escolha o plano ideal para o seu negocio</Subtitle>
        </Header>

        {isLoading && <LoadingSkeleton />}

        {isError && (
          <ErrorMessage>
            Erro ao carregar os planos. Tente novamente mais tarde.
          </ErrorMessage>
        )}

        {plans && (
          <Grid>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </Grid>
        )}

        <Footer>
          <LoginLink to="/login">Ja tem conta? Faca login</LoginLink>
        </Footer>
      </Content>
    </Container>
  );
}
