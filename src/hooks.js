import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import RtcEngine from 'react-native-agora';
import { requestAudioPermission } from './permissions';

export const useRequestAudioHook = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android

      requestAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }, []);
};

export const useInitializeAgora = () => {
  // Replace yourAppId with the App ID of your Agora project.
  const appId = '1af140d1d92848d4a4f315e62e37727b';
  const token =
    '0061af140d1d92848d4a4f315e62e37727bIAB+fGiaLhFQO3PXJPVULfFjNcwWEn6Jp0We13gBM2/eQYa0dcYAAAAAEABVr+ww+rO+XwEAAQD6s75f';

  const [channelName, setChannelName] = useState('my-channel');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [isMute, setIsMute] = useState(false);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const engine = useRef(null);

  const initAgora = useCallback(async () => {
    engine.current = await RtcEngine.create(appId);

    await engine.current?.enableAudio();
    await engine.current?.muteLocalAudioStream(false);
    await engine.current?.setEnableSpeakerphone(true);

    engine.current?.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);

      setPeerIds((peerIdsLocal) => {
        if (peerIdsLocal.indexOf(uid) === -1) {
          return [...peerIdsLocal, uid];
        }

        return peerIdsLocal;
      });
    });

    engine.current?.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);

      setPeerIds((peerIdsLocal) => {
        return peerIdsLocal.filter((id) => id !== uid);
      });
    });

    engine.current?.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);

        setJoinSucceed(true);

        setPeerIds((peerIdsLocal) => {
          return [...peerIdsLocal, uid];
        });
      },
    );

    engine.current?.addListener('Error', (error) => {
      console.log('Error', error);
    });
  }, []);

  const joinChannel = useCallback(async () => {
    await engine.current?.joinChannel(token, channelName, null, 0);
  }, [channelName]);

  const leaveChannel = useCallback(async () => {
    await engine.current?.leaveChannel();

    setPeerIds([]);
    setJoinSucceed(false);
  }, []);

  const toggleIsMute = useCallback(async () => {
    await engine.current?.muteLocalAudioStream(!isMute);
    setIsMute(!isMute);
  }, [isMute]);

  const toggleIsSpeakerEnable = useCallback(async () => {
    await engine.current?.setEnableSpeakerphone(!isSpeakerEnable);
    setIsSpeakerEnable(!isSpeakerEnable);
  }, [isSpeakerEnable]);

  const destroyAgoraEngine = useCallback(async () => {
    await engine.current?.destroy();
  }, []);

  useEffect(() => {
    initAgora();

    return () => {
      destroyAgoraEngine();
    };
  }, [destroyAgoraEngine, initAgora]);

  return {
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
  };
};
