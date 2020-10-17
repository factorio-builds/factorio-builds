import styled from "styled-components"

export const Square = styled.div`
  position: relative;
  box-sizing: border-box;
  background: #fff;
  width: 34px;
  height: 34px;
  border: 2px solid #424242;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    background: transparent;
  }
`

export const HiddenCheckbox = styled.input`
  display: none;
`

export const Label = styled.label`
  display: flex;
  align-items: center;

  font-weight: 700;

  &.is-inline {
    font-weight: 400;
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin: 8px 0;

  &:hover ${Square} {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:hover ${Square}::after {
    background: #e3e3e3;
  }

  &:focus-within ${Square} {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }

  &.is-checked ${Square}::after {
    background: #8fcd5b;
  }

  .is-error ${Square} {
    border-color: #f24439 !important;
  }
`

export const Text = styled.div`
  margin-left: 16px;
`
