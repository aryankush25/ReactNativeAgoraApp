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
  const [enableSpeaker, setEnableSpeaker] = useState(true);
  const engine = useRef(null);

  const initAgora = useCallback(async () => {
    engine.current = await RtcEngine.create(appId);

    await engine.current?.enableAudio();
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
      },
    );
  }, []);

  const joinChannel = useCallback(async () => {
    const response = await engine.current?.joinChannel(
      null,
      channelName,
      null,
      0,
    );

    console.log('#### response', response);

    // setPeerIds((peerIdsLocal) => {
    //   if (peerIdsLocal.indexOf(uid) === -1) {
    //     return [...peerIdsLocal, uid];
    //   }

    //   return peerIdsLocal;
    // });
  }, [channelName]);

  const leaveChannel = useCallback(async () => {
    await engine.current?.leaveChannel();

    setPeerIds([]);
    setJoinSucceed(false);
  }, []);

  const toggleIsMute = useCallback(async () => {
    await engine.current?.muteLocalAudioStream(isMute);
    setIsMute(!isMute);
  }, [isMute]);

  const toggleEnableSpeaker = useCallback(async () => {
    await engine.current?.setEnableSpeakerphone(enableSpeaker);
    setEnableSpeaker(!enableSpeaker);
  }, [enableSpeaker]);

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
    enableSpeaker,
    joinSucceed,
    peerIds,
    setChannelName,
    joinChannel,
    leaveChannel,
    toggleIsMute,
    toggleEnableSpeaker,
  };
};
