// src/components/common/Button.tsx
import React from "react";
import styled, { css } from "styled-components";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  width?: string;
  disabled?: boolean;
  onClick(): void;
  outline?: boolean | string;
  radius?: string;
  padding?: string;
  variant?: "modal-cancel" | "modal-action"; // 모달용 variant 추가
}

const Button = (props: ButtonProps) => {
  const {
    children,
    width,
    onClick,
    type = "button",
    disabled = false,
    outline = false,
    radius = "1rem",
    padding = "1.2rem 1.6rem",
    variant,
  } = props;

  return (
    <StyledButton
      type={type}
      width={width}
      disabled={disabled}
      onClick={onClick}
      outline={outline.toString()}
      radius={radius}
      padding={padding}
      variant={variant}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonProps>`
  font-family: "Pretendard-Medium";
  border: none;
  background-color: #ee3453;
  color: white;
  transition: 0.1s all;
  cursor: pointer;
  margin: 0 auto;
  border-radius: ${({ radius }) => radius};
  padding: ${({ padding }) => padding};

  &:hover {
    background-color: #ff627c;
  }

  ${({ width }) =>
    width &&
    css`
      display: block;
      width: ${width};
    `}

  ${({ outline }) =>
    outline === "true" &&
    css`
      background-color: white;
      border: 1px solid #ee3453;
      color: #ee3453;

      &:hover {
        color: white;
        background-color: var(--color-point-hover);
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: lightgray;
      cursor: not-allowed;

      &:hover {
        background-color: lightgray;
      }
    `}

  ${({ variant }) =>
    variant === "modal-cancel" &&
    css`
      background-color: white;
      border: 1px solid #ddd;
      color: #666;
      padding: 8px 16px;
      margin: 0;

      &:hover {
        background-color: #f5f5f5;
      }
    `}

  ${({ variant }) =>
    variant === "modal-action" &&
    css`
      background-color: #ee3453;
      color: white;
      padding: 8px 16px;
      margin: 0;

      &:hover {
        background-color: #ff627c;
      }
    `}
`;

export default Button;
