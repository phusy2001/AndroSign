/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import {getData, storeData} from '../utils/asyncStore';
import SplashScreen from './SplashScreen';
import {navigate} from '../navigation/RootNavigation';

const slides = [
  {
    title: 'Chào mừng đến với AndroSign',
    description:
      'Ký nhiều hơn, ký nhanh hơn với một người đồng hành đáng tin cậy. Đăng ký và tham gia cùng chúng tôi!',
    image: require('../assets/images/onboarding.png'),
  },
  {
    title: 'Chào mừng đến với AndroSign',
    description:
      'Ký nhiều hơn, ký nhanh hơn với một người đồng hành đáng tin cậy. Đăng ký và tham gia cùng chúng tôi!',
    image: require('../assets/images/onboarding.png'),
  },
  {
    title: 'Chào mừng đến với AndroSign',
    description:
      'Ký nhiều hơn, ký nhanh hơn với một người đồng hành đáng tin cậy. Đăng ký và tham gia cùng chúng tôi!',
    image: require('../assets/images/onboarding.png'),
  },
];

function OnboardingScreen({navigation}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const insets = useSafeAreaInsets();
  const swiperRef = React.useRef<ScrollView>(null);

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handleGetStarted = async () => {
    // Handle button press on last slide
    try {
      await storeData('hasLoggedIn', 'false');
      navigation.navigate('Drawer', {screen: 'Home'});
    } catch (error) {
      // Handle error here
      console.log(error);
      return false;
    }
  };

  const checkFirstLogin = async () => {
    setIsLoading(true);
    try {
      const value = await getData('hasLoggedIn');
      if (value !== null) {
        // Value exists, not first login
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
        // Value does not exist, first login
        await storeData('hasLoggedIn', 'true');
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      // Handle error here
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
            <Text style={{textAlign: 'center'}}>Logo here</Text>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {currentIndex === slides.length - 1 ? (
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleGetStarted}>
                Bắt đầu
              </Button>
            ) : (
              <IconButton
                icon="arrow-right-circle-outline"
                size={50}
                onPress={handleNext}
              />
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
    width: '100%',
    height: 250,
    marginTop: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 14,
    marginHorizontal: 30,
  },
  button: {
    width: '100%',
    marginTop: 25,
    paddingVertical: 5,
    borderRadius: 45,
  },
});

export default OnboardingScreen;
