import React from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function SplashScreen() {
  const [spinValue, setSpinValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [spinValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <Icon name="react" style={styles.icon} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 64,
    color: '#61DAFB',
  },
});

export default SplashScreen;
