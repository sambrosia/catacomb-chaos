export function enterFullscreen(element) {
    if      (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.mozRequestFullscreen) element.mozRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

export function exitFullscreen() {
    if      (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozExitFullscreen) document.mozExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

export function isFullscreen(element) {
    if      (document.fullscreenElement == element) return true;
    else if (document.webkitFullscreenElement == element) return true;
    else if (document.mozFullscreenElement == element) return true;
    else if (document.msFullscreenElement == element) return true;
    return false;
}
