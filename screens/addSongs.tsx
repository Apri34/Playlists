import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Song} from '../database/song';
import {Playlist} from '../database/playlist';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  songs: Song[];
  selectedSongs: Song[];
  realm: Realm | null;
}

export default class AddSongs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.setState(
      (this.state = {
        realm: null,
        songs: [],
        selectedSongs: [],
      }),
    );
  }

  // This function gets called before the navigationOptions are set,
  // so here the funtion, that is called when the button in the header is
  // pressed, can be passed to the params of navigation
  // Also create realm and fetch selectedSongs
  componentDidMount() {
    Realm.open({schema: [Playlist.schema, Song.schema]}).then(realm => {
      let playlist = realm.objectForPrimaryKey<Playlist>(
        'Playlist',
        this.props.navigation.getParam('playlistId'),
      );
      let selectedSongs = playlist ? playlist.songs : [];
      this.setState(
        (this.state = {
          selectedSongs: selectedSongs,
          songs: Array.from(realm.objects<Song>('Song')),
          realm: realm,
        }),
      );
    });

    this.props.navigation.setParams({
      onDonePressed: () => {
        // Calling the function that is passed from the
        // previous screen and returning to previous screen
        this.props.navigation.getParam('onAddSongs')();
        this.props.navigation.goBack();
      },
    });
  }

  // Close realm
  componentWillUnmount() {
    const realm: Realm | null = this.state.realm;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  static navigationOptions = ({navigation}: Props) => {
    return {
      headerRight: () => (
        // Setting a button to the header
        // Using TouchableOpacity because 'Button' is very limited in styling
        <TouchableOpacity
          style={styles.headerButton}
          onPress={navigation.getParam('onDonePressed')}>
          <Text style={styles.headerButtonText}>Done</Text>
        </TouchableOpacity>
      ),
    };
  };

  // Separator for Flatlist
  flatListItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.songs}
          // KeyExtractor: Playlists have an id of type 'number', but the key has to be of type 'string'
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.flatListItemSeperator}
          renderItem={({item: song}) => (
            // Making items clickable because they can be selected
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => {
                // Checking if selectedSongs contains the current song -> Means that
                // the song is selected
                if (
                  this.state.selectedSongs.filter(
                    addedSong => addedSong.id == song.id,
                  ).length > 0
                ) {
                  // If the song is selected, deselect -> remove from selectedSongs
                  // And update UI
                  if (this.state.realm) {
                    this.state.realm.write(() => {
                      if (this.state.selectedSongs) {
                        this.setState(
                          (this.state = {
                            songs: this.state.songs,
                            realm: this.state.realm,
                            selectedSongs: this.state.selectedSongs.filter(
                              selectedSong => selectedSong != song,
                            ),
                          }),
                        );
                      }
                    });
                  }
                }
                // If the song is not selected, select -> add to selectedSongs
                // And update UI
                else {
                  let newSelectedSongs = this.state.selectedSongs;
                  newSelectedSongs.push(song);
                  if (this.state.realm) {
                    this.state.realm.write(() => {
                      this.setState(
                        (this.state = {
                          songs: this.state.songs,
                          realm: this.state.realm,
                          selectedSongs: newSelectedSongs,
                        }),
                      );
                    });
                  }
                }
              }}>
              <Text style={styles.text}>
                Title: {song.title}, Artist: {song.artist}
              </Text>

              {/* Show this Icon only if the song is selected */}
              {this.state.selectedSongs.filter(
                addedSong => addedSong.id == song.id,
              ).length > 0 && <Icon name="check" size={24} />}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    padding: 6,
    fontSize: 16,
  },
  selectedIndicator: {
    width: 10,
    backgroundColor: 'red',
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  headerButton: {
    marginRight: 12,
  },
  headerButtonText: {
    fontSize: 20,
  },
});
