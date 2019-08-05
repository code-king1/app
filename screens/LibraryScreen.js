import React from 'react';
import {View, Text, StyleSheet, Platform, BackHandler, TouchableOpacity, Image} from 'react-native';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import * as Icon from '@expo/vector-icons';
import Track from '../components/track/track';
import {playTrack, togglePlayerMode} from '../actions';
import connectAlert from '../components/alert/connectAlert.component';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

let redirectToPlayer = false;

class LibraryScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid),
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid),
    );
  }

  onBackButtonPressAndroid = () => {
    if (redirectToPlayer) {
      this.props.togglePlayerMode();
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const {navigation} = this.props;
    redirectToPlayer = navigation.getParam('redirectToPlayer', false);
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: getStatusBarHeight(true)}}>
          <View style={{backgroundColor: Colors.tabBar, paddingVertical: 16}}>
            <Text style={{color: Colors.fontColor, alignSelf: 'center', fontSize: 18}}>Library</Text>
          </View>
          <View style={{marginHorizontal: 16}}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate('Recent')}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                  size={20}
                  color={Colors.disabled}
                  style={{marginRight: 16}}
              />

              <Text style={{fontSize: 14}}>Recently played</Text>
            </TouchableOpacity>
            {this.props.auth.loggedIn ?
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate('Liked')}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'}
                      size={20}
                      color={Colors.disabled}
                      style={{marginRight: 16}}
                  />

                  <Text style={{fontSize: 14}}>Favorite tracks</Text>
                </TouchableOpacity> : null}
            {this.props.auth.loggedIn ?
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate('Tipped')}>
                  <Image
                      source={require('../assets/icons/clap-grey.png')}
                      fadeDuration={0}
                      style={{width: 16, height: 16, marginRight: 16}}
                  />

                  <Text style={{fontSize: 14}}>Tipped tracks</Text>
                </TouchableOpacity> : null}
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate('Queue')}>
              <Icon.Ionicons
                  name={'md-timer'}
                  size={20}
                  color={Colors.disabled}
                  style={{marginRight: 16}}
              />
              <Text style={{fontSize: 14}}>Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="queue"/>
  );
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentContainer: {
    paddingTop: 0,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  smallPlayerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 5,
  },
  albumArtPlayerContainer: {
    padding: 10,
    flex: 0.3,
  },
  songInfo: {
    padding: 10,
    marginRight: 10,
    flex: 0.6,
  },
});

export default connectAlert(connect(mapStateToProps, {playTrack, togglePlayerMode})(LibraryScreen));
