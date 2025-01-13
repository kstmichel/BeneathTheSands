import "@testing-library/jest-dom";
import { Device } from './definitions';
import { getDeviceType } from './utils';

describe('getDeviceType Utility Function', () => {
    const desktopDimensions = {width: 1030, height: 768};
    const tabletDimensions = {width: 1000, height: 1024};
    const mobileDimensions = {width: 655, height: 812};

    it('returns Device.Desktop when window size is larger than Tablet width constraint', () => {
        const deviceType = getDeviceType(desktopDimensions);

        expect(deviceType).toEqual(Device.Desktop);
    });

    it('returns Device.Tablet when window size is larger than Mobile width constraint', () => {
        const deviceType = getDeviceType(tabletDimensions);

        expect(deviceType).toEqual(Device.Tablet);
    });

    it('returns Device.Mobile when window size is less than the Tablet width constraint', () => {
        const deviceType = getDeviceType(mobileDimensions);

        expect(deviceType).toEqual(Device.Mobile);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred while determining device type. Window size was invalid.";

        it('throws error when windowSize is null', () => {
            expect(() => getDeviceType(null)).toThrow(errorMessage);
        });

        it('throws error when windowSize.width is 0', () => {
            expect(() => getDeviceType({width: 0, height: 1000})).toThrow(errorMessage);
        });
    })
});
