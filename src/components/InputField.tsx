import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import Button02 from './Button02';
import { SeasonToggle } from '../components/Home/FilterContainer';

type InputFieldProps = {
  label: string;
  id: string;
  type?: string;
  error?: { message: string };
  buttonLabel?: string;
  // 타입 수정: 'yellow' | 'blue' | 'red'
  buttonColor?: 'yellow' | 'blue' | 'red';
  onButtonClick?: () => void;
  prefix?: string;
  prefixcontent?: string | React.ReactNode;
  as?: React.ElementType;
  isEmailField?: boolean;
  useToggle?: boolean;
  options?: string[];
  onSelectChange?: (value: string) => void;
  [key: string]: any;
};

function parsePrefixContent(content: string) {
  const tokens = content.split(/(해당없음|\(.*?\)|\|)/g);
  let applyGray = false;

  return tokens.map((token, i) => {
    if (token === '|') {
      applyGray = true;
      return <GraySpan key={i}>{token}</GraySpan>;
    }
    if (applyGray) {
      return <GraySpan key={i}>{token}</GraySpan>;
    }
    if (
      (token.startsWith('(') && token.endsWith(')')) ||
      token === '해당없음'
    ) {
      return <GraySpan key={i}>{token}</GraySpan>;
    }
    return token;
  });
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      type = 'text',
      error,
      buttonLabel,
      buttonColor = 'yellow',
      onButtonClick,
      prefix,
      prefixcontent,
      as,
      // isEmailField,
      useToggle = false,
      options,
      onSelectChange,
      ...rest
    },
    ref
  ) => {
    const [toggle, setToggle] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
      options ? options[0] : ''
    );

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
      if (onSelectChange) {
        onSelectChange(e.target.value);
      }
    };

    const renderPrefixContent = () => {
      if (!prefixcontent) return null;
      if (typeof prefixcontent === 'string') {
        return (
          <PrefixcontentText>
            {parsePrefixContent(prefixcontent)}
          </PrefixcontentText>
        );
      }
      return <PrefixcontentText>{prefixcontent}</PrefixcontentText>;
    };

    return (
      <InputContainer>
        <Label htmlFor={id} $isEmpty={!label}>
          {label.split('(')[0] || '​'}
          {label.includes('(') && (
            <GrayText>{`(${label.split('(')[1]}`}</GrayText>
          )}
        </Label>

        <div>
          <InputRow>
            {prefix && <PrefixText>{prefix}</PrefixText>}
            <InputWrapper>
              {prefixcontent && renderPrefixContent()}

              {options ? (
                <Select
                  id={id}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  {...rest}
                >
                  {options.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input as={as} type={type} id={id} ref={ref} {...rest} />
              )}

              {buttonLabel && (
                <ButtonWrapper>
                  <Button02 onClick={onButtonClick} color={buttonColor}>
                    {buttonLabel}
                  </Button02>
                </ButtonWrapper>
              )}

              {useToggle && (
                <ToggleWrapper>
                  <SeasonToggle
                    isActive={toggle}
                    toggle={() => setToggle(!toggle)}
                  />
                </ToggleWrapper>
              )}
            </InputWrapper>
          </InputRow>

          {/* 에러 메시지 영역 */}
          <ErrorContainer>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </ErrorContainer>
        </div>
      </InputContainer>
    );
  }
);

export default InputField;

/* --- styled-components --- */
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label<{ $isEmpty: boolean }>`
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 11.05px;
  text-align: left;
  visibility: ${({ $isEmpty }) => ($isEmpty ? 'hidden' : 'visible')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GrayText = styled.span`
  padding-left: 3px;
  color: #888888;
  font-size: 12px;
  line-height: 14px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const PrefixText = styled.span`
  margin-right: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;

const PrefixcontentText = styled.span`
  margin-left: 10px;
  font-weight: 800;
  font-size: 13px;
  line-height: 14px;
  color: #000000;
`;

const GraySpan = styled.span`
  color: #999999;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dddddd;
  border-radius: 4px;
  height: 57px;
  overflow: hidden;
  flex: 1;
  position: relative;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  font-size: 16px;
  border: none;
  padding: 0 11px;
  flex: 1;
  height: 57px;
  width: 100%;
  font-weight: 400;
  font-size: 13px;
  line-height: 14px;
  background-color: ${({ readOnly }) => (readOnly ? '#f0f0f0' : 'white')};
  color: ${({ readOnly }) => (readOnly ? '#999999' : '#000000')};
  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  font-size: 16px;
  border: 1px solid #000000;
  border-radius: 4px;
  height: 57px;
  width: 100%;
  padding: 0 40px 0 16px;
  font-weight: 800;
  font-size: 13px;
  line-height: 14px;
  color: #000000;
  appearance: none;
  background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D'10'%20height%3D'6'%20viewBox%3D'0%200%2010%206'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cpath%20d%3D'M0%200l5%206l5-6z'%20fill%3D'%23000'%20/%3E%3C/svg%3E")
    no-repeat right 16px center/10px 6px;
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const ErrorContainer = styled.div`
  min-height: 18px;
  margin-top: 6px;
  margin-left: 4px;
`;

const ErrorMessage = styled.span`
  display: block;
  color: blue;
  font-size: 12px;
  font-weight: 400;
`;
