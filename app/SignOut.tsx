import { useAuthActions } from "@convex-dev/auth/react";
import { Button, View } from "react-native";
 
export function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <View style={{ flex:1, justifyContent: "center", alignItems: "center" }}>
      <Button onPress={() => void signOut()} title="Sign out" />
    </View>
  );
}