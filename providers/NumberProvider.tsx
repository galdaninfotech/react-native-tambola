import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface NumberContextType {
  latestNumber: number | null;
}

const NumberContext = createContext<NumberContextType | null>(null);

export function NumberProvider({ children }: { children: React.ReactNode }) {
  const allNumbers = useQuery(api.tickets.getAllNumbers, {});
  const [latestNumber, setLatestNumber] = useState<number | null>(null);
  const prevNumberRef = useRef<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isInitialRenderRef = useRef(true); // Track if it's the initial render

  const numberSounds: { [key: number]: any } = {
    1: require('../assets/sounds/en_num_1.mp3'),
    2: require('../assets/sounds/en_num_2.mp3'),
    3: require('../assets/sounds/en_num_3.mp3'),
    4: require('../assets/sounds/en_num_4.mp3'),
    5: require('../assets/sounds/en_num_5.mp3'),
    6: require('../assets/sounds/en_num_6.mp3'),
    7: require('../assets/sounds/en_num_7.mp3'),
    8: require('../assets/sounds/en_num_8.mp3'),
    9: require('../assets/sounds/en_num_9.mp3'),
    10: require('../assets/sounds/en_num_10.mp3'),
    11: require('../assets/sounds/en_num_11.mp3'),
    12: require('../assets/sounds/en_num_12.mp3'),
    13: require('../assets/sounds/en_num_13.mp3'),
    14: require('../assets/sounds/en_num_14.mp3'),
    15: require('../assets/sounds/en_num_15.mp3'),
    16: require('../assets/sounds/en_num_16.mp3'),
    17: require('../assets/sounds/en_num_17.mp3'),
    18: require('../assets/sounds/en_num_18.mp3'),
    19: require('../assets/sounds/en_num_19.mp3'),
    20: require('../assets/sounds/en_num_20.mp3'),
    21: require('../assets/sounds/en_num_21.mp3'),
    22: require('../assets/sounds/en_num_22.mp3'),
    23: require('../assets/sounds/en_num_23.mp3'),
    24: require('../assets/sounds/en_num_24.mp3'),
    25: require('../assets/sounds/en_num_25.mp3'),
    26: require('../assets/sounds/en_num_26.mp3'),
    27: require('../assets/sounds/en_num_27.mp3'),
    28: require('../assets/sounds/en_num_28.mp3'),
    29: require('../assets/sounds/en_num_29.mp3'),
    30: require('../assets/sounds/en_num_30.mp3'),
    31: require('../assets/sounds/en_num_31.mp3'),
    32: require('../assets/sounds/en_num_32.mp3'),
    33: require('../assets/sounds/en_num_33.mp3'),
    34: require('../assets/sounds/en_num_34.mp3'),
    35: require('../assets/sounds/en_num_35.mp3'),
    36: require('../assets/sounds/en_num_36.mp3'),
    37: require('../assets/sounds/en_num_37.mp3'),
    38: require('../assets/sounds/en_num_38.mp3'),
    39: require('../assets/sounds/en_num_39.mp3'),
    40: require('../assets/sounds/en_num_40.mp3'),
    41: require('../assets/sounds/en_num_41.mp3'),
    42: require('../assets/sounds/en_num_42.mp3'),
    43: require('../assets/sounds/en_num_43.mp3'),
    44: require('../assets/sounds/en_num_44.mp3'),
    45: require('../assets/sounds/en_num_45.mp3'),
    46: require('../assets/sounds/en_num_46.mp3'),
    47: require('../assets/sounds/en_num_47.mp3'),
    48: require('../assets/sounds/en_num_48.mp3'),
    49: require('../assets/sounds/en_num_49.mp3'),
    50: require('../assets/sounds/en_num_50.mp3'),
    51: require('../assets/sounds/en_num_51.mp3'),
    52: require('../assets/sounds/en_num_52.mp3'),
    53: require('../assets/sounds/en_num_53.mp3'),
    54: require('../assets/sounds/en_num_54.mp3'),
    55: require('../assets/sounds/en_num_55.mp3'),
    56: require('../assets/sounds/en_num_56.mp3'),
    57: require('../assets/sounds/en_num_57.mp3'),
    58: require('../assets/sounds/en_num_58.mp3'),
    59: require('../assets/sounds/en_num_59.mp3'),
    60: require('../assets/sounds/en_num_60.mp3'),
    61: require('../assets/sounds/en_num_61.mp3'),
    62: require('../assets/sounds/en_num_62.mp3'),
    63: require('../assets/sounds/en_num_63.mp3'),
    64: require('../assets/sounds/en_num_64.mp3'),
    65: require('../assets/sounds/en_num_65.mp3'),
    66: require('../assets/sounds/en_num_66.mp3'),
    67: require('../assets/sounds/en_num_67.mp3'),
    68: require('../assets/sounds/en_num_68.mp3'),
    69: require('../assets/sounds/en_num_69.mp3'),
    70: require('../assets/sounds/en_num_70.mp3'),
    71: require('../assets/sounds/en_num_71.mp3'),
    72: require('../assets/sounds/en_num_72.mp3'),
    73: require('../assets/sounds/en_num_73.mp3'),
    74: require('../assets/sounds/en_num_74.mp3'),
    75: require('../assets/sounds/en_num_75.mp3'),
    76: require('../assets/sounds/en_num_76.mp3'),
    77: require('../assets/sounds/en_num_77.mp3'),
    78: require('../assets/sounds/en_num_78.mp3'),
    79: require('../assets/sounds/en_num_79.mp3'),
    80: require('../assets/sounds/en_num_80.mp3'),
    81: require('../assets/sounds/en_num_81.mp3'),
    82: require('../assets/sounds/en_num_82.mp3'),
    83: require('../assets/sounds/en_num_83.mp3'),
    84: require('../assets/sounds/en_num_84.mp3'),
    85: require('../assets/sounds/en_num_85.mp3'),
    86: require('../assets/sounds/en_num_86.mp3'),
    87: require('../assets/sounds/en_num_87.mp3'),
    88: require('../assets/sounds/en_num_88.mp3'),
    89: require('../assets/sounds/en_num_89.mp3'),
    90: require('../assets/sounds/en_num_90.mp3'),
  };

  useEffect(() => {
    if (allNumbers && allNumbers.length > 0) {
      const newLatestNumber = allNumbers[allNumbers.length - 1]?.number ?? null;

      if (isInitialRenderRef.current) {
        // Skip sound playback on initial render
        isInitialRenderRef.current = false;
        prevNumberRef.current = newLatestNumber;
      } else if (newLatestNumber !== null && newLatestNumber !== prevNumberRef.current) {
        setLatestNumber(newLatestNumber);
        playNumberAudio(newLatestNumber);
        prevNumberRef.current = newLatestNumber;
      }
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [allNumbers]);
  
  const playNumberAudio = async (number: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const soundSource = numberSounds[number];

    if (soundSource) {
      try {
        const { sound } = await Audio.Sound.createAsync(soundSource);
        soundRef.current = sound;
        await sound.playAsync();
      } catch (error) {
        console.error(`Error playing sound for number ${number}:`, error);
      }
    } else {
      console.warn(`No sound found for number: ${number}`);
    }
  };

  return (
    <NumberContext.Provider value={{ latestNumber }}>
      {children}
    </NumberContext.Provider>
  );
}

export const useNumber = (): NumberContextType => {
  const context = useContext(NumberContext);
  if (!context) {
    throw new Error('useNumber must be used within a NumberProvider');
  }
  return context;
};
