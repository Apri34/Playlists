import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Button} from 'react-native';
import Song from '../models/song';
import Playlist from '../models/playlist';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  NavigationStackProp,
  NavigationStackOptions,
} from 'react-navigation-stack';

//This screen is started when the user presses a playlist

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  playlist: Playlist;
}

export default class PlaylistDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // Setting playlist as a state because it can be updated by selecting songs
      // Initial state is passed from previous screen
      playlist: this.props.navigation.getParam('playlist'),
    };
  }

  // Setting the title in the header to the name of the playlist
  // Setting a Button in the header to navigate to the AddSongs screen
  static navigationOptions = ({navigation}: Props) => {
    return {
      title: navigation.getParam('playlist').name,
      headerRight: () => (
        <Icon
          name="add"
          size={24}
          style={styles.headerIcon}
          // Getting the funtion that is passed to the params below
          onPress={navigation.getParam('onAddPressed')}
        />
      ),
    };
  };

  // This function gets called before the navigationOptions are set,
  // so here the funtion, that is called when the button in the header is
  // pressed, can be passed to the params of navigation
  componentDidMount() {
    this.props.navigation.setParams({
      onAddPressed: () => {
        // Navigate to AddSongs screen and passing currently added songs
        // as a parameter
        // Also passing a callback function as a parameter that updates
        // The playlist in this screen and in the Playlists screen
        this.props.navigation.navigate('AddSongs', {
          addedSongs: this.state.playlist.songs,
          onAddSongs: (selectedSongs: Song[]) => {
            var newPlaylist = this.state.playlist;
            newPlaylist.songs = selectedSongs;
            this.setState(
              (this.state = {
                playlist: newPlaylist,
              }),
            );
            // Calling function that is passed from the Playlists screen to
            // update the playlists there
            this.props.navigation.getParam('onAddSongs')(selectedSongs);
          },
        });
      },
    });
  }

  // Separator for Flatlist
  flatListItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  render() {
    const {navigation} = this.props;

    return (
      <View
        // Setting style inline, because the background depends on the playlist that is opened
        style={{
          backgroundColor: navigation.getParam('playlist').color,
          flex: 1,
          paddingHorizontal: 8,
        }}>
        <FlatList
          data={this.state.playlist.songs}
          // KeyExtractor: Playlists have an id of type 'number', but the key has to be of type 'string'
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.flatListItemSeperator}
          renderItem={({item: song}) => (
            <Text style={styles.songItem}>
              Title: {song.title}, Artist: {song.artist}
            </Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 12,
  },
  songItem: {
    padding: 6,
    fontSize: 16,
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
});
