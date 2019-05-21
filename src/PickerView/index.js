/**
 * Created by ZhangZhiShuo on 2019/5/21 10:30.
 * file description:
 */
import React, { Component } from 'react'
import { Animated, InteractionManager, PanResponder, StyleSheet, Text, View, ViewPropTypes } from 'react-native'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { observable } from 'mobx'

const ITEM_HEIGHT = 36
const ITEM_WIDTH = 56
@observer
class UtPickerView extends Component {
  static propTypes = {
    data: PropTypes.array,
    selectedIndex: PropTypes.number,
    selectedTextColor: PropTypes.string,
    textColor: PropTypes.string,
    onChange: PropTypes.func,
    containStyle: ViewPropTypes.style,
    isHorizontal: PropTypes.bool
  }
  static defaultProps = {
    selectedIndex: 0,
    selectedTextColor: '#666',
    textColor: '#aaa',
    isHorizontal: false
  }
  @observable curIndex = this.props.selectedIndex
  @observable loadLength = Math.min(this.props.data.length + 4, 40)

  get list() {
    return ['', ''].concat(this.props.data.slice()).concat(['', ''])
  }

  constructor(props) {
    super(props)
    this.initData()
  }
  componentDidMount() {
    if (this.list.length > this.loadLength) {
      InteractionManager.runAfterInteractions(() => {
        this.loadLength = this.list.length
      })
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.curIndex !== nextProps.selectedIndex) {
      this.curIndex = nextProps.selectedIndex
      const size = this.props.isHorizontal ? ITEM_WIDTH : ITEM_HEIGHT
      this.position.setValue(-this.curIndex * size)
      // this.startAnimation(200)
    }
  }

  initData = () => {
    this.position = this.props.isHorizontal
      ? new Animated.Value(-ITEM_WIDTH * this.props.selectedIndex)
      : new Animated.Value(-ITEM_HEIGHT * this.props.selectedIndex)
    this.verPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onStartShouldSetResponder,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderEnd,
      onPanResponderTerminate: this.onPanResponderEnd
    })
    this.horiPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onStartShouldSetResponder,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderEnd,
      onPanResponderTerminate: this.onPanResponderEnd
    })
  }
  onStartShouldSetResponder = () => {
    this.position && this.position.removeAllListeners()
    this.position.stopAnimation()
    return true
  }
  onPanResponderMove = (evt, gestureState) => {
    Animated.decay(this.position, {
      velocity: this.props.isHorizontal ? gestureState.vx : gestureState.vy, // 初速
      deceleration: 0.996 // 衰减加速度
    }).start()
  }

  onPanResponderEnd = (evt, gestureState) => {
    const size = this.props.isHorizontal ? ITEM_WIDTH : ITEM_HEIGHT
    this.pathListener = this.position.addListener(listener => {
      if (listener.value > size || listener.value < -size * (this.list.length - 4)) {
        this.position.removeListener(this.pathListener)
        this.pathListener = null
        if (this.position._value > 0) {
          this.curIndex = 0
        } else {
          const index = Math.round(-this.position._value / size)
          const maxIndex = this.props.data.length - 1
          this.curIndex = index > maxIndex ? maxIndex : index
        }
        this.startAnimation(200)
      }
    })
    InteractionManager.runAfterInteractions(() => {
      if (!this.pathListener) {
        return
      }
      if (this.position._value > 0) {
        this.curIndex = 0
      } else {
        const index = Math.round(-this.position._value / size)
        const maxIndex = this.props.data.length - 1
        this.curIndex = index > maxIndex ? maxIndex : index
      }
      this.startAnimation(100)
    })
  }
  startAnimation = duration => {
    const size = this.props.isHorizontal ? ITEM_WIDTH : ITEM_HEIGHT
    Animated.timing(this.position, { toValue: -this.curIndex * size, duration }).start(({ finished }) => {
      if (finished) {
        console.warn(finished)
        this.props.onChange && this.props.onChange(this.props.data[this.curIndex], this.curIndex)
      }
    })
  }
  renderHoriView = (props, panHandler) => {
    const { containStyle, selectedTextColor, textColor } = props
    return (
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={[styles.horiContainer, containStyle]}>
          <View style={[{ width: ITEM_WIDTH * 5, borderWidth: 0, flexDirection: 'row' }]} {...panHandler} collapsable>
            <Animated.View style={{ transform: [{ translateX: this.position }], flexDirection: 'row' }}>
              {this.list.slice(0, this.loadLength).map((value, index) => (
                <View style={[styles.itemView, { width: ITEM_WIDTH }]} key={index.toString()}>
                  <Text
                    style={{
                      color: this.curIndex + 2 === index ? selectedTextColor : textColor,
                      fontSize: this.curIndex + 2 === index ? 18 : 14
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </View>
      </View>
    )
  }
  renderVerView = (props, panHandler) => {
    const { containStyle, selectedTextColor, textColor } = props
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.container, containStyle, { minWidth: 50 }]}>
          <View style={[{ height: ITEM_HEIGHT * 5, borderWidth: 0 }]} {...panHandler}>
            <Animated.View style={{ transform: [{ translateY: this.position }] }}>
              {this.list.slice(0, this.loadLength).map((value, index) => (
                <View style={[styles.itemView, { height: ITEM_HEIGHT }]} key={index.toString()}>
                  <Text
                    style={{
                      color: this.curIndex + 2 === index ? selectedTextColor : textColor,
                      fontSize: this.curIndex + 2 === index ? 18 : 14
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </View>
      </View>
    )
  }
  render() {
    const { isHorizontal } = this.props
    return isHorizontal
      ? this.renderHoriView(this.props, this.horiPanResponder.panHandlers)
      : this.renderVerView(this.props, this.verPanResponder.panHandlers)
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 10
  },
  horiContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  selectedContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    position: 'absolute',
    backgroundColor: '#dfdfdf'
  },
  itemView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default UtPickerView
