import { router } from 'expo-router';
import Logger from 'js-logger';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useSystem } from '../library/powersync/system';

/**
 * This is the entry point when the app loads.
 * Checks for a Supabase session.
 *  - If one is present redirect to app views.
 *  - If not, redirect to login/register flow
 */
const App: React.FC = () => {
  const { supabaseConnector } = useSystem();

  React.useEffect(() => {
    Logger.useDefaults();
    Logger.setLevel(Logger.DEBUG);
    supabaseConnector.client.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) {
          router.replace('views/todos/lists');
        } else {
          throw new Error('Signin required');
        }
      })
      .catch(() => {
        router.replace('signin');
      });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" className="p-4" />
    </View>
  );
};

export default App;
