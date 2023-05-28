import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

interface TransTextProps {
  i18nKey: string;
  style?: StyleProp<TextStyle>;
}

const TransText: React.FC<TransTextProps> = ({i18nKey, style}) => {
  const {t, ready} = useTranslation();

  console.log(ready);
  console.log('Dịch', t(i18nKey));

  return <Text style={style}>{t(i18nKey)}</Text>;
};

export default TransText;
