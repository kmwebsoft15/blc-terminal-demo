
export const animateButton = (menu) => {
    let element = document.getElementById(menu);
    element.animate([
        { transform: 'scale(0.5)' },
        { transform: 'scale(1.0)' }
    ], {
        duration: 300,
        iterations: 1
    });
};