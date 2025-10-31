// src/pages/RecordingPage.jsx
import { useEffect, useRef, useCallback, useState } from 'react'; // useState 훅 추가
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Layout from '../components/Layout/Layout';
import * as S from './RecordingPage.styles';

// 아바타 이미지 두 가지 불러오기
import avatarIcon from '../assets/icons/avatar.svg';
import avatar2Icon from '../assets/icons/avatar_2.svg'; // 아바타가 말할 때 사용할 이미지
import endRecordingButtonImg from '../assets/buttons/endrecordingbutton.svg';

function RecordingPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamIntervalRef = useRef(null);
  
  const sessionIdRef = useRef(null);
  const frameSequenceRef = useRef(0);
  const audioSequenceRef = useRef(0);

  // --- 1. [신규] 아바타 상태를 위한 state 추가 ---
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false); // 아바타가 말하는 중인지 여부
  const [currentAvatarImage, setCurrentAvatarImage] = useState(avatarIcon); // 현재 아바타 이미지

  // --- 2. TTS(음성 변환) 기능 수정: onstart, onend 이벤트 핸들러 추가 ---
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return alert("음성 합성을 지원하지 않는 브라우저입니다.");
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    
    // TTS 재생 시작 시 아바타 '말하는 중' 상태로 변경
    utterance.onstart = () => {
      setIsAvatarSpeaking(true);
      console.log('🎤 아바타 말하기 시작');
    };

    // TTS 재생 종료 시 아바타 '말 멈춤' 상태로 변경
    utterance.onend = () => {
      setIsAvatarSpeaking(false);
      console.log('🎤 아바타 말하기 종료');
    };
    
    console.log(`🎤 아바타 음성 재생: "${text}"`);
    window.speechSynthesis.speak(utterance);
  }, []); // speak 함수는 의존성이 없으므로 재생성되지 않음

  // --- 3. 모든 스트림과 연결을 중지하는 함수 수정: 아바타 상태 초기화 ---
  const stopAllStreams = useCallback(() => {
    console.log('--- 🛑 모든 스트림과 연결을 중지합니다 ---');

    // 기존 중지 로직
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    frameSequenceRef.current = 0;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    audioSequenceRef.current = 0;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;

    // TTS 중지 및 아바타 상태 초기화
    window.speechSynthesis.cancel();
    setIsAvatarSpeaking(false); // 아바타 말하기 상태 초기화

    if (socketRef.current) {
      if (sessionIdRef.current) {
        socketRef.current.emit('stop-video-stream', { 
          sessionId: sessionIdRef.current, 
          userId: 'temp-user', 
          reason: '사용자 요청' 
        });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    sessionIdRef.current = null;
  }, []);

  // --- 4. 영상 캡쳐 (이전과 동일) ---
  const startFrameCapture = useCallback(() => {
    if (!localStreamRef.current || !socketRef.current || !videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 640; canvas.height = 480;
    
    sessionIdRef.current = 'session_' + Date.now();
    
    socketRef.current.emit('start-video-stream', { 
      sessionId: sessionIdRef.current, 
      userId: 'temp-user',
      quality: { width: 640, height: 480, frameRate: 30, bitrate: 1000 },
      enableAudio: true,
      recordingEnabled: false,
      aiProcessingEnabled: true
    });
    
    streamIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        const frameId = 'frame_' + Date.now() + '_' + frameSequenceRef.current;
        
        socketRef.current.emit('video-frame', { 
          sessionId: sessionIdRef.current,
          frameId: frameId,
          timestamp: Date.now(),
          frameData, 
          sequenceNumber: frameSequenceRef.current++
        });
      }
    }, 100);
    console.log('📹 영상 캡처 시작');
  }, []);

  // --- 5. 음성 녹음 설정 (이전과 동일) ---
  const setupAudioCapture = useCallback(() => {
    if (!localStreamRef.current || !socketRef.current) return;
    try {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (!audioTrack) {
        console.error('❌ 오디오 트랙을 찾을 수 없습니다.');
        return;
      }
      
      const audioOnlyStream = new MediaStream([audioTrack]);

      const opusSupported = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
      const webmSupported = MediaRecorder.isTypeSupported('audio/webm');
      const mimeTypeToUse = opusSupported ? 'audio/webm;codecs=opus' : (webmSupported ? 'audio/webm' : '');

      if (!mimeTypeToUse) {
        console.error('❌ 지원되는 오디오 MIME 타입이 없어 음성 캡처를 시작할 수 없습니다.');
        return;
      }
      
      const recorder = new MediaRecorder(audioOnlyStream, {
        mimeType: mimeTypeToUse,
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 4000) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (socketRef.current && socketRef.current.connected) {
              const fullDataUrl = reader.result;
              const base64Prefix = 'base64,';
              const prefixIndex = fullDataUrl.indexOf(base64Prefix);
              let base64Audio = '';

              if (prefixIndex > -1) {
                base64Audio = fullDataUrl.substring(prefixIndex + base64Prefix.length);
              } else {
                base64Audio = fullDataUrl;
              }
              
              const audioFrameId = 'audio_' + Date.now() + '_' + audioSequenceRef.current;
              
              console.log('🔊 서버로 10초 분량 음성 데이터 전송...');
              socketRef.current.emit('audio-frame', {
                sessionId: sessionIdRef.current,
                frameId: audioFrameId,
                timestamp: Date.now(),
                audioData: base64Audio,
                sequenceNumber: audioSequenceRef.current++,
                format: 'webm'
              });
            }
          };
          reader.readAsDataURL(event.data);
        }
      };

      recorder.start(10000); // 10초마다 데이터 수집 시작
      console.log('🎤 음성 녹음 시작 (10초 간격)');
    } catch (error) {
      console.error(`❌ 음성 캡처 실패: ${error.message}`);
    }
  }, []);

  // --- 6. [신규] 아바타 말하기 애니메이션을 위한 useEffect ---
  useEffect(() => {
    let animationInterval = null;
    
    if (isAvatarSpeaking) {
      // 아바타가 말하는 중이면 0.3초마다 이미지 변경
      animationInterval = setInterval(() => {
        setCurrentAvatarImage(prev => (prev === avatarIcon ? avatar2Icon : avatarIcon));
      }, 300); // 0.3초 (300ms) 간격으로 전환
    } else {
      // 말이 끝나면 기본 이미지로 고정
      setCurrentAvatarImage(avatarIcon);
    }

    // 컴포넌트가 unmount되거나 isAvatarSpeaking이 바뀌면 인터벌 정리
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isAvatarSpeaking]); // isAvatarSpeaking 상태가 바뀔 때마다 이 훅이 실행됨

  // --- 7. 페이지 로드 useEffect (이전과 동일) ---
  useEffect(() => {
    const startProcess = async () => {
      socketRef.current = io('https://soulmate.kro.kr/video', {
        transports: ['websocket', 'polling'],
        secure: true
      });

      socketRef.current.on('connect', () => console.log('✅ 서버 연결됨'));
      socketRef.current.on('disconnect', () => console.log('❌ 서버 연결 해제됨'));
      
      socketRef.current.on('realtime-diary', (diary) => {
        console.log(`📝 실시간 일기 수신: ${diary.todayDiary}`);
        speak(diary.todayDiary);
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        startFrameCapture();
        setupAudioCapture();

      } catch (error) {
        console.error('❌ 미디어 접근 실패:', error);
        alert('카메라/마이크 접근에 실패했습니다.');
      }
    };
    startProcess();

    return () => {
      stopAllStreams();
    };
  }, [date, navigate, speak, setupAudioCapture, startFrameCapture, stopAllStreams]);

  // --- 8. '기록 끝' 버튼 클릭 핸들러 (이전과 동일) ---
  const handleEndRecording = () => {
    stopAllStreams();
    navigate(`/after-record/${date}`);
  };

  return (
    <Layout>
      <S.ContentContainer>
        <S.UserVideoWrapper>
          <S.LiveVideo ref={videoRef} autoPlay playsInline muted />
        </S.UserVideoWrapper>
        <S.AvatarVideoWrapper>
          {/* --- 9. [수정] 아바타 이미지를 currentAvatarImage state와 연결 --- */}
          <S.AvatarImage src={currentAvatarImage} alt="아바타" />
        </S.AvatarVideoWrapper>
        <S.EndRecordingButtonWrapper onClick={handleEndRecording}>
          <img src={endRecordingButtonImg} alt="기록 끝" />
        </S.EndRecordingButtonWrapper>
      </S.ContentContainer>
    </Layout>
  );
}

export default RecordingPage;