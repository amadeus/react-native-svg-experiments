import React from 'react';
import {StyleSheet, Text, View, PixelRatio, ScrollView, TouchableWithoutFeedback} from 'react-native';
import Svg, {Rect, Mask, Circle, Defs, Path, G} from 'react-native-svg';
import {animated, Controller} from 'react-spring/renderprops-native';

const STATUS_BAR_PADDING = 60;
const SIZE = 64;
const PADDING = 12;
const SVG_SIZE = PixelRatio.getPixelSizeForLayoutSize(SIZE);
const TOTAL_SVGS = 20;
const SQUIRCLE =
  'M0 89.088C0 57.9043 0 42.3124 6.06876 30.4018C11.407 19.9249 19.9249 11.407 30.4018 6.06876C42.3124 0 57.9043 0 89.088 0H102.912C134.096 0 149.688 0 161.598 6.06876C172.075 11.407 180.593 19.9249 185.931 30.4018C192 42.3124 192 57.9043 192 89.088V102.912C192 134.096 192 149.688 185.931 161.598C180.593 172.075 172.075 180.593 161.598 185.931C149.688 192 134.096 192 102.912 192H89.088C57.9043 192 42.3124 192 30.4018 185.931C19.9249 180.593 11.407 172.075 6.06876 161.598C0 149.688 0 134.096 0 102.912V89.088Z';

const BADGE_IN_SETTINGS = {
  friction: 30,
  tension: 900,
  mass: 1,
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

const AnimatedCircle = animated(Circle);

class MaskedElement extends React.PureComponent {
  static defaultProps = {
    selected: false,
  };

  state = {
    controller: new Controller({spring: 1, config: BADGE_IN_SETTINGS}),
    active: false,
  };

  getBadgePosition() {
    const {controller} = this.state;
    return {
      transform: [
        {
          translate: [
            {
              translateY: controller.getValues().spring.interpolate([0, 1], [20, 0]),
            },
            {
              translateX: controller.getValues().spring.interpolate([0, 1], [20, 0]),
            },
          ],
          // controller
          //   .getValues()
          //   .spring.interpolate([0, 1], [20, 0])
          //   .interpolate(value => `translate(${value} ${value})`),
        },
      ],
    };
  }

  render() {
    const {selected, onClick} = this.props;
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
              <AnimatedCircle
                fill="black"
                style={this.getBadgePosition()}
                // transform={this.getBadgePosition()}
                // transform="translate(10 10)"
                cx={(SVG_SIZE / 4) * 3}
                cy={(SVG_SIZE / 4) * 3}
                r={SVG_SIZE / 4}
              />
            </Mask>
          </Defs>
          <G mask="url(#mask)">
            <Rect x={0} y={0} width={SVG_SIZE} height={SVG_SIZE} fill="red" />
          </G>
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
          {new Array(TOTAL_SVGS).fill(null).map((_, i) => (
            <MaskedElement onClick={() => this.setState({selected: i})} selected={i === selected} key={i} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default App;
