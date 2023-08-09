import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {IconButton, Text, Button} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const slides = [
  {
    title: 'Chào mừng đến với AndroSign',
    description:
      'Chuyển đổi tài liệu giấy thành phiên bản điện tử dễ dàng với ứng dụng ký kết văn bản.',
    image: require('../assets/images/onboarding.png'),
  },
  {
    title: 'Dễ dàng quản lý và lưu trữ tài liệu',
    description:
      'Ký và chia sẻ văn bản mọi lúc, mọi nơi chỉ với vài thao tác đơn giản.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    title: 'Trải nghiệm ký kết văn bản hiệu quả',
    description:
      'Tiết kiệm thời gian và giấy tờ với việc ký kết văn bản ngay trên điện thoại Android của bạn.',
    image: require('../assets/images/onboarding2.png'),
  },
];

function HelpScreen({navigation}: any) {
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const swiperRef = React.useRef<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

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
          <Swiper
            ref={swiperRef}
            showsPagination
            loop={false}
            onIndexChanged={handleIndexChange}
            showsButtons>
            {slides.map((slide, index) => (
              <View key={index} style={styles.slideContainer}>
                <Image
                  source={slide.image}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
                {currentIndex === slides.length - 1 ? (
                  <Button
                    style={styles.button}
                    mode="contained"
                    onPress={() => {
                      navigation.navigate('Help');
                    }}
                    contentStyle={{flexDirection: 'row-reverse'}}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                      Hướng dẫn sử dụng
                    </Text>
                  </Button>
                ) : (
                  <IconButton
                    icon="arrow-right"
                    size={46}
                    onPress={handleNext}
                  />
                )}
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
    height: 250,
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
