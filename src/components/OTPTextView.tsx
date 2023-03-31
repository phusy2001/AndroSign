/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface OTPTextViewProps {
  defaultValue?: string;
  handleTextChange: (otpText: string) => void;
  inputCount: number;
  tintColor?: string | string[];
  offTintColor?: string | string[];
  inputCellLength: number;
  containerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  testIDPrefix?: string;
}

const getOTPTextChunks = (
  inputCount: number,
  inputCellLength: number,
  text: string,
) => {
  let otpText = text.match(new RegExp(`.{1,${inputCellLength}}`, 'g')) || [];
  otpText = otpText.slice(0, inputCount) as RegExpMatchArray;
  return otpText;
};

const DEFAULT_TINT_COLOR = '#3CB371';
const DEFAULT_OFF_TINT_COLOR = '#DCDCDC';

const OTPTextView = forwardRef<View, OTPTextViewProps>((props, ref) => {
  const {
    defaultValue = '',
    handleTextChange,
    inputCount = 4,
    tintColor = DEFAULT_TINT_COLOR,
    offTintColor = DEFAULT_OFF_TINT_COLOR,
    inputCellLength = 1,
    containerStyle = {},
    textInputStyle = {},
    keyboardType = 'numeric',
    testIDPrefix = 'otpinput',
    ...textInputProps
  } = props;

  const [focusedInput, setFocusedInput] = useState(0);
  const [otpText, setOTPText] = useState<string[]>(
    getOTPTextChunks(inputCount, inputCellLength, defaultValue),
  );

  const inputs = useRef<TextInput[]>([]);

  const checkTintColorCount = useCallback(() => {
    if (typeof tintColor !== 'string' && tintColor.length !== inputCount) {
      throw new Error(
        "If tint color is an array it's length should be equal to input count",
      );
    }

    if (
      typeof offTintColor !== 'string' &&
      offTintColor.length !== inputCount
    ) {
      throw new Error(
        "If off tint color is an array it's length should be equal to input count",
      );
    }
  }, [inputCount, offTintColor, tintColor]);

  const basicValidation = useCallback((text: string) => {
    const validText = /^[0-9a-zA-Z]+$/;
    return text.match(validText);
  }, []);

  const onTextChange = useCallback(
    (text: string, i: number) => {
      if (text && !basicValidation(text)) {
        return;
      }

      setOTPText(prevState => {
        const otpTextCopy = [...prevState];
        otpTextCopy[i] = text;
        return otpTextCopy;
      });

      if (text.length === inputCellLength && i !== inputCount - 1) {
        inputs.current[i + 1]?.focus();
      }
    },
    [basicValidation, inputCellLength, inputCount],
  );

  const onInputFocus = useCallback(
    (i: number) => {
      const prevIndex = i - 1;
      if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join('')) {
        inputs.current[prevIndex].focus();
        return;
      }
      setFocusedInput(i);
    },
    [otpText],
  );

  const onKeyPress = (e: any, i: number): void => {
    const val = otpText[i] || '';

    if (e.nativeEvent.key !== 'Backspace' && val && i !== inputCount - 1) {
      inputs.current[i + 1].focus();
      return;
    }

    if (e.nativeEvent.key === 'Backspace' && i !== 0) {
      if (!val.length && otpText[i - 1].length === inputCellLength) {
        const newOtpText = [...otpText];
        newOtpText[i - 1] = newOtpText[i - 1]
          .split('')
          .splice(0, newOtpText[i - 1].length - 1)
          .join('');
        setOTPText(newOtpText);

        handleTextChange?.(newOtpText.join(''));

        inputs.current[i - 1].focus();
      }
    }
  };

  const clear = () => {
    setOTPText([]);
    inputs.current[0].focus();
    handleTextChange('');
  };

  const setValue = (value: string) => {
    const updatedFocusInput = value.length - 1;

    setOTPText(getOTPTextChunks(inputCount, inputCellLength, value));

    if (inputs.current[updatedFocusInput]) {
      inputs.current[updatedFocusInput].focus();
    }

    handleTextChange(value);
  };

  useEffect(() => {
    checkTintColorCount();
  }, [checkTintColorCount]);

  const TextInputs = [];

  for (let i = 0; i < inputCount; i += 1) {
    const _tintColor = typeof tintColor === 'string' ? tintColor : tintColor[i];
    const _offTintColor =
      typeof offTintColor === 'string' ? offTintColor : offTintColor[i];

    const inputStyle = [
      styles.textInput,
      textInputStyle,
      {
        borderColor: _offTintColor,
      },
    ];

    if (focusedInput === i) {
      inputStyle.push({
        borderColor: _tintColor,
      });
    }

    TextInputs.push(
      <TextInput
        ref={e => {
          if (e !== null) {
            inputs.current[i] = e;
          }
        }}
        key={i}
        autoCorrect={false}
        keyboardType={keyboardType}
        autoFocus={i === 0}
        value={otpText[i] || ''}
        style={inputStyle}
        maxLength={inputCellLength}
        onFocus={() => onInputFocus(i)}
        onChangeText={(text: string) => onTextChange(text, i)}
        multiline={false}
        onKeyPress={(e: any) => onKeyPress(e, i)}
        selectionColor={_tintColor}
        {...textInputProps}
        testID={`${testIDPrefix}${i}`}
      />,
    );
  }

  return (
    <View ref={ref} style={[styles.container, containerStyle]}>
      {TextInputs}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: 50,
    width: 50,
    borderBottomWidth: 4,
    margin: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
  },
});

export default OTPTextView;
