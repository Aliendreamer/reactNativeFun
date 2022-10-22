import React,{useContext} from 'react';
import { useTheme, Appbar, TouchableRipple, Switch } from 'react-native-paper';
import { UserContext } from '../helpers/usercontext';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKeys } from '../helpers/constants';
export const CustomHeader = ({navigation,route}) => {
  const theme = useTheme();
  const { state: { isThemeDark}, setThemeState} = useContext(UserContext);
	const toggleTheme = async()=>{
		setThemeState(!isThemeDark);
		await AsyncStorage.setItem(StorageKeys.APPTHEME,`${!isThemeDark}`);
	}
  return (
    <Appbar.Header
      theme={{
        colors: {
          primary: theme?.colors.surface,
        },
      }}
    >
      <Appbar.Content title={route.name} />
      <TouchableRipple onPress={() => toggleTheme()}>
        <Switch
          style={[{ backgroundColor: theme.colors.accent }]}
          value={isThemeDark}
        />
      </TouchableRipple>
    </Appbar.Header>
  );
};
