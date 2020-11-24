import React from 'react';
import { SafeAreaView, View, Text, TextInput, Button } from 'react-native';
import { useInitializeAgora, useRequestAudioHook } from '../hooks';

const App = () => {
  useRequestAudioHook();
  const {
    channelName,
    isMute,
    enableSpeaker,
    joinSucceed,
    peerIds,
    setChannelName,
    joinChannel,
    leaveChannel,
    toggleIsMute,
    toggleEnableSpeaker,
  } = useInitializeAgora();

  console.log('#### peerIds', peerIds);

  return (
    <SafeAreaView>
      <View>
        <TextInput
          onChangeText={(text) => setChannelName(text)}
          placeholder={'Channel Name'}
          value={channelName}
        />

        <Button
          onPress={joinSucceed ? leaveChannel : joinChannel}
          title={`${joinSucceed ? 'Leave' : 'Join'} channel`}
        />

        <Button onPress={toggleIsMute} title={isMute ? 'UnMute' : 'Mute'} />

        <Button
          onPress={toggleEnableSpeaker}
          title={enableSpeaker ? 'Disable Speaker' : 'Enable Speaker'}
        />

        {peerIds.map((peerId) => {
          return (
            <View key={peerId}>
              <Text>{`Joined User ${peerId}`}</Text>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default App;
