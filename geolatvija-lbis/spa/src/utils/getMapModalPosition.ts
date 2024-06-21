interface MapModalProps{
    xMapLayout: number;
    yMapLayout: number;
    mapWidth: number;
    mapHeight: number;
    modalWidth: number;
    modalHeight: number;
}
export const getMapModalPosition = (xMapLayout: number, yMapLayout: number, mapWidth: number, mapHeight: number, modalWidth: number, modalHeight: number) => {
    const calcWidth = mapWidth - (xMapLayout + modalWidth);
    const left = calcWidth < 0 ? xMapLayout - (xMapLayout + modalWidth - mapWidth + 5) : xMapLayout;

    const calcHeight = mapHeight - (yMapLayout + modalHeight);
    const top = calcHeight < 0 ? yMapLayout - (yMapLayout + modalHeight - mapHeight + 5) : yMapLayout;

    return {left, top}
}