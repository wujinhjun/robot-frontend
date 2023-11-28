import { useState, useRef } from 'react';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import Markdown from 'react-markdown';
import axios from 'axios';

import type { EventSourceMessage } from '@microsoft/fetch-event-source';

import style from '../styles/chat.module.css';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;

type ChatDataResponseType = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { content: string };
    finish_reason: null;
  }>;
};

export default function ChatPage() {
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGettingAudio, setIsGettingAudio] = useState(false);
  const audioPlayerElementRef = useRef<HTMLAudioElement | null>(null);

  const handleInitAllContent = () => {
    setContent('');
    audioPlayerElementRef.current && (audioPlayerElementRef.current.src = '');
  };

  const handleChangePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  // 提交prompt
  const handleSubmitPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prompt.length === 0) {
      toast.error('请输入内容');
      return;
    }

    handleInitAllContent();
    const contentArray: string[] = [];
    await fetchEventSource(
      'https://openai.aihey.cc/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          // model: 'gpt-4-0314',
          messages: [{ role: 'user', content: prompt }],
          stream: true
        }),

        onmessage: (event: EventSourceMessage) => {
          const { data: originData } = event;

          if (originData === '[DONE]') {
            return;
          }

          const data: ChatDataResponseType = JSON.parse(originData);

          const content = data.choices[0].delta.content;
          if (content) {
            setContent((prev) => {
              return (prev += content);
            });
            contentArray.push(content);
          } else if (data.choices[0].finish_reason === 'stop') {
            toast.success('接收完成');
          }
        },

        onerror: (event: unknown) => {
          console.log('Error:');
          console.log(event);
          console.log('---');
          toast.error('出现错误');
          throw event;
        }
      }
    );

    setIsGettingAudio(true);
    await handleGetAudioSpeech(contentArray.join(''));
  };

  // 获取Audio
  const handleGetAudioSpeech = async (text: string) => {
    await fetch('https://openai.aihey.cc/openai/v1/audio/speech', {
      method: 'POST',
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: text
      }),
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.blob())
      .then((res) => {
        console.log(res);

        const url = URL.createObjectURL(res);
        const audioEle = audioPlayerElementRef.current;
        if (!audioEle) {
          return;
        }

        audioEle.src = url;
      })
      .then(() => {
        setIsGettingAudio(false);
      })
      .catch((err) => {
        console.log(err);

        toast.error('音频获取失败');
      })
      .finally(() => {
        console.log(isGettingAudio);
      });
  };

  // 播放声音
  const handlePlayAudioSpeech = (e: React.MouseEvent<HTMLButtonElement>) => {
    const audioPlayer = audioPlayerElementRef.current;
    if (!audioPlayer) {
      return;
    }

    audioPlayer.play();
    toast.success('开始播放');
  };

  return (
    <div className="p-3">
      chat page
      <form onSubmit={handleSubmitPrompt}>
        <div className="mb-6">
          <label
            htmlFor="prompt-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Prompt
          </label>
          <input
            type="text"
            id="prompt-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChangePrompt}
          />
        </div>
        <button type="submit" className={`${style['config-button']}`}>
          submit
        </button>
      </form>
      <div className="mt-6 border rounded p-2">
        生成结果
        {content.length > 0 ? (
          <>
            <section className="mt-2 border rounded-lg p-2">
              <Markdown>{content}</Markdown>
            </section>
            <button
              className={`${style['config-button']} mt-1`}
              onClick={handlePlayAudioSpeech}
              disabled={isGettingAudio}
            >
              播放音频
            </button>

            <audio controls ref={audioPlayerElementRef} />
          </>
        ) : null}
      </div>
    </div>
  );
}

// {"id":"chatcmpl-8MeUDTMtNdkEzmPN1NqLZEVuv5IZC","object":"chat.completion.chunk","created":1700409537,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}
