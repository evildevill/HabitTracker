import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export async function prepareNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("habit-reminders", {
    name: "Habit reminders",
    description: "Gentle reminders to help you keep your habits going.",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 120, 80, 120],
    enableVibrate: true,
    showBadge: true,
  });
}

export async function getNotificationPermission() {
  await prepareNotificationChannel();
  const permission = await Notifications.getPermissionsAsync();
  const iosStatus = permission.ios?.status;
  const granted = permission.granted ||
    iosStatus === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    iosStatus === Notifications.IosAuthorizationStatus.EPHEMERAL;
  return { ...permission, granted };
}

export async function requestNotificationPermission() {
  await prepareNotificationChannel();
  const current = await getNotificationPermission();
  if (current.granted || !current.canAskAgain) return current;
  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  const iosStatus = requested.ios?.status;
  return {
    ...requested,
    granted: requested.granted ||
      iosStatus === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      iosStatus === Notifications.IosAuthorizationStatus.EPHEMERAL,
  };
}
