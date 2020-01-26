import React, {Component} from 'react';
import {StyleSheet, Text, FlatList, TouchableOpacity, View} from 'react-native';
import {Playlist} from '../database/playlist';
import {Song} from '../database/song';
import {initData} from '../database/realm';

// This is the initial screen

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  playlists: Playlist[];
  realm: Realm | null;
}

export default class Playlists extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      playlists: [],
      realm: null,
    };
  }

  // Create realm and fetch playlists and initialize data
  // if app is started the first time
  componentDidMount() {
    Realm.open({schema: [Playlist.schema, Song.schema]}).then(realm => {
      if (realm.objects<Playlist>('Playlist').length == 0) {
        initData();
      }
      this.setState(
        (this.state = {
          playlists: Array.from(realm.objects<Playlist>('Playlist')),
          realm: realm,
        }),
      );
    });
  }

  // Close realm
  componentWillUnmount() {
    const realm: Realm | null = this.state.realm;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  // This method gets called when songs are added in the next screen
  // Reloads the playlists
  reloadPlaylists = () => {
    this.setState(
      (this.state = {
        playlists: this.state.realm
          ? Array.from(this.state.realm.objects<Playlist>('Playlist'))
          : this.state.playlists,

        realm: this.state.realm,
      }),
    );
  };

  // Separator for Flatlist
  flatListItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.playlists}
          // KeyExtractor: Playlists have an id of type 'number', but the key has to be of type 'string'
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.flatListItemSeperator}
          renderItem={({item: playlist}) => (
            <TouchableOpacity
              style={styles.item}
              // When a playlist is pressed, the app navigates to the PlaylistDetails screen
              // Passing the playlistId as parameter
              // Passing a function as parameter: When the songs get selected,
              // they also have to be updated in this screen, therefore it is
              // needed call a function here: reloadPlaylists()
              onPress={() =>
                navigation.navigate('PlaylistDetails', {
                  playlistId: playlist.id,
                  reloadPlaylists: this.reloadPlaylists(),
                })
              }>
              <View style={styles.namePart}>
                {/* passing style to this View inline, because it gets the color of the playlist */}
                <View
                  style={{
                    backgroundColor: playlist.color,
                    width: 6,
                  }}
                />
                <Text style={styles.name}>{playlist.name}</Text>
              </View>
              <Text style={styles.count}>{playlist.songs.length}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  namePart: {
    flexDirection: 'row',
  },
  name: {
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 18,
  },
  count: {
    width: 16,
    fontSize: 18,
  },
  colorIndicator: {
    width: 6,
    backgroundColor: 'blue',
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
});
