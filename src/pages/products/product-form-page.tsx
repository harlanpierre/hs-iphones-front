import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Plus, X } from 'lucide-react';
import { productsApi } from '../../api/products.api';
import { PageHeader } from '../../components/shared/page-header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, ErrorText, FormGroup } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants';

const schema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio.'),
  description: z.string().optional(),
  sku: z.string().optional(),
  category: z.enum(['CELULAR', 'ACESSORIO', 'PECA', 'OUTROS'], { required_error: 'Categoria e obrigatoria.' }),
  purchasePrice: z.coerce.number().min(0, 'Preco de compra deve ser >= 0.'),
  salePrice: z.coerce.number().min(0.01, 'Preco de venda e obrigatorio.'),
  quantity: z.coerce.number().min(0, 'Quantidade deve ser >= 0.'),
  minStock: z.coerce.number().min(0).optional(),
  imeis: z.array(z.object({ value: z.string().min(1) })).optional(),
  compatibleModel: z.string().optional(),
  warrantyDays: z.coerce.number().min(0).optional(),
  supplierWarrantyStartDate: z.string().optional(),
  supplierWarrantyEndDate: z.string().optional(),
  repairCost: z.coerce.number().min(0).optional(),
  supplierId: z.coerce.number().optional(),
  clientId: z.coerce.number().optional(),
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

const ImeiRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ['products', Number(id)],
    queryFn: () => productsApi.findById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { imeis: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'imeis' });
  const category = watch('category');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        sku: product.sku || '',
        category: product.category,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        quantity: product.quantity,
        minStock: product.minStock || 0,
        imeis: product.imeis?.map((v) => ({ value: v })) || [],
        compatibleModel: product.compatibleModel || '',
        warrantyDays: product.warrantyDays || 0,
        supplierWarrantyStartDate: product.supplierWarrantyStartDate || '',
        supplierWarrantyEndDate: product.supplierWarrantyEndDate || '',
        repairCost: product.repairCost || 0,
        supplierId: product.supplier?.id,
        clientId: product.client?.id,
      });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        imeis: data.imeis?.map((i) => i.value).filter(Boolean),
      };
      return isEdit ? productsApi.update(Number(id), payload) : productsApi.create(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Produto atualizado.' : 'Produto cadastrado.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/produtos');
    },
  });

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Produto' : 'Novo Produto'} />
      <Card style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <FormGroup>
            <Label>Nome *</Label>
            <Input {...register('name')} $hasError={!!errors.name} placeholder="Nome do produto" />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Descricao</Label>
            <Input {...register('description')} placeholder="Descricao (opcional)" />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="Auto-gerado se vazio" />
            </FormGroup>
            <FormGroup>
              <Label>Categoria *</Label>
              <Select {...register('category')} $hasError={!!errors.category}>
                <option value="">Selecione...</option>
                {Object.entries(PRODUCT_CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
              {errors.category && <ErrorText>{errors.category.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Preco de Compra *</Label>
              <Input {...register('purchasePrice')} type="number" step="0.01" $hasError={!!errors.purchasePrice} />
              {errors.purchasePrice && <ErrorText>{errors.purchasePrice.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Preco de Venda *</Label>
              <Input {...register('salePrice')} type="number" step="0.01" $hasError={!!errors.salePrice} />
              {errors.salePrice && <ErrorText>{errors.salePrice.message}</ErrorText>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Quantidade *</Label>
              <Input {...register('quantity')} type="number" $hasError={!!errors.quantity} />
              {errors.quantity && <ErrorText>{errors.quantity.message}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Estoque Minimo</Label>
              <Input {...register('minStock')} type="number" />
            </FormGroup>
          </Row>

          {category === 'CELULAR' && (
            <FormGroup>
              <Label>IMEIs</Label>
              {fields.map((field, index) => (
                <ImeiRow key={field.id}>
                  <Input {...register(`imeis.${index}.value`)} placeholder="IMEI" style={{ flex: 1 }} />
                  <Button type="button" $variant="ghost" $size="sm" onClick={() => remove(index)}>
                    <X size={14} />
                  </Button>
                </ImeiRow>
              ))}
              <Button type="button" $variant="outline" $size="sm" onClick={() => append({ value: '' })}>
                <Plus size={14} /> Adicionar IMEI
              </Button>
            </FormGroup>
          )}

          {(category === 'PECA' || category === 'ACESSORIO') && (
            <FormGroup>
              <Label>Modelo Compativel</Label>
              <Input {...register('compatibleModel')} placeholder="Ex: iPhone 13 Pro Max" />
            </FormGroup>
          )}

          <Row>
            <FormGroup>
              <Label>Garantia (dias)</Label>
              <Input {...register('warrantyDays')} type="number" />
            </FormGroup>
            <FormGroup>
              <Label>Custo de Reparo</Label>
              <Input {...register('repairCost')} type="number" step="0.01" />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>ID Fornecedor</Label>
              <Input {...register('supplierId')} type="number" placeholder="ID do fornecedor (opcional)" />
            </FormGroup>
            <FormGroup>
              <Label>ID Cliente (BuyBack)</Label>
              <Input {...register('clientId')} type="number" placeholder="ID do cliente (opcional)" />
            </FormGroup>
          </Row>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" $variant="ghost" onClick={() => navigate('/produtos')}>
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
