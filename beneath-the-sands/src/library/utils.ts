import { Device, WindowSize, DeviceConstraints } from './definitions';

export const getDeviceType = (windowSize: WindowSize): Device => {
    if(!windowSize || windowSize.width === 0) throw new Error('Issue occurred while determining device type. Window size was invalid.');

    const isMobile = windowSize.width <= DeviceConstraints.mobile;
    const isTablet = windowSize.width <= DeviceConstraints.tablet;

    return isMobile 
                ? Device.Mobile 
                : isTablet 
                ? Device.Tablet 
                : Device.Desktop;

};
