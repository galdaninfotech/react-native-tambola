import React from'react';
import {View, Text, SafeAreaView} from'react-native';
import { SignInWithPassword } from "./SignInWithPassword";
import { SignInWithGoogle } from "./SignInWithGoogle";
import { SignInWithGithub } from "./SignInWithGithub";
import "../global.css";

export default function Login() {
  return (
    <View style={{ flex:1, alignItems: "center", justifyContent: "center", padding: 16, width: "100%"}}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Welcome Back</Text>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

      <SignInWithPassword />
      
      <View style={{marginVertical: 25}} className='flex flex-row items-center justify-between w-full mb-20' >
        <SignInWithGoogle />
        <SignInWithGithub />
      </View>
    </View>
  );
}