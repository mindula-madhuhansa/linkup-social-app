import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { fetchNotifications } from "../../services/notificationService";

import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import NotificationItem from "../../components/NotificationItem";

const Notifications = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let result = await fetchNotifications(user.id);

    if (result.success) {
      setNotifications(result.data);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => {
            return (
              <NotificationItem key={item.id} item={item} router={router} />
            );
          })}

          {notifications.length === 0 && (
            <Text style={styles.noData}>No notifications yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
