import React from 'react';
import {StyleSheet, Text, View, PixelRatio, ScrollView, TouchableWithoutFeedback, Animated} from 'react-native';
import Svg, {Rect, Mask, Circle, Defs, Path, G, Image} from 'react-native-svg';
import SERVERS from './urls';

const STATUS_BAR_PADDING = 60;
const SIZE = 64;
const PADDING = 12;
const SVG_SIZE = PixelRatio.getPixelSizeForLayoutSize(SIZE);
const TOTAL_SVGS = 20;
const SQUIRCLE =
  'M0 89.088C0 57.9043 0 42.3124 6.06876 30.4018C11.407 19.9249 19.9249 11.407 30.4018 6.06876C42.3124 0 57.9043 0 89.088 0H102.912C134.096 0 149.688 0 161.598 6.06876C172.075 11.407 180.593 19.9249 185.931 30.4018C192 42.3124 192 57.9043 192 89.088V102.912C192 134.096 192 149.688 185.931 161.598C180.593 172.075 172.075 180.593 161.598 185.931C149.688 192 134.096 192 102.912 192H89.088C57.9043 192 42.3124 192 30.4018 185.931C19.9249 180.593 11.407 172.075 6.06876 161.598C0 149.688 0 134.096 0 102.912V89.088Z';

const BADGE_IN_SETTINGS = {
  friction: 15,
  tension: 200,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#303135',
  },

  guilds: {
    flexGrow: 1,
    flexShrink: 1,
    width: SIZE + PADDING * 2,
    backgroundColor: '#202125',
  },

  guildContent: {
    flexDirection: 'column',
    paddingTop: STATUS_BAR_PADDING,
    paddingBottom: PADDING / 2,
    alignItems: 'center',
  },

  svg: {
    flex: 1,
    marginBottom: PADDING / 2,
    marginTop: PADDING / 2,
  },
});

const AnimatedG = Animated.createAnimatedComponent(G);

class MaskedElement extends React.PureComponent {
  static defaultProps = {
    selected: false,
  };

  state = {
    position: new Animated.Value(0),
    active: false,
  };

  animate = (value, immediate = false) => {
    const {position} = this.state;
    if (immediate) {
      Animated.timing(position, {
        useNativeDriver: true,
        duration: 0,
        toValue: value,
      }).start();
    } else {
      Animated.spring(position, {
        useNativeDriver: true,
        ...BADGE_IN_SETTINGS,
        toValue: value,
      }).start();
    }
  };

  componentDidMount() {
    this.animate(0, true);
  }

  componentDidUpdate(prevProps) {
    const {selected} = this.props;
    if (selected && !prevProps.selected) {
      setTimeout(() => this.animate(1), 300);
    } else if (!selected && prevProps.selected) {
      setTimeout(() => this.animate(0), 2000);
    }
  }

  getBadgePosition() {
    const {position} = this.state;
    const ret = {
      transform: [
        {
          translateX: position.interpolate({inputRange: [0, 1], outputRange: [(SVG_SIZE / 4) * 2, 0]}),
          translateY: position.interpolate({inputRange: [0, 1], outputRange: [(SVG_SIZE / 4) * 2, 0]}),
        },
      ],
    };
    return ret;
  }

  render() {
    const {selected, onClick, url} = this.props;
    const {active} = this.state;
    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.setState({active: true})}
        onPressOut={() => this.setState({active: false})}
        onPress={onClick}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={styles.svg}>
          <Defs>
            <Mask viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} width={SVG_SIZE} height={SVG_SIZE} id="mask">
              <Rect x={0} y={0} width={SVG_SIZE} height={SVG_SIZE} fill="black" />
              {selected ? (
                <Path d={SQUIRCLE} fill="white" />
              ) : (
                <Circle fill="white" cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={SVG_SIZE / 2} />
              )}
              <AnimatedG style={this.getBadgePosition()}>
                <Circle fill="black" cx={(SVG_SIZE / 4) * 3 + 2} cy={(SVG_SIZE / 4) * 3 + 2} r={SVG_SIZE / 4} />
              </AnimatedG>
            </Mask>
          </Defs>
          <Image x={0} y={0} width={SVG_SIZE} height={SVG_SIZE} href={{uri: url}} mask="url(#mask)" />
        </Svg>
      </TouchableWithoutFeedback>
    );
  }
}

class App extends React.Component {
  state = {
    selected: -1,
  };

  render() {
    const {selected} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.guilds} contentContainerStyle={styles.guildContent}>
          {SERVERS.map((url, i) => (
            <MaskedElement url={url} onClick={() => this.setState({selected: i})} selected={i === selected} key={url} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default App;
