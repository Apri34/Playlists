import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Playlists from '../screens/playlists';
import PlaylistDetails from '../screens/playlistDetails';
import AddSongs from '../screens/addSongs';

// Defining the screens
const screens = {
  Playlists: {
    screen: Playlists,
    navigationOptions: {
      title: 'Playlists',
    },
  },
  PlaylistDetails: {
    screen: PlaylistDetails,
  },
  AddSongs: {
    screen: AddSongs,
    navigationOptions: {
      title: 'Add Songs',
    },
  },
};

const stack = createStackNavigator(screens);

export default createAppContainer(stack);
