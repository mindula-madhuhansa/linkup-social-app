import { useEffect } from "react";
import { LogBox } from "react-native";
import { Stack, useRouter } from "expo-router";

import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { AuthProvider, useAuth } from "../context/AuthContext";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
]);

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const { setAuth, setUserData } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        updatedUser(session.user, session.user.email);
        router.replace("home");
      } else {
        setAuth(null);

        router.replace("welcome");
      }
    });
  }, []);

  const updatedUser = async (user, email) => {
    let res = await getUserData(user?.id);

    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default _layout;
