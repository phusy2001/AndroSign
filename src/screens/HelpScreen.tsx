import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {IconButton, Text, Button} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const slides = [
  {
    image: require('../assets/images/guide/IMG_9765.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9766.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9767.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9768.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9769.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9770.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9771.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9772.png'),
  },
  {
    image: require('../assets/images/guide/IMG_9773.png'),
  },
];

function HelpScreen({navigation}: any) {
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const swiperRef = React.useRef<any>(null);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          marginTop: 30,
          height: screenHeight - 100,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="close"
            size={26}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Hướng dẫn sử dụng ứng dụng
          </Text>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
          }}>
          <Swiper ref={swiperRef} showsPagination loop={false} showsButtons>
            {slides.map((slide, index) => (
              <View key={index} style={styles.slideContainer}>
                <Image
                  source={slide.image}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            ))}
          </Swiper>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
  },
  image: {
    marginTop: 50,
    height: 450,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 14,
    marginHorizontal: 18,
  },
  button: {
    width: '90%',
    marginTop: 20,
    borderRadius: 45,
  },
});

export default HelpScreen;
