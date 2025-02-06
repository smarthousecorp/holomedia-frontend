import React from "react";
import { Check } from "lucide-react";
import styled, { keyframes } from "styled-components";

interface CustomCheckboxProps {
  checked: boolean;
  // onChange 타입을 기존 이벤트 핸들러와 호환되도록 수정
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string | React.ReactNode;
  name?: string;
  disabled?: boolean;
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  name,
  disabled = false,
}: CustomCheckboxProps) => {
  // 이벤트 핸들러를 그대로 전달
  return (
    <CheckboxLabel disabled={disabled}>
      <CheckboxInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      <CheckboxControl>
        <Check size={12} />
      </CheckboxControl>
      {label && <span>{label}</span>}
    </CheckboxLabel>
  );
};

export default CustomCheckbox;

const checkboxAppear = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const CheckboxLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: ${(props) => (props.disabled ? "#cccccc" : "#707070")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  user-select: none;

  &:hover {
    color: ${(props) => !props.disabled && "#eb3553"};
  }

  span {
    transition: color 0.2s;
  }
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: white;
  transition: all 0.2s ease;

  svg {
    color: white;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
  }

  ${CheckboxInput}:checked + & {
    background: #eb3553;
    border-color: #eb3553;

    svg {
      opacity: 1;
      transform: scale(1);
      animation: ${checkboxAppear} 0.2s ease;
    }
  }

  ${CheckboxInput}:focus + & {
    box-shadow: 0 0 0 2px rgba(235, 53, 83, 0.2);
  }

  ${CheckboxLabel}:hover:not([disabled]) & {
    border-color: #eb3553;
  }

  ${CheckboxInput}:disabled + & {
    background: #f0f0f0;
    border-color: #cccccc;
    cursor: not-allowed;
  }
`;
