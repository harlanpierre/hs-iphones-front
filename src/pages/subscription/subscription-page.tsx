import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { plansApi } from '../../api/plans.api';
import type { PlanResponse, SubscriptionResponse } from '../../types/subscription.types';
import { PageHeader } from '../../components/shared/page-header';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency } from '../../lib/utils';

const SectionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatusBadge = styled.span<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

const PlanName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const UsageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const UsageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const UsageLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UsageName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const UsageValues = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressOuter = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
`;

const ProgressInner = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => Math.min($width, 100)}%;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: width 0.3s ease;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const PlanCard = styled.div<{ $isCurrent: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 2px solid ${({ theme, $isCurrent }) => $isCurrent ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
`;

const PlanCardName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const PlanCardPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const PlanCardPriceSuffix = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PlanCardLimits = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const PlanCardLimit = styled.li`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CurrentPlanBadge = styled.div`
  position: absolute;
  top: -0.75rem;
  right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UNLIMITED_THRESHOLD = 999999;

function isUnlimited(value: number): boolean {
  return value >= UNLIMITED_THRESHOLD;
}

function getProgressColor(current: number, max: number): string {
  if (isUnlimited(max)) return '#16a34a';
  const ratio = current / max;
  if (ratio > 0.9) return '#dc2626';
  if (ratio >= 0.7) return '#d97706';
  return '#16a34a';
}

function getStatusBadge(status: string): { color: string; bg: string; label: string } {
  switch (status) {
    case 'ACTIVE':
      return { color: '#16a34a', bg: '#dcfce7', label: 'Ativo' };
    case 'TRIAL':
      return { color: '#d97706', bg: '#fef3c7', label: 'Trial' };
    case 'EXPIRED':
      return { color: '#dc2626', bg: '#fee2e2', label: 'Expirado' };
    case 'CANCELED':
      return { color: '#dc2626', bg: '#fee2e2', label: 'Cancelado' };
    case 'SUSPENDED':
      return { color: '#dc2626', bg: '#fee2e2', label: 'Suspenso' };
    default:
      return { color: '#d97706', bg: '#fef3c7', label: status };
  }
}

function formatLimit(value: number): string {
  if (isUnlimited(value)) return 'Ilimitado';
  return String(value);
}

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
}

function UsageBar({ label, current, max }: UsageBarProps) {
  const unlimited = isUnlimited(max);
  const percentage = unlimited ? 100 : max > 0 ? (current / max) * 100 : 0;
  const color = getProgressColor(current, max);

  return (
    <UsageItem>
      <UsageLabel>
        <UsageName>{label}</UsageName>
        <UsageValues>
          {current} / {unlimited ? 'Ilimitado' : max}
        </UsageValues>
      </UsageLabel>
      <ProgressOuter>
        <ProgressInner $width={percentage} $color={color} />
      </ProgressOuter>
    </UsageItem>
  );
}

export function SubscriptionPage() {
  const queryClient = useQueryClient();

  const { data: subscription, isLoading: loadingSubscription } = useQuery<SubscriptionResponse>({
    queryKey: ['subscription'],
    queryFn: plansApi.getSubscription,
  });

  const { data: plans, isLoading: loadingPlans } = useQuery<PlanResponse[]>({
    queryKey: ['plans'],
    queryFn: plansApi.listPlans,
  });

  const mutation = useMutation({
    mutationFn: (planId: number) => plansApi.changePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Plano alterado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao alterar plano.');
    },
  });

  const isLoading = loadingSubscription || loadingPlans;

  return (
    <>
      <PageHeader title="Assinatura" />

      {/* Minha Assinatura */}
      <SectionCard>
        <SectionHeader>
          <CardTitle>Minha Assinatura</CardTitle>
        </SectionHeader>

        {loadingSubscription ? (
          <LoadingContainer>
            <Skeleton $width="200px" $height="2rem" />
            <Skeleton $width="100%" $height="0.5rem" />
            <Skeleton $width="100%" $height="0.5rem" />
            <Skeleton $width="100%" $height="0.5rem" />
          </LoadingContainer>
        ) : subscription ? (
          <>
            <PlanHeader>
              <PlanName>{subscription.plan.name}</PlanName>
              <StatusBadge
                $color={getStatusBadge(subscription.status).color}
                $bg={getStatusBadge(subscription.status).bg}
              >
                {getStatusBadge(subscription.status).label}
              </StatusBadge>
            </PlanHeader>

            <UsageGrid>
              <UsageBar
                label="Produtos"
                current={subscription.usage.products}
                max={subscription.plan.maxProducts}
              />
              <UsageBar
                label="Clientes"
                current={subscription.usage.clients}
                max={subscription.plan.maxClients}
              />
              <UsageBar
                label="Usuarios"
                current={subscription.usage.users}
                max={subscription.plan.maxUsers}
              />
              <UsageBar
                label="Vendas este mes"
                current={subscription.usage.salesThisMonth}
                max={subscription.plan.maxSalesPerMonth}
              />
              <UsageBar
                label="OS este mes"
                current={subscription.usage.serviceOrdersThisMonth}
                max={subscription.plan.maxServiceOrdersPerMonth}
              />
            </UsageGrid>
          </>
        ) : null}
      </SectionCard>

      {/* Alterar Plano */}
      <SectionCard>
        <SectionHeader>
          <CardTitle>Alterar Plano</CardTitle>
        </SectionHeader>

        {loadingPlans ? (
          <PlansGrid>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} $width="100%" $height="280px" />
            ))}
          </PlansGrid>
        ) : plans && plans.length > 0 ? (
          <PlansGrid>
            {plans.map((plan) => {
              const isCurrent = subscription?.plan.id === plan.id;
              return (
                <PlanCard key={plan.id} $isCurrent={isCurrent}>
                  {isCurrent && <CurrentPlanBadge>Plano Atual</CurrentPlanBadge>}
                  <PlanCardName>{plan.name}</PlanCardName>
                  <PlanCardPrice>
                    {plan.priceMonthly === 0
                      ? 'Gratuito'
                      : formatCurrency(plan.priceMonthly)}
                    {plan.priceMonthly > 0 && (
                      <PlanCardPriceSuffix> /mes</PlanCardPriceSuffix>
                    )}
                  </PlanCardPrice>
                  <PlanCardLimits>
                    <PlanCardLimit>
                      {formatLimit(plan.maxProducts)} produtos
                    </PlanCardLimit>
                    <PlanCardLimit>
                      {formatLimit(plan.maxClients)} clientes
                    </PlanCardLimit>
                    <PlanCardLimit>
                      {formatLimit(plan.maxUsers)} usuarios
                    </PlanCardLimit>
                    <PlanCardLimit>
                      {formatLimit(plan.maxSalesPerMonth)} vendas/mes
                    </PlanCardLimit>
                    <PlanCardLimit>
                      {formatLimit(plan.maxServiceOrdersPerMonth)} OS/mes
                    </PlanCardLimit>
                  </PlanCardLimits>
                  <Button
                    $variant={isCurrent ? 'secondary' : 'primary'}
                    $fullWidth
                    disabled={isCurrent || mutation.isPending}
                    onClick={() => mutation.mutate(plan.id)}
                  >
                    {isCurrent ? 'Plano Atual' : 'Selecionar'}
                  </Button>
                </PlanCard>
              );
            })}
          </PlansGrid>
        ) : null}
      </SectionCard>
    </>
  );
}
