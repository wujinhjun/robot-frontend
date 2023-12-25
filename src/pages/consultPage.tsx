import { NavLink } from 'react-router-dom';

import doctorPng from '@/assets/doctor.png';
import { useEffect, useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const endpoint = import.meta.env.VITE_WS_ENDPOINT;
const projectId = import.meta.env.VITE_HW_PROJECT_ID;
const userSecret = import.meta.env.VITE_HW_USER_PASSWORD;
const username = import.meta.env.VITE_HW_USERNAME;
const domainName = import.meta.env.VITE_HW_DOMAIN_NAME;
const projectName = import.meta.env.VITE_HW_PROJECT_NAME;
const API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;

const prefix = 'data:audio/wav;base64,';

import {
  readBlobToArrayBuffer,
  readBlobToFloat32
} from '@/utils/readBlobToArrayBuffer';
import base64ToBlob from '@/utils/base64ToBlob';

export default function ConsultPage() {
  const [isConsultProcessing, setIsConsultProcessing] = useState(false);

  const [isAudioRecording, setIsAudioRecording] = useState(false);

  const audioBlobRef = useRef<Blob | null>(null);

  // audio 的 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // 录音机的ref
  const audioRecorderRef = useRef<MediaStream | null>(null);

  // 音频是否正在播放
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // hw的token
  const [hwToken, setHwToken] = useState('');

  // 语音转文字的结果
  const speechToTextResultRef = useRef('');
  // 生成的文字内容
  const generatedTextRef = useRef('');

  const handleConsultSubmitToText = async () => {
    if (audioBlobRef.current === null) {
      return;
    }

    // setIsConsultProcessing(true);

    const socket = io('ws://localhost:3000');

    const data = await readBlobToArrayBuffer(audioBlobRef.current);

    socket.emit('chat audio', {
      token: hwToken,
      projectId: projectId,
      endpoint: endpoint,
      data: data
    });

    socket.on('chat audio', (msg) => {
      switch (msg.type) {
        case 'RESULT':
          speechToTextResultRef.current = msg.data;
          toast.success('语音转文字成功');
          handleSubmitTextToChatGPT();
          break;
        case 'ERROR':
          toast.error(msg.data);
          break;
        default:
          console.log(msg);
      }
    });
  };

  const handleSubmitTextToChatGPT = async () => {
    const text = speechToTextResultRef.current;
    fetch('https://api.openai-proxy.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        // model: 'gpt-4-0314',
        messages: [{ role: 'user', content: text }]
      })
    })
      .then((res) => res.json())
      .then((res) => {
        const reply = res.choices[0].message.content;
        generatedTextRef.current = reply;
        toast.success('生成文字成功');
        return reply;
      })
      .then((reply) => {
        handleSubmitTextToGenerateAudio(reply);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitTextToGenerateAudio = (text: string) => {
    const url = `/hw-tts-api/${projectId}/tts`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': hwToken
      },
      body: JSON.stringify({
        text,
        config: {
          audio_format: 'mp3',
          sample_rate: '16000',
          property: 'chinese_xiaoyan_common',
          speed: 10,
          pitch: 10,
          volume: 60
        }
      })
    })
      .then((res) => res.json())
      .then((res) => {
        const audioBlob = base64ToBlob(res.result.data, 'mp3');
        setIsConsultProcessing(false);

        audioRef.current!.src = window.URL.createObjectURL(audioBlob);
        audioRef.current!.play();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startAudioRecording = async () => {
    try {
      audioRecorderRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const ac = new AudioContext({ sampleRate: 16000 });

      const source = ac.createMediaStreamSource(audioRecorderRef.current);
      const dest = ac.createMediaStreamDestination();

      source.connect(dest);

      const mediaRecorder = new MediaRecorder(dest.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordBlob = new Blob(chunks, { type: 'audio/wav' });
        audioBlobRef.current = recordBlob;

        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(recordBlob);
          audioRef.current.controls = true;
        }
        handleConsultSubmitToText();
      };

      mediaRecorderRef.current = mediaRecorder;
      setIsAudioRecording(true);
      setIsConsultProcessing(true);

      mediaRecorder.start();
    } catch (err) {
      console.error(err);
    }
  };

  const stopAudioRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsAudioRecording(false);
    }

    if (audioRecorderRef.current) {
      audioRecorderRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const isObjectEmpty = (obj: Record<string, unknown>) => {
    return Reflect.ownKeys(obj).length === 0;
  };

  const handleListenAudioTimeUpdate = useCallback(() => {
    const audioEle = audioRef.current;

    if (!audioEle) {
      return;
    }

    if (audioEle.src.length === 0) {
      return;
    }

    const duration = audioEle.duration;
    const currentTime = audioEle.currentTime;

    if (currentTime >= duration) {
      setIsAudioPlaying(false);
    } else if (duration > 0 && !isAudioPlaying) {
      setIsAudioPlaying(true);
    }
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('hw-rasr-token') || '{}');

    const expiresAt = token.expiresAt;
    const now = Date.now();
    const isTokenExpired = now > expiresAt;

    setHwToken(token.token);

    if (isObjectEmpty(token) || isTokenExpired) {
      fetch('/hw-api/v3/auth/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth: {
            identity: {
              methods: ['password'],
              password: {
                user: {
                  name: username,
                  password: userSecret,
                  domain: {
                    name: domainName
                  }
                }
              }
            },
            scope: {
              project: {
                name: projectName
              }
            }
          }
        })
      })
        .then((res) => {
          return res.headers.get('X-Subject-Token');
        })
        .then((res) => {
          if (res === null) {
            return;
          }
          const token = {
            token: res,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000
          };
          console.log('success');
          setHwToken(res);
          localStorage.setItem('hw-rasr-token', JSON.stringify(token));
        })
        .catch((err) => {
          toast.error('获取token失败');
          console.error(err);
        });
    }

    audioRef.current &&
      audioRef.current.addEventListener(
        'timeupdate',
        handleListenAudioTimeUpdate
      );

    // 在组件卸载时移除事件监听器
    return () => {
      audioRef.current &&
        audioRef.current.removeEventListener(
          'timeupdate',
          handleListenAudioTimeUpdate
        );
    };
  }, []);

  return (
    <>
      <div className="row-start-1 row-end-2 col-start-1 col-end-2 z-[2] self-center justify-items-center justify-self-center">
        <div className="mt-20 h-fit flex flex-col justify-center items-center">
          <h1 className="text-white font-bold text-[4rem] h-fit pb-24">
            您好！想咨询什么问题呢？
          </h1>
          <div
            className="relative"
            //   onClick={handleConsultSubmit}
            onClick={() => {
              if (isAudioRecording) {
                stopAudioRecording();
              } else {
                startAudioRecording();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="49"
              height="55"
              viewBox="0 0 49 55"
              fill="none"
              className={
                '-right-8 -top-4 absolute transition-all ' +
                `${isConsultProcessing ? 'opacity-1' : 'opacity-0'}`
              }
            >
              <path
                d="M27.5 0V55H34.375V0H27.5ZM13.75 6.875V48.125H20.625V6.875H13.75ZM41.25 13.75V41.25H48.125V13.75H41.25ZM0 20.625V34.375H6.875V20.625H0Z"
                fill="white"
              />
            </svg>
            <svg
              width="102"
              height="137"
              viewBox="0 0 102 137"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isAudioPlaying ? 'opacity-50' : ''}
            >
              <g id="&#240;&#159;&#166;&#134; icon &#34;microphone&#34;">
                <path
                  id="Vector"
                  d="M49.2239 0.0697645C48.4781 0.190164 47.7411 0.36024 47.0179 0.578858C43.1898 1.44095 39.7788 3.60303 37.3654 6.69707C34.9521 9.79111 33.6856 13.6259 33.7814 17.5487V51.4882C33.7814 55.9889 35.5693 60.3052 38.7518 63.4877C41.9342 66.6702 46.2506 68.458 50.7512 68.458C55.2519 68.458 59.5682 66.6702 62.7507 63.4877C65.9331 60.3052 67.721 55.9889 67.721 51.4882V17.5487C67.8031 15.1432 67.3726 12.7478 66.458 10.5214C65.5434 8.29508 64.1657 6.28876 62.4163 4.63567C60.6669 2.98258 58.5859 1.72054 56.3114 0.933324C54.0369 0.146112 51.6209 -0.148255 49.2239 0.0697645ZM5.78127 34.5184C4.02506 35.1088 2.51036 36.2578 1.46852 37.7899C0.426675 39.3221 -0.0850363 41.1531 0.0115391 43.0033V51.4882C0.0115391 76.6035 18.5086 97.137 42.436 101.379V119.367H33.9511C24.6177 119.367 16.9813 127.004 16.9813 136.337H85.0302C85.0302 127.004 77.3938 119.367 68.0604 119.367H59.5755V101.379C83.5029 97.3067 102 76.6035 102 51.4882V43.0033C102 40.753 101.106 38.5948 99.5148 37.0036C97.9236 35.4124 95.7654 34.5184 93.5151 34.5184C91.2648 34.5184 89.1066 35.4124 87.5154 37.0036C85.9242 38.5948 85.0302 40.753 85.0302 43.0033V51.4882C85.0302 70.3247 69.9271 85.4278 51.0906 85.4278C32.2542 85.4278 17.151 70.3247 17.151 51.4882V43.0033C17.1716 41.7481 16.9133 40.5039 16.3949 39.3606C15.8764 38.2172 15.1107 37.2031 14.1529 36.3915C13.1952 35.5798 12.0693 34.9908 10.8563 34.6669C9.64342 34.343 8.37374 34.2923 7.13885 34.5184C6.79976 34.4981 6.45976 34.4981 6.12067 34.5184H5.78127Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>

          <audio
            ref={audioRef}
            controls={false}
            className="mt-8 hidden"
            // style={{ display: 'none' }}
          />
        </div>
      </div>
      <img
        src={doctorPng}
        alt=""
        className=" row-start-1 row-end-2 col-start-2 col-end-3 self-end z-[3] origin-bottom-right "
      />
    </>
  );
}
