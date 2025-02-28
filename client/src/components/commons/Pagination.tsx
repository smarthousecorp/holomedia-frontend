import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // 페이지 번호 범위 계산 (최대 5개 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 표시할 페이지 수가 maxPagesToShow보다 작은 경우 시작 페이지 조정
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={18} />
      </PaginationButton>

      {getPageNumbers().map((page) => (
        <PageNumber
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageNumber>
      ))}

      <PaginationButton
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage >= totalPages}
      >
        <ChevronRight size={18} />
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
  padding: 0 12px;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: white;
  cursor: pointer;
  color: #4b5563;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }
`;

const PageNumber = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.active ? "#eb3553" : "#e5e7eb")};
  background-color: ${(props) => (props.active ? "#eb3553" : "white")};
  color: ${(props) => (props.active ? "white" : "#4b5563")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;

  &:hover:not(:active) {
    background-color: ${(props) => (props.active ? "#eb3553" : "#f3f4f6")};
  }
`;
