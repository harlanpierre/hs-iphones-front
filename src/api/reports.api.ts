import api from './axios';
import toast from 'react-hot-toast';

type ExportFormat = 'pdf' | 'excel';

function getFilenameFromResponse(
  headers: Record<string, string>,
  fallback: string
): string {
  const disposition = headers['content-disposition'];
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match?.[1]) {
      return match[1].replace(/['"]/g, '');
    }
  }
  return fallback;
}

function getDefaultFilename(prefix: string, format: ExportFormat): string {
  const date = new Date().toISOString().slice(0, 10);
  const ext = format === 'pdf' ? 'pdf' : 'xlsx';
  return `${prefix}_${date}.${ext}`;
}

async function downloadReport(
  url: string,
  params: Record<string, string | boolean | undefined>,
  filePrefix: string,
  format: ExportFormat
): Promise<void> {
  try {
    const response = await api.get(url, {
      params,
      responseType: 'blob',
    });

    const filename = getFilenameFromResponse(
      response.headers as Record<string, string>,
      getDefaultFilename(filePrefix, format)
    );

    const blob = new Blob([response.data]);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch {
    toast.error('Erro ao exportar relatorio. Tente novamente.');
  }
}

export const reportsApi = {
  exportSales(params: {
    format: ExportFormat;
    dateFrom: string;
    dateTo: string;
    status?: string;
  }): Promise<void> {
    return downloadReport(
      '/reports/sales',
      {
        format: params.format,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        status: params.status || undefined,
      },
      'vendas',
      params.format
    );
  },

  exportStock(params: {
    format: ExportFormat;
    category?: string;
    lowStockOnly?: boolean;
  }): Promise<void> {
    return downloadReport(
      '/reports/stock',
      {
        format: params.format,
        category: params.category || undefined,
        lowStockOnly: params.lowStockOnly ?? undefined,
      },
      'estoque',
      params.format
    );
  },

  exportServiceOrders(params: {
    format: ExportFormat;
    dateFrom: string;
    dateTo: string;
    status?: string;
  }): Promise<void> {
    return downloadReport(
      '/reports/service-orders',
      {
        format: params.format,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        status: params.status || undefined,
      },
      'ordens_servico',
      params.format
    );
  },

  exportFinancial(params: {
    format: ExportFormat;
    dateFrom: string;
    dateTo: string;
  }): Promise<void> {
    return downloadReport(
      '/reports/financial',
      {
        format: params.format,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      },
      'financeiro',
      params.format
    );
  },
};
