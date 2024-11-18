import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="Home" options={{ title: "Home", headerShown: true }} />
      <Stack.Screen name="cropR" options={{ title: "Crop Recommendation", headerShown: true }} />
      <Stack.Screen name="cropF" options={{ title: "Fertilizer Recommendation", headerShown: true }} />
      <Stack.Screen name="weather" options={{ headerShown: false }} />

      
      <Stack.Screen
        name="news"
        options={{
          title: "Agricultural News", 
          headerShown: true, 
        }}
      />
    </Stack>
  );
}
