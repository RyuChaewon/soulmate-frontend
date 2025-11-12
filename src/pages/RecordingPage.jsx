// src/pages/RecordingPage.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
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

  const [userId] = useState(() => localStorage.getItem('uuid') || 'b23cbc0e-d22b-4ce4-8178-f936f87a19c9');
  
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamIntervalRef = useRef(null);
  
  const sessionIdRef = useRef(null);
  const frameSequenceRef = useRef(0);
  const audioSequenceRef = useRef(0);

  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentAvatarImage, setCurrentAvatarImage] = useState(avatarIcon);
  const [aiResponseText, setAiResponseText] = useState('');

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return alert("음성 합성을 지원하지 않는 브라우저입니다.");
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    
    utterance.onstart = () => setIsAvatarSpeaking(true);
    utterance.onend = () => setIsAvatarSpeaking(false);
    
    console.log(`🎤 아바타 음성 재생: "${text}"`);
    window.speechSynthesis.speak(utterance);
  }, []);

  // --- 3. [수정됨] 모든 스트림과 연결을 중지하는 함수 ---
  const stopAllStreams = useCallback(() => {
    console.log('--- 🛑 모든 스트림과 연결을 중지합니다 ---');

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = null;
    frameSequenceRef.current = 0;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    audioSequenceRef.current = 0;

    if (videoRef.current) videoRef.current.srcObject = null;

    window.speechSynthesis.cancel();
    setIsAvatarSpeaking(false);
    setAiResponseText('');

    if (socketRef.current) {
      if (sessionIdRef.current) {
        console.log(`[Socket] 'stop-video-stream' 이벤트 전송: sessionId=${sessionIdRef.current}, userId=${userId}`);
        
        // DTO 규격에 맞게 'reason' 필드 포함 (Optional)
        socketRef.current.emit('stop-video-stream', { 
          sessionId: sessionIdRef.current, 
          userId: userId,
          reason: '사용자 종료'
        });
      }
      
      // --- ✅ [핵심 수정] ---
      // ❗️ emit() 직후 disconnect()를 호출하면 서버가 메시지를 받지 못하므로 제거합니다.
      // ❗️ 연결 종료는 useEffect의 cleanup 함수 또는 서버의 handleDisconnect가 처리합니다.
      // socketRef.current.disconnect(); 
      // socketRef.current = null;
    }
    sessionIdRef.current = null;
  }, [userId]); // userId 의존성 추가

  // --- 4. 영상 캡쳐 (DTO에 맞춤) ---
  const startFrameCapture = useCallback(() => {
    if (!localStreamRef.current || !socketRef.current || !videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 640; canvas.height = 480;
    
    const tempSessionId = 'session_' + Date.now();
    
    console.log(`[Socket] 'start-video-stream' 이벤트 전송: sessionId=${tempSessionId}, userId=${userId}`);
    
    // DTO(StartVideoStreamDto) 규격에 맞춤
    socketRef.current.emit('start-video-stream', {
      sessionId: tempSessionId, 
      userId: userId,
      quality: {
        width: 640, 
        height: 480,
        frameRate: 30,
        bitrate: 1000
      },
      enableAudio: true,
      recordingEnabled: false,
      aiProcessingEnabled: true
    });
    
    streamIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.videoWidth > 0 && socketRef.current && sessionIdRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.4).split(',')[1];
        const frameId = 'frame_v_' + Date.now() + '_' + frameSequenceRef.current;
        
        // DTO(VideoFrameDto) 규격에 맞춤
        socketRef.current.emit('video-frame', { 
          sessionId: sessionIdRef.current,
          frameId: frameId,
          timestamp: Date.now(),
          frameData, 
          sequenceNumber: frameSequenceRef.current++
        });
      }
    }, 150);
    console.log('📹 영상 캡처 시작');
  }, [userId]);

  // --- 5. 음성 녹음 설정 (DTO에 맞춤) ---
  const setupAudioCapture = useCallback(() => {
    if (!localStreamRef.current || !socketRef.current) return;
    try {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (!audioTrack) {
        console.error('❌ 오디오 트랙을 찾을 수 없습니다.');
        return;
      }
      
      const audioOnlyStream = new MediaStream([audioTrack]);
      const mimeTypeToUse = 'audio/webm;codecs=opus';

      if (!MediaRecorder.isTypeSupported(mimeTypeToUse)) {
        console.error('❌ audio/webm;codecs=opus 타입을 지원하지 않습니다.');
        return;
      }
      
      const recorder = new MediaRecorder(audioOnlyStream, {
        mimeType: mimeTypeToUse,
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 100) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (socketRef.current && socketRef.current.connected && sessionIdRef.current) {
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
              
              // DTO(AudioFrameDto) 규격에 맞춤
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
        
        if (mediaRecorderRef.current) {
           mediaRecorderRef.current.stop();
        }
      };

      recorder.onstop = () => {
        if (localStreamRef.current && mediaRecorderRef.current) { 
          mediaRecorderRef.current.start(5000);
        } else {
          console.log('🎤 녹음 루프 정지 (스트림 종료됨)');
        }
      };

      recorder.start(5000);
      console.log('🎤 음성 녹음 시작 (5초 간격)');
    } catch (error) {
      console.error(`❌ 음성 캡처 실패: ${error.message}`);
    }
  }, []);

  // --- 6. 아바타 말하기 애니메이션 useEffect ---
  useEffect(() => {
    let animationInterval = null;
    
    if (isAvatarSpeaking) {
      animationInterval = setInterval(() => {
        setCurrentAvatarImage(prev => (prev === avatarIcon ? avatar2Icon : avatarIcon));
      }, 300);
    } else {
      setCurrentAvatarImage(avatarIcon);
    }

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isAvatarSpeaking]);

  // --- 7. 페이지 로드 useEffect (STT 수정) ---
  useEffect(() => {
    const unlockAudioContext = () => {
      const voices = window.speechSynthesis.getVoices(); 
      const speakDummy = () => {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
        const dummyUtterance = new SpeechSynthesisUtterance(' ');
        dummyUtterance.volume = 0;
        dummyUtterance.lang = 'ko-KR';
        window.speechSynthesis.speak(dummyUtterance);
      };
      if (voices.length > 0) speakDummy();
      else window.speechSynthesis.onvoiceschanged = () => speakDummy();
    };

    const startProcess = async () => {
      socketRef.current = io('https://soulmate.kro.kr/video', {
        transports: ['websocket', 'polling'],
        secure: true
      });

      socketRef.current.on('connect', () => console.log('✅ 서버 연결됨'));
      socketRef.current.on('disconnect', () => console.log('❌ 서버 연결 해제됨'));
      
      socketRef.current.on('video-stream-started', (data) => {
        console.log('🎉 [ON] video-stream-started', data);
        if(data.sessionId) sessionIdRef.current = data.sessionId;
      });

      let diaryTextBuffer = '';
      socketRef.current.on('diary-stream-start', () => {
        diaryTextBuffer = '';
        setAiResponseText('');
      });

      socketRef.current.on('diary-stream-chunk', (chunk) => {
        diaryTextBuffer += chunk;
        setAiResponseText(prev => prev + chunk);
      });

      socketRef.current.on('diary-stream-end', () => {
        if (diaryTextBuffer.trim()) speak(diaryTextBuffer);
        diaryTextBuffer = '';
      });
      
      socketRef.current.on('diary-analysis', (data) => {
        console.log('🧠 [ON] diary-analysis', data);
        if (data && data.advice) {
          speak(data.advice);
          setAiResponseText(data.advice);
        }
      });
      
      socketRef.current.on('stt-transcript', (data) => {
        console.log(`🗣️ [ON] stt-transcript: ${data.text}`);
      });
      
      socketRef.current.on('final-diary', (data) => {
         console.log('📗 [ON] final-diary (일기 생성 완료 신호)', data);
         // (참고) UI를 바꾸지 않기 위해 이 데이터는 사용하지 않지만,
         // 서버가 완료했음을 확인하는 로그입니다.
      });

      socketRef.current.on('video-stream-error', (err) => console.error('❌ [ON] video-stream-error', err));
      socketRef.current.on('diary-stream-error', (err) => console.error('❌ [ON] diary-stream-error', err));
      socketRef.current.on('exception', (err) => console.error('❌ [ON] exception (서버 오류)', err));

      try {
        // --- ✅ [핵심 수정] ---
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: {
            sampleRate: 48000, // ❗️ Google STT Opus 코덱이 지원하는 값으로 지정
            channelCount: 1,  // ❗️ 모노 채널로 지정 (권장)
          }
        });

        const audioSettings = stream.getAudioTracks()[0].getSettings();
        console.log('🎤 실제 적용된 오디오 설정:', audioSettings);

        unlockAudioContext();
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
      // 컴포넌트가 사라질 때 (페이지 이동 시) 실행되는 정리 함수
      stopAllStreams();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [date, navigate, speak, setupAudioCapture, startFrameCapture, stopAllStreams, userId]);

  // --- 8. '기록 끝' 버튼 핸들러 (UI 변경 없음) ---
  const handleEndRecording = () => {
    stopAllStreams(); // 1. 서버에 "일기 생성" 요청 (버그 수정됨)
    navigate(`/after-record/${date}`); // 2. (요청대로) 즉시 이동
  };

  return (
    <Layout>
      <S.ContentContainer>
        <S.UserVideoWrapper>
          <S.LiveVideo ref={videoRef} autoPlay playsInline muted />
        </S.UserVideoWrapper>
        
        <S.AvatarVideoWrapper>
          {aiResponseText && (
            <S.AvatarSpeechBubble>
              {aiResponseText}
            </S.AvatarSpeechBubble>
          )}
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