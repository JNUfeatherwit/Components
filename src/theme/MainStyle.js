/**
 * Created by PengYuJing on 2018/8/20 下午10:22.
 * file description: 基础属性
 */
import { StyleSheet } from 'react-native'

const basicColor = {
  mainColor: '#0084ff',
  backgroundColor: '#efeff4',
  /* 状态颜色 */
  red: '#F44336',
  green: '#09bb07',
  grey: '#999999',
  yellow: '#ffbf00',
  orange: '#ff6e00',
  blue: '#0084ff',
  purple: '#673ab7',
  /* border color */
  borderColor: '#dddddd',
  borderColorE: '#eeeeee',
  borderColorC: '#cccccc',
  /* text color */
  textBlack: '#000000',
  textColor3: '#333333',
  textColor6: '#666666',
  textColor7: '#777777',
  textColor8: '#888888',
  textColor9: '#999999',
  tabColor: '#b5b5b5'
}

const basicAttr = {
  marginHorizontal: 15,
  borderRadius: 4
}

const basicStyle = {
  container: {
    flex: 1,
    backgroundColor: basicColor.backgroundColor
  }
}

const borderWidth = {
  thin: StyleSheet.hairlineWidth,
  doubleThin: StyleSheet.hairlineWidth * 2
}

export { basicColor, basicStyle, basicAttr, borderWidth }
