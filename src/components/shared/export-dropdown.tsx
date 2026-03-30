import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FileDown, Loader2 } from 'lucide-react';

interface ExportDropdownProps {
  onExport: (format: 'pdf' | 'excel') => void;
  loading?: boolean;
  disabled?: boolean;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: border-color 0.15s, box-shadow 0.15s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }

  svg.spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 50;
  min-width: 160px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export function ExportDropdown({ onExport, loading, disabled }: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (format: 'pdf' | 'excel') => {
    setOpen(false);
    onExport(format);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <TriggerButton
        type="button"
        $disabled={disabled || loading}
        disabled={disabled || loading}
        onClick={() => setOpen((prev) => !prev)}
      >
        {loading ? (
          <Loader2 size={16} className="spinner" />
        ) : (
          <FileDown size={16} />
        )}
        Exportar
      </TriggerButton>

      {open && (
        <Dropdown>
          <DropdownItem onClick={() => handleSelect('pdf')}>
            PDF
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect('excel')}>
            Excel (XLSX)
          </DropdownItem>
        </Dropdown>
      )}
    </Wrapper>
  );
}
