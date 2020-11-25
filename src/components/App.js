import React from 'react';
import { SafeAreaView, View, Text, TextInput } from 'react-native';
import { useInitializeAgora, useRequestAudioHook } from '../hooks';
import Button from './Button';
import styles from '../styles';

const App = () => {
  useRequestAudioHook();
  const {
    channelName,
    isMute,
    isSpeakerEnable,
    joinSucceed,
    peerIds,
    setChannelName,
    joinChannel,
    leaveChannel,
    toggleIsMute,
    toggleIsSpeakerEnable,
  } = useInitializeAgora();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.channelInputContainer}>
          <Text>Enter Channel Name:</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => setChannelName(text)}
            placeholder={'Channel Name'}
            value={channelName}
          />
        </View>

        <View style={styles.joinLeaveButtonContainer}>
          <Button
            onPress={joinSucceed ? leaveChannel : joinChannel}
            title={`${joinSucceed ? 'Leave' : 'Join'} channel`}
          />
        </View>

        <View style={styles.floatRight}>
          <Button onPress={toggleIsMute} title={isMute ? 'UnMute' : 'Mute'} />
        </View>

        <View style={styles.floatLeft}>
          <Button
            onPress={toggleIsSpeakerEnable}
            title={isSpeakerEnable ? 'Disable Speaker' : 'Enable Speaker'}
          />
        </View>

        <View style={styles.usersListContainer}>
          {peerIds.map((peerId) => {
            return (
              <View key={peerId}>
                <Text>{`Joined User ${peerId}`}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
