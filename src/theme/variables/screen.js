/**
 * Created by ZhangZhiShuo on 2019/4/22 10:10.
 * file description:
 */
import { Platform, NativeModules, Dimensions } from 'react-native'

const { StatusBarManager } = NativeModules

// iPhoneX
const X_WIDTH = 375
const X_HEIGHT = 812

// screen
const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||
      (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
  )
}
const STATUSBAR_HEIGHT = Platform.OS !== 'ios' ? StatusBarManager.HEIGHT : isIphoneX() ? 44 : 20
const HEADER_PADDINGTOP = Platform.OS !== 'ios' ? StatusBarManager.HEIGHT : isIphoneX() ? 24 : 0
const screen = {
  STATUSBAR_HEIGHT: STATUSBAR_HEIGHT,
  HEADER_PADDINGTOP: HEADER_PADDINGTOP
}
export default screen
