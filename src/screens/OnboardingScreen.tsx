import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import {getData, storeData} from '../utils/asyncStore';
import SplashScreen from './SplashScreen';

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

function OnboardingScreen({navigation}: any) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const insets = useSafeAreaInsets();
  const swiperRef = React.useRef<any>(null);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handleGetStarted = async () => {
    try {
      await storeData('hasLoggedIn', 'false');
      navigation.navigate('Drawer', {screen: 'Home'});
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const checkFirstLogin = async () => {
    setIsLoading(true);
    try {
      const value = await getData('hasLoggedIn');
      if (value !== null) {
        if (value === true) {
          setIsLoading(false);
          return true;
        } else {
          navigation.navigate('Drawer', {
            screen: 'Home',
            params: {reload: true},
          });
          setIsLoading(false);
          return false;
        }
      } else {
        await storeData('hasLoggedIn', 'true');
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  React.useEffect(() => {
    checkFirstLogin();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: '#FFFFFF',
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
              <>
                <Button
                  style={styles.button2}
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('Help');
                  }}
                  contentStyle={{flexDirection: 'row-reverse'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>
                    Hướng dẫn sử dụng
                  </Text>
                </Button>
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={handleGetStarted}
                  icon="arrow-right"
                  contentStyle={{flexDirection: 'row-reverse'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>
                    Đi vào màn hình chính
                  </Text>
                </Button>
              </>
            ) : (
              <IconButton icon="arrow-right" size={46} onPress={handleNext} />
            )}
          </View>
        ))}
      </Swiper>
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
  button2: {
    width: '90%',
    marginTop: 25,
    borderRadius: 45,
    backgroundColor: '#17a2b8',
  },
});

export default OnboardingScreen;
