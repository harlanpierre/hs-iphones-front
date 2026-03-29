import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { productsApi } from '../../api/products.api';
import { PageHeader } from '../../components/shared/page-header';
import { ProductStatusBadge } from '../../components/shared/status-badge';
import { Card } from '../../components/ui/Card';
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Field = styled.div``;

const FieldLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.125rem;
`;

const FieldValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
`;

const ImeiList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const ImeiTag = styled.span`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.25rem 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['products', Number(id)],
    queryFn: () => productsApi.findById(Number(id)),
  });

  if (isLoading || !product) return <p>Carregando...</p>;

  return (
    <>
      <PageHeader
        title={product.name}
        buttonLabel="Editar"
        onButtonClick={() => navigate(`/produtos/${id}/editar`)}
      />

      <Card>
        <Grid>
          <Field>
            <FieldLabel>SKU</FieldLabel>
            <FieldValue>{product.sku}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Categoria</FieldLabel>
            <FieldValue>{PRODUCT_CATEGORY_LABELS[product.category]}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <ProductStatusBadge status={product.status} />
          </Field>
          <Field>
            <FieldLabel>Quantidade</FieldLabel>
            <FieldValue>{product.quantity}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Preco de Compra</FieldLabel>
            <FieldValue>{formatCurrency(product.purchasePrice)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Preco de Venda</FieldLabel>
            <FieldValue>{formatCurrency(product.salePrice)}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Garantia</FieldLabel>
            <FieldValue>{product.warrantyDays ? `${product.warrantyDays} dias` : '-'}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Fornecedor</FieldLabel>
            <FieldValue>{product.supplier?.name || '-'}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Cliente (BuyBack)</FieldLabel>
            <FieldValue>{product.client?.name || '-'}</FieldValue>
          </Field>
          {product.compatibleModel && (
            <Field>
              <FieldLabel>Modelo Compativel</FieldLabel>
              <FieldValue>{product.compatibleModel}</FieldValue>
            </Field>
          )}
        </Grid>

        {product.imeis && product.imeis.length > 0 && (
          <div>
            <FieldLabel>IMEIs</FieldLabel>
            <ImeiList>
              {product.imeis.map((imei) => (
                <ImeiTag key={imei}>{imei}</ImeiTag>
              ))}
            </ImeiList>
          </div>
        )}
      </Card>
    </>
  );
}
