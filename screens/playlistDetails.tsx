import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Button} from 'react-native';
import {Song} from '../database/song';
import {Playlist} from '../database/playlist';
import Icon from 'react-native-vector-icons/MaterialIcons';

// This screen is started when the user presses a playlist

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  playlist: Playlist | null;
  realm: Realm | null;
}

export default class PlaylistDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.setState(
      (this.state = {
        realm: null,
        playlist: null,
      }),
    );
  }

  // Function gets called when playlists are selected or deselected
  // in the next screen, so they get updated here too
  reloadPlaylist = () => {
    let playlist = this.state.realm
      ? this.state.realm.objectForPrimaryKey<Playlist>(
          'Playlist',
          this.props.navigation.getParam('playlistId'),
        )
      : null;
    this.setState(
      (this.state = {
        playlist: playlist ? playlist : null,
        realm: this.state.realm,
      }),
    );
  };

  // Setting the title in the header to the name of the playlist
  // Setting a Button in the header to navigate to the AddSongs screen
  static navigationOptions = ({navigation}: Props) => {
    return {
      title: navigation.getParam('title'),
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
  // Also create realm and fetch playlist
  componentDidMount() {
    Realm.open({schema: [Playlist.schema, Song.schema]}).then(realm => {
      let playlist = realm.objectForPrimaryKey<Playlist>(
        'Playlist',
        this.props.navigation.getParam('playlistId'),
      );
      this.setState(
        (this.state = {
          realm: realm,
          playlist: playlist ? playlist : null,
        }),
      );
    });

    this.props.navigation.setParams({
      onAddPressed: () => {
        // Navigate to AddSongs screen and passing the playlistId as parameter
        // Also passing a callback function as a parameter that updates
        // the playlist in this screen and in the Playlists screen
        if (this.state.playlist)
          this.props.navigation.navigate('AddSongs', {
            playlistId: this.state.playlist.id,
            onAddSongs: () => {
              this.reloadPlaylist();
              this.props.navigation.getParam('reloadPlaylist')();
            },
          });
      },
      title: this.state.playlist ? this.state.playlist.songs : 'Playlist',
    });
  }

  // Close realm
  componentWillUnmount() {
    const realm: Realm | null = this.state.realm;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  // Separator for Flatlist
  flatListItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  render() {
    const {navigation} = this.props;
    const songs = this.state.playlist ? this.state.playlist.songs : [];
    const color: string = this.state.playlist
      ? this.state.playlist.color
      : 'white';

    return (
      <View
        // Setting style inline, because the background depends on the playlist that is opened
        style={{
          backgroundColor: color,
          flex: 1,
          paddingHorizontal: 8,
        }}>
        <FlatList
          data={songs}
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
