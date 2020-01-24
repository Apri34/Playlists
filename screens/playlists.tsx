import React, {Component} from 'react';
import {StyleSheet, Text, FlatList, TouchableOpacity, View} from 'react-native';
import Playlist from '../models/playlist';
import Song from '../models/song';

// This is the initial screen

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  playlists: Playlist[];
}

export default class Playlists extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // The playlists are built in and  are not meant to be changed, but it
      // has to be a state because the songs inside the playlist can change
      playlists: [
        new Playlist(0, 'Favorite Songs', 'purple'),
        new Playlist(1, 'Rock', 'green'),
        new Playlist(2, 'Pop', 'blue'),
        new Playlist(3, 'Electronic', 'yellow'),
      ],
    };
  }

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
              // When a playlist is presses, the app navigates to the PlaylistDetails screen
              // Passing the playlist as parameter
              // Passing a function as parameter: When the songs get selected,
              // they also have to be updated in this screen, therefore it is
              // needed to pass the songs back to this screen with a callback funtion
              onPress={() =>
                navigation.navigate('PlaylistDetails', {
                  playlist: playlist,
                  onAddSongs: (songs: Song[]) => {
                    var newPlaylists = this.state.playlists;
                    newPlaylists[playlist.id].songs = songs;
                    // Setting the state to update UI
                    this.setState(
                      (this.state = {
                        playlists: newPlaylists,
                      }),
                    );
                  },
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
