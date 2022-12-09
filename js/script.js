window.addEventListener('DOMContentLoaded', () => {
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach((item) => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');

        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item === target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //timer
    const deadLine = '2023-1-1';

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - new Date();
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
        return {
            total: t, days: days, hours: hours, minutes: minutes, seconds: seconds,
        };
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector), days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'), minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'), timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endTime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    //modal
    const modalTrigger = document.querySelectorAll('[data-modal]'), modal = document.querySelector('.modal');
    // modalCloseBtn = document.querySelector('[data-close]');

    const modalTimerId = setTimeout(openModal, 50000);

    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    // modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    //class for card
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = +this.price * this.transfer;
        }

        render() {
            const elem = document.createElement('div');
            if (this.classes.length === 0) {
                this.elem = 'menu__item';
                elem.classList.add(this.elem);
            } else {
                this.classes.forEach((className) => elem.classList.add(className));
            }

            elem.innerHTML = `
        <img src=${this.src} alt=${this.alt} />
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">
          ${this.descr}
        </div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
          `;

            this.parent.append(elem);
        }
    }

    const getResourse = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw  new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, alt, title, descr, price}) => {
                new MenuCard(img, alt, title, descr, price, '.menu .container').render();
            })
        })

    // axios.get('http://localhost:3000/menu')
    //     .then(data => {
    //         data.data.forEach(({img, alt, title, descr, price}) => {
    //             new MenuCard(img, alt, title, descr, price, '.menu .container').render();
    //         })


    //Forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg', success: 'Thanks! We will contact you soon =)', failure: 'Fatal Error',
    };

    forms.forEach((item) => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: data,
        });
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then((data) => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch(' http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res))

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

//calc
    const result = document.querySelector('.calculating__result span');
    let sex='female', height, weight, age, ratio = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '0'
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInfo(parent, active) {
        const elements = document.querySelectorAll(`${parent} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute(('data-ratio'));

                } else {
                    sex = e.target.getAttribute('id')
                }
                console.log(ratio, sex);

                elements.forEach(elem => {
                    elem.classList.remove(active);
                });
                e.target.classList.add(active);
                calcTotal();
            })
        })
       
    }
    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            
            
            if (input.value.match(/\D/g)) {
                
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case  'weight':
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }
            calcTotal();
        })
    }
    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});
