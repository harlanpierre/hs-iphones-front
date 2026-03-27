import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../ui/Table';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string | number;
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PageInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ClickableRow = styled(Tr)<{ $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export function DataTable<T>({
  columns,
  data,
  page,
  totalPages,
  totalElements,
  onPageChange,
  isLoading,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const renderCell = (row: T, col: Column<T>) => {
    if (typeof col.accessor === 'function') {
      return col.accessor(row);
    }
    const value = row[col.accessor];
    return value != null ? String(value) : '-';
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {columns.map((col, i) => (
              <Th key={i} style={{ width: col.width }}>
                {col.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Tr key={i}>
                {columns.map((_, j) => (
                  <Td key={j}>
                    <Skeleton $height="1.25rem" />
                  </Td>
                ))}
              </Tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState>Nenhum resultado encontrado.</EmptyState>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <ClickableRow
                key={keyExtractor(row)}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, j) => (
                  <Td key={j}>{renderCell(row, col)}</Td>
                ))}
              </ClickableRow>
            ))
          )}
        </Tbody>
      </Table>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageInfo>
            Pagina {page + 1} de {totalPages}
            {totalElements != null && ` (${totalElements} registros)`}
          </PageInfo>
          <PageButtons>
            <Button
              $variant="outline"
              $size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              $variant="outline"
              $size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </PageButtons>
        </PaginationContainer>
      )}
    </TableContainer>
  );
}
