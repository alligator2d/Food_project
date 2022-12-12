function slider () {
    //slider

    const images = document.querySelectorAll('.offer__slide');
    const next = document.querySelector('.offer__slider-next');
    const prev = document.querySelector('.offer__slider-prev');
    let currentId = document.querySelector('#current');
    let count = 0;

    next.addEventListener('click', nextImg);
    prev.addEventListener('click', prevImg);

    hideImg(images, 'hide');
    resetSlider();

    function hideImg(arr, hideClass) {
        arr.forEach(x => x.classList.add(hideClass));
    }

    function resetSlider() {
        count = 0;
        currentId.innerHTML = `01`;
        images[count].classList.remove('hide');

    }

    function nextImg() {
        count++;
        hideImg(images, 'hide');
        if (!images[count]) {
            resetSlider();
        } else {
            images[count].classList.remove('hide');
            currentId.innerHTML = `0${count + 1}`;
        }

    }

    function prevImg() {
        count--;
        hideImg(images, 'hide');
        if (!images[count]) {
            resetSlider();

        } else {
            images[count].classList.remove('hide');
            currentId.innerHTML = `0${count + 1}`;

        }
        if (count < 1) {
            count = images.length;
        }
    }
}
export default slider;