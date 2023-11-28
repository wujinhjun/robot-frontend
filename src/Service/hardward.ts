import { SerialPortType } from '@/types/config';

const headers = {
  ContentType: 'application/json'
};

// 获取列表
function getAvailableSerialList(): Promise<SerialPortType[]> {
  return fetch('/api/hardware/serials')
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
}

// 更改串口
function changeNewSerialPort(target: string) {
  return fetch('/api/hardware/serials', {
    method: 'POST',
    body: JSON.stringify({
      serial: target
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 获取并测试串口
function getCurrentSerialPortAndStatus() {
  return fetch('/api/hardware/port', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

const hardwareService = {
  getAvailableSerialList,
  changeNewSerialPort,
  getCurrentSerialPortAndStatus
};

export default hardwareService;
