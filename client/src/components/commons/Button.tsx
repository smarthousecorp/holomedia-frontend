import React from "react";
import styled, {css} from "styled-components";
// 폴더 인식이 안되서 잠깐 주석추가
interface buttonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  width?: string;
  disabled?: boolean;
  onClick(): void;
  outline?: boolean | string;
  radius?: string;
  padding?: string;
}

const Button = (props: buttonProps) => {
  const {
    children,
    width,
    onClick,
    type = "button",
    disabled = false,
    outline = false,
    radius = "1rem",
    padding = "1.2rem 1.6rem",
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
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<buttonProps>`
  font-family: "Pretendard-Medium";
  border: none;
  background-color: #ee3453;
  color: white;
  transition: 0.1s all;
  cursor: pointer;
  margin: 0 auto;
  border-radius: ${({radius}) => radius};
  padding: ${({padding}) => padding};

  &:hover {
    background-color: #ff627c;
  }

  ${({width}) =>
    width &&
    css`
      display: block;
      width: ${width};
    `}
  ${({outline}) =>
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

  ${({disabled}) =>
    disabled &&
    css`
      background-color: lightgray;
      cursor: not-allowed;

      &:hover {
        background-color: lightgray;
      }
    `}
`;

export default Button;
