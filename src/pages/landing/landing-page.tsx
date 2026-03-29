import { Link } from 'react-router';
import styled from 'styled-components';
import {
  Smartphone,
  ShoppingCart,
  Wrench,
  Package,
  Users,
  Hammer,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Check,
} from 'lucide-react';

// ── Navbar ──────────────────────────────────────────────

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const NavLogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.25rem;
  }
`;

const NavLink = styled(Link)<{ $variant?: 'primary' | 'ghost' }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.colors.primary};
    color: #fff;
    &:hover { background: ${theme.colors.primaryHover}; }
  `
      : `
    color: ${theme.colors.textSecondary};
    &:hover { color: ${theme.colors.text}; background: ${theme.colors.primaryLight}; }
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem 0.625rem;
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

// ── Hero ────────────────────────────────────────────────

const HeroSection = styled.section`
  padding: 8rem ${({ theme }) => theme.spacing.lg} 5rem;
  text-align: center;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.bg} 100%);
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)<{ $variant?: 'primary' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === 'outline'
      ? `
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    background: #fff;
    &:hover { border-color: ${theme.colors.primary}; color: ${theme.colors.primary}; }
  `
      : `
    color: #fff;
    background: ${theme.colors.primary};
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    &:hover { background: ${theme.colors.primaryHover}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35); }
  `}
`;

// ── Features ────────────────────────────────────────────

const Section = styled.section<{ $bg?: string }>`
  padding: 5rem ${({ theme }) => theme.spacing.lg};
  background: ${({ $bg, theme }) => $bg || theme.colors.bg};
`;

const SectionInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

// ── Benefits ────────────────────────────────────────────

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  text-align: center;
`;

const BenefitIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`;

const BenefitTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BenefitDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

// ── CTA ─────────────────────────────────────────────────

const CTASection = styled.section`
  padding: 5rem ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgSidebar};
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CTASubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAFeatures = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CTAFeature = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    color: ${({ theme }) => theme.colors.success};
  }
`;

// ── Footer ──────────────────────────────────────────────

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgCard};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ── Data ────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <ShoppingCart size={24} />,
    title: 'Vendas e PDV',
    desc: 'Ponto de venda completo com orcamentos, reservas, pagamentos divididos e emissao de recibos.',
  },
  {
    icon: <Wrench size={24} />,
    title: 'Assistencia Tecnica',
    desc: 'Ordens de servico com acompanhamento completo, do recebimento a entrega ao cliente.',
  },
  {
    icon: <Package size={24} />,
    title: 'Controle de Estoque',
    desc: 'Gestao de produtos com rastreamento IMEI, categorias, SKU automatico e historico de movimentacoes.',
  },
  {
    icon: <Users size={24} />,
    title: 'Gestao de Clientes',
    desc: 'Cadastro completo de clientes com endereco, historico de compras e ordens de servico.',
  },
  {
    icon: <Hammer size={24} />,
    title: 'Reparos Internos',
    desc: 'Controle de reparos em aparelhos proprios com consumo de pecas e custo de mao de obra.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Dashboard Gerencial',
    desc: 'Visao geral do negocio com indicadores de vendas, estoque e servicos em tempo real.',
  },
];

// ── Component ───────────────────────────────────────────

export function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <Nav>
        <NavInner>
          <NavLogo to="/">
            <NavLogoIcon>
              <Smartphone size={18} />
            </NavLogoIcon>
            HS iPhones
          </NavLogo>
          <NavLinks>
            <NavLink to="/planos" $variant="ghost">Precos</NavLink>
            <NavLink to="/login" $variant="ghost">Entrar</NavLink>
            <NavLink to="/register" $variant="primary">Criar Conta</NavLink>
          </NavLinks>
        </NavInner>
      </Nav>

      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>
            <Zap size={14} />
            Sistema completo para lojas de celular
          </HeroBadge>
          <HeroTitle>
            Gerencie sua loja de <span>iPhones</span> em um so lugar
          </HeroTitle>
          <HeroSubtitle>
            Vendas, assistencia tecnica, estoque e reparos integrados.
            Simplifique sua operacao e foque no que importa: vender mais.
          </HeroSubtitle>
          <HeroActions>
            <HeroButton to="/register">
              Comecar gratuitamente
              <ArrowRight size={18} />
            </HeroButton>
            <HeroButton to="/planos" $variant="outline">
              Ver planos e precos
            </HeroButton>
          </HeroActions>
        </HeroContent>
      </HeroSection>

      {/* Features */}
      <Section>
        <SectionInner>
          <SectionHeader>
            <SectionTitle>Tudo que sua loja precisa</SectionTitle>
            <SectionSubtitle>
              Ferramentas especializadas para o dia a dia de quem vende e repara celulares
            </SectionSubtitle>
          </SectionHeader>
          <FeaturesGrid>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </SectionInner>
      </Section>

      {/* Benefits */}
      <Section $bg="#fff">
        <SectionInner>
          <SectionHeader>
            <SectionTitle>Por que escolher o HS iPhones?</SectionTitle>
          </SectionHeader>
          <BenefitsGrid>
            <BenefitItem>
              <BenefitIcon><Zap size={28} /></BenefitIcon>
              <BenefitTitle>Rapido e simples</BenefitTitle>
              <BenefitDesc>Interface intuitiva que sua equipe aprende em minutos, sem treinamento complexo.</BenefitDesc>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon><Shield size={28} /></BenefitIcon>
              <BenefitTitle>Seguro e confiavel</BenefitTitle>
              <BenefitDesc>Dados isolados por empresa, controle de acesso por perfil e backup automatico.</BenefitDesc>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon><Users size={28} /></BenefitIcon>
              <BenefitTitle>Multi-usuario</BenefitTitle>
              <BenefitDesc>Perfis de Admin, Vendedor e Tecnico com permissoes diferentes para cada funcao.</BenefitDesc>
            </BenefitItem>
          </BenefitsGrid>
        </SectionInner>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Pronto para modernizar sua loja?</CTATitle>
        <CTASubtitle>
          Comece gratis e faca upgrade quando precisar.
        </CTASubtitle>
        <CTAFeatures>
          <CTAFeature><Check size={16} /> Plano gratuito disponivel</CTAFeature>
          <CTAFeature><Check size={16} /> Sem cartao de credito</CTAFeature>
          <CTAFeature><Check size={16} /> Suporte incluso</CTAFeature>
        </CTAFeatures>
        <HeroButton to="/register" style={{ display: 'inline-flex' }}>
          Criar conta gratis
          <ArrowRight size={18} />
        </HeroButton>
      </CTASection>

      {/* Footer */}
      <Footer>
        <FooterText>
          HS iPhones &copy; {new Date().getFullYear()} — Sistema de gestao para lojas de celular
        </FooterText>
      </Footer>
    </>
  );
}
