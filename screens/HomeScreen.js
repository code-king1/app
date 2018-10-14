import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {Icon} from 'expo';
import TabBarIcon from '../components/TabBarIcon';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';

let audioPlayer = new Expo.Audio.Sound();
const trackPrefix = 'https://a.musicoin.org/tracks/';
const trackSuffix = '/index.m3u8';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {currentTrack: null, isPlaying: false};
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <FlatList
                data={this.props.releases}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
          </ScrollView>
          {this.state.currentTrack ? <View style={styles.playerContainer}>

            {this.state.isPlaying ? <TouchableOpacity>
                  <Icon.Ionicons onPress={() => this.pauseTrack()}
                                 name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                                 size={26}
                                 color={Colors.tabIconSelected}
                                 style={styles.playerButton}
                  />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => this.resumeTrack()}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                      size={26}
                      color={Colors.tabIconSelected}
                      style={styles.playerButton}
                  />
                </TouchableOpacity>}
            <View style={styles.songInfo}>
              <Text>{this.state.currentTrack.artistName}</Text>
            </View>
          </View> : null}
        </View>
    );
  }

  _keyExtractor = (item, index) => item.trackURL;

  _renderItem = ({item}) => (
      <View style={styles.trackContainer}>
        <View style={styles.releaseTrackContainer}>
          <Text>{item.artistName}</Text>
        </View>

        <View style={styles.playButtonContainer}>
          <TouchableOpacity onPress={() => this.loadAndPlayTrack(item)}>
            <TabBarIcon
                name={Platform.OS === 'ios' ? `ios-play${false ? '' : '-outline'}` : 'md-play'}
            />
          </TouchableOpacity>
        </View>
      </View>
  );

  async loadAndPlayTrack(track) {

    this.setState({currentTrack: track, isPlaying: true});

    //get track url, last part of trackURL is the ID
    let trackPartArray = track.trackURL.split('/');
    let trackId = trackPartArray[trackPartArray.length - 1];

    let playbackState = await audioPlayer.getStatusAsync();
    console.log(playbackState);

    if (playbackState.isLoaded) {
      await audioPlayer.stopAsync();
      await audioPlayer.unloadAsync();
    }

    await audioPlayer.loadAsync({uri: trackPrefix + trackId + trackSuffix}, {}, false);
    await audioPlayer.playAsync();

  };

  async pauseTrack() {
    this.setState({isPlaying: false});
    await audioPlayer.pauseAsync();
  }

  async resumeTrack() {
    this.setState({isPlaying: true});
    await audioPlayer.playAsync();
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  trackContainer: {
    flexDirection: 'row',
  },
  releaseTrackContainer: {
    padding: 10,
    flex: 0.9,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  playerContainer: {
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
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  playerButton: {
    padding: 10,
    marginLeft: 10,
    flex: 0.1,
  },
  songInfo: {
    padding: 10,
    marginRight: 10,
    flex: 0.9,
  },
});

export default connect(mapStateToProps, null)(HomeScreen);
