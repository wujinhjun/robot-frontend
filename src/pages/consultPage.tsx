import { NavLink } from 'react-router-dom';

import doctorPng from '@/assets/doctor.png';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const endpoint = import.meta.env.VITE_WS_ENDPOINT;
const projectId = import.meta.env.VITE_HW_PROJECT_ID;
const userSecret = import.meta.env.VITE_HW_USER_PASSWORD;
const username = import.meta.env.VITE_HW_USERNAME;
const domainName = import.meta.env.VITE_HW_DOMAIN_NAME;
const projectName = import.meta.env.VITE_HW_PROJECT_NAME;

export default function ConsultPage() {
  const [isConsultProcessing, setIsConsultProcessing] = useState(false);

  const [isAudioRecording, setIsAudioRecording] = useState(false);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [hwToken, setHwToken] = useState('');

  const handleConsultSubmit = () => {
    setIsConsultProcessing(true);

    const socket = io('ws://localhost:3000');
    console.log(audioBlobRef.current);

    socket.emit(
      'chat audio',
      JSON.stringify({
        token: hwToken,
        projectId: projectId,
        endpoint: endpoint,
        data: audioBlobRef.current
      })
    );

    socket.on('chat audio', (msg) => {
      console.log(msg);
    });
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      const channel = peerConnection.createDataChannel('audioDataChannel');

      channel.onopen = () => {
        console.log('channel open');
      };

      channel.onmessage = (event) => {
        console.log(event);
      };

      channel.onclose = () => {
        console.log('channel close');
      };
      //   const mediaRecorder = new MediaRecorder(stream);
      //   const chunks: Blob[] = [];

      //   mediaRecorder.ondataavailable = (event) => {
      //     if (event.data.size > 0) {
      //       console.log(event);

      //       chunks.push(event.data);
      //     }
      //   };

      //   mediaRecorder.onstop = () => {
      //     const recordBlob = new Blob(chunks, { type: 'audio/wav' });
      //     audioBlobRef.current = recordBlob;
      //     setAudioBlob(recordBlob);
      //     if (audioRef.current) {
      //       audioRef.current.src = URL.createObjectURL(recordBlob);
      //       audioRef.current.controls = true;
      //     }
      //     console.log(recordBlob);

      //     handleConsultSubmit();
      //   };

      //   mediaRecorderRef.current = mediaRecorder;
      //   setIsAudioRecording(true);
      //   mediaRecorder.start();
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

    console.log(audioBlobRef.current);
  };

  const isObjectEmpty = (obj: Record<string, unknown>) => {
    return Reflect.ownKeys(obj).length === 0;
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('hw-rasr-token') || '{}');
    // const originToken = localStorage.getItem('hw-rasr-token') || '{}';
    // const token = JSON.parse(originToken);

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
  }, []);

  return (
    <>
      <div className="row-start-1 row-end-2 col-start-1 col-end-2 z-[2] self-center justify-items-center justify-self-center">
        <NavLink to="/" className={' '}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="61"
            height="89"
            viewBox="0 0 61 89"
            fill="none"
          >
            <path
              d="M44.3636 0L0 44.3636L44.3636 88.7273L61 72.0909L33.2727 44.3636L61 16.6364L44.3636 0Z"
              fill="white"
            />
          </svg>
        </NavLink>

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
              //   handleConsultSubmit();
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
            className="mt-8"
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
