
window.addEventListener('DOMContentLoaded', (event) => {
    let sceneEl = document.querySelector('#links');
    let templateSrc = document.querySelector('#template-src');
    
    sceneEl.addEventListener('click', (event) => {
        if(event.target === event.currentTarget) return null;

        let src = event.target.parentElement.attributes['data-src'].value;

        let maskEl = document.querySelector('#mask');

        maskEl.emit('fade');

        setTimeout(() => {
            templateSrc.setAttribute('template', `src: ${src}`);
            maskEl.emit('fadeback');
        }, 200);

        event.stopPropagation();
    });
});
