import { useEffect, useState } from 'react';
import { CheckIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import hardwareService from '@/Service/hardward';
import { SerialPortType } from '@/types/config';

import style from '@/styles/config.module.css';

export default function ConfigPage() {
  const [availableSerialList, setAvailableSerialList] = useState<
    Array<SerialPortType>
  >([]);

  const [activeSerialPort, setActiveSerialPort] = useState<string>('');
  const [currentSerialPort, setCurrentSerialPort] = useState<string>('');
  const [currentSerialPortStatus, setCurrentSerialPortStatus] =
    useState<boolean>(false);

  // 更改当前选中的串口
  const handleChangeActiveSerialPort = (port: string) => {
    if (port === activeSerialPort) {
      setActiveSerialPort('');
    } else {
      setActiveSerialPort(port);
    }
  };

  // 处理串口选择
  const handleSerialPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeActiveSerialPort((e.target as HTMLInputElement).value);
  };

  // 网络请求部分

  // 提交新的串口
  const handleSubmitNewSerialPort = () => {
    if (activeSerialPort === '') {
      toast.error('请选择一个串口');
      return;
    }

    hardwareService
      .changeNewSerialPort(activeSerialPort)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        handleGetCurrentSerialPort();
      });
  };

  // 测试当前的串口
  const handleGetCurrentSerialPort = () => {
    hardwareService
      .getCurrentSerialPortAndStatus()
      .then((res) => res.json())
      .then((res) => {
        const { port, status } = res.data;
        setCurrentSerialPort(port);
        setCurrentSerialPortStatus(status);
      });
  };

  useEffect(() => {
    hardwareService.getAvailableSerialList().then((list) => {
      setAvailableSerialList(list);
    });

    hardwareService
      .getCurrentSerialPortAndStatus()
      .then((res) => res.json())
      .then((res) => {
        const { port, status } = res.data;
        setCurrentSerialPort(port);
        setActiveSerialPort(port);
        setCurrentSerialPortStatus(status);
      });
  }, []);

  return (
    <section>
      <div className="p-4">
        <p className="mb-3">设备上可用的串口有：</p>
        <ul>
          {availableSerialList.map((port) => (
            <li key={port.path} className="mb-2">
              <input
                type="checkbox"
                id={port.path}
                value={port.path}
                name={port.path}
                checked={activeSerialPort === port.path}
                className={'hidden ' + `${style['input-status']}`}
                onChange={handleSerialPortChange}
              />

              <label htmlFor={port.path} className="flex items-center">
                <div className={`${style['icon-wrapper']} mr-2`}>
                  <CheckIcon className={`${style['icon']}`} />
                </div>
                {port.friendlyName}
              </label>
            </li>
          ))}
        </ul>
        <button
          className={`${style['config-button']}`}
          onClick={handleSubmitNewSerialPort}
        >
          提交
        </button>
      </div>

      <section className="p-4">
        <div className="pb-2 flex items-center">
          <span>
            当前串口为：{currentSerialPort === '' ? 'null' : currentSerialPort}
            。
          </span>
          <span>状态：</span>
          <div className="inline w-8">
            <LightBulbIcon
              className={`${style['status-bulb']} ${
                currentSerialPort === ''
                  ? 'null'
                  : currentSerialPortStatus
                  ? 'success'
                  : 'error'
              }`}
            />
          </div>
          <div></div>
        </div>
        <button
          className={`${style['config-button']}`}
          onClick={handleGetCurrentSerialPort}
        >
          刷新
        </button>
      </section>
    </section>
  );
}
