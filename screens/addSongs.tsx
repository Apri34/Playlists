import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import Song from '../models/song';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Defining interface to be able to use the navigation property
// The navigation property gets passed to every component in the Navigator automatically
interface Props {
  navigation: any;
}

// Defining interface to be able to use state
interface State {
  selectedSongs: Song[];
}

export default class AddSongs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // The selected songs are a state, because the UI changes when a song is selected
      selectedSongs: this.props.navigation.getParam('addedSongs'),
    };
  }

  // Songs are built in
  songs = [
    new Song(0, 'Avicii', 'Heaven'),
    new Song(1, 'Shakira', 'Waka Waka'),
    new Song(2, 'Post Malone', 'Circles'),
    new Song(3, 'Katy Perry', 'Dark Horse'),
    new Song(4, 'Ed Sheeran', 'Shape of You'),
    new Song(5, 'Maroon 5', 'Sugar'),
    new Song(6, 'Adele', 'Hello'),
    new Song(7, 'OneRepublic', 'Counting Stars'),
    new Song(8, 'Queen', 'Bohemian Rhapsody'),
    new Song(9, 'Deep Purple', 'Smoke On The Water'),
    new Song(10, 'Nirvana', 'Smells Like Teen Spirit'),
    new Song(11, 'Steppenwolf', 'Born To Be Wild'),
    new Song(12, 'Kina', 'Get You the Moon'),
    new Song(13, 'Petit Biscuit', 'Sunset Lover'),
    new Song(14, 'Avicii', 'Levels'),
    new Song(15, 'Avicii', 'Wake Me Up'),
  ];

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

  // This function gets called before the navigationOptions are set,
  // so here the funtion, that is called when the button in the header is
  // pressed, can be passed to the params of navigation
  componentDidMount() {
    this.props.navigation.setParams({
      onDonePressed: () => {
        // Calling the function that is passed from the
        // previous screen and returning to previous screen
        this.props.navigation.getParam('onAddSongs')(this.state.selectedSongs);
        this.props.navigation.goBack();
      },
    });
  }

  // Separator for Flatlist
  flatListItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.songs}
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
                  this.setState(
                    (this.state = {
                      selectedSongs: this.state.selectedSongs.filter(
                        addedSong => addedSong.id != song.id,
                      ),
                    }),
                  );
                }
                //If the song is not selected, select -> add to selectedSongs
                // And update UI
                else {
                  var newSelectedSongs = this.state.selectedSongs;
                  newSelectedSongs.push(song);
                  this.setState(
                    (this.state = {selectedSongs: newSelectedSongs}),
                  );
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
