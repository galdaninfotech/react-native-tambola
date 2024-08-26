import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
 
export function SignInWithPassword() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={{ gap: 10, }}>
      <TextInput
        style={{ height: 40, width: 280, padding: 8, borderRadius: 5, borderColor: '#000', borderWidth: 1 }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        style={{ height: 40, width: 280, padding: 8, borderRadius: 5, borderColor: '#000', borderWidth: 1 }}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title={step === "signIn" ? "Sign in" : "Sign up"}
        onPress={() => {
          void signIn("password", { email, password, flow: step });
        }}
      />
      <Button
        title={step === "signIn" ? "Sign up instead" : "Sign in instead"}
        onPress={() => setStep(step === "signIn" ? "signUp" : "signIn")}
      />
    </View>
  );
}