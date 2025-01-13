import DeviceDetector from "device-detector-js";

export const checkDeviceSupport = () => {
  const deviceDetector = new DeviceDetector();
  const detectedDevice = deviceDetector.parse(navigator.userAgent);
  
  const isChrome = /^Chrome$/.test(detectedDevice.client?.name || '');
  
  if (!isChrome) {
    console.warn(`Running on ${detectedDevice.client?.name}/${detectedDevice.os?.name} - some features may be limited`);
    return false;
  }
  
  return true;
};