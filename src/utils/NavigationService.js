import { NavigationActions, StackActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function resetTo(routeName) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: routeName })]
  })
  _navigator.dispatch(resetAction)
}
function goBack() {
  _navigator.dispatch(NavigationActions.back())
}
export default { navigate, resetTo, setTopLevelNavigator, goBack }
