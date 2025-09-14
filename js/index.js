let APP = {}
let $document = $(document)

// CLASSES ========================================================================
class ModalWindow {
    constructor(modalSelector, openHandlerSelector, closeHandlerSelector) {
        this.$modal = $(modalSelector)
        this.$modalContent = $(`${modalSelector}__content`)
        this.$openBtn = $(openHandlerSelector)
        this.$closeBtn = $(closeHandlerSelector)
        this.INTERACTIVE_ELEMENTS = `${modalSelector}__content, ${openHandlerSelector}`
        this.init()
    }

    openModal() {
        this.openOptions()
        this.$modal.fadeIn(400)
        this.$openBtn.addClass('open')

    }
    openOptions() { }

    closeModal() {
        this.closeOptions()
        this.$modal.fadeOut(400)
        this.$openBtn.removeClass('open')

    }
    closeOptions() { }

    modalHandler() {
        if (this.$openBtn.hasClass('open')) {
            this.closeModal()
        } else {
            this.openModal()
        }
    }

    init() {
        this.$modal.hide()
        this.$openBtn.on('click', () => this.modalHandler())
        this.$closeBtn.on('click', () => this.closeModal())

        $(document).on('click', (e) => {
            if (!$(e.target).closest(this.INTERACTIVE_ELEMENTS).length) {
                this.closeModal()
            }
        })
    }
}

// APP UTILS =======================================================================
APP.utils = {
    debounce: (func, delay) => {
        let timeoutId
        return function (...args) {
            const context = this
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                func.apply(context, args)
            }, delay)
        }
    },
    throttle: (func, delay) => {
        let lastCall = 0
        return function (...args) {
            const context = this
            const now = Date.now()
            if (now - lastCall >= delay) {
                func.apply(context, args)
                lastCall = now
            }
        }
    },
    copyToClipboard: (stringToCopy) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(stringToCopy)
                .then(() => {
                })
                .catch(err => {
                    console.error('Failed to copy with clipboard API', err);
                    fallbackCopy(stringToCopy);
                });
        } else {
            fallbackCopy(stringToCopy);
        }

        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // avoid scrolling to bottom
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    console.log('Link copied using fallback method!');
                } else {
                    console.warn('Fallback copy failed');
                }
            } catch (err) {
                console.error('Fallback copy error', err);
            }
            document.body.removeChild(textarea);
        }
    }
}

// icons
const icons = {
    nextSvg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.81171 3C5.73263 3 5.65171 3.03357 5.59103 3.09873C5.46966 3.22905 5.46966 3.44229 5.59103 3.57261L9.74513 8.03307L5.65171 12.4284C5.53034 12.5587 5.53034 12.7719 5.65171 12.9023C5.77308 13.0326 5.97168 13.0326 6.09305 12.9023L10.409 8.27002C10.5303 8.1397 10.5303 7.92645 10.409 7.79613L6.0342 3.09873C5.97168 3.03159 5.89262 3 5.81171 3Z" fill="#0F1D4E" stroke="#0F1D4E"/>
</svg>`,
    prevSvg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.1883 13C10.2674 13 10.3483 12.9664 10.409 12.9013C10.5303 12.771 10.5303 12.5577 10.409 12.4274L6.25487 7.96693L10.3483 3.57163C10.4697 3.44131 10.4697 3.22806 10.3483 3.09774C10.2269 2.96742 10.0283 2.96742 9.90695 3.09774L5.59103 7.72998C5.46966 7.8603 5.46966 8.07355 5.59103 8.20387L9.9658 12.9013C10.0283 12.9684 10.1074 13 10.1883 13Z" fill="#0F1D4E" stroke="#0F1D4E"/>
</svg>`
}

// MAIN LOGIC =======================================================================
APP.site = {
    modals: () => {
        const mainModal = new ModalWindow(
            '.modal',
            '.openModal',
            '.closeModal'
        )

        mainModal.open()
        mainModal.closeOptions = () => {
            console.log('i changes close options:',)
        }

        setTimeout(() => {
            mainModal.close()

        }, 5000)
    }
}

APP.header = {}

APP.header.navigationMenu = {

    menuIsOpen: false,
    isMobile: false,
    headerLinksNode: $('.header-links-menu'),
    btnNode: $('[data-open-menu]'),

    handleClick: function () {
        const that = this
        this.btnNode.on('click', (e) => {
            e.stopPropagation(); // щоб клік по кнопці не закривав меню одразу

            if (this.menuIsOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        });

        const INTERACTIVE_ELEMENTS = '.header-links-menu__dropdown, [data-open-menu]'
        $(document).click(function (e) {
            if (!$(e.target).closest(INTERACTIVE_ELEMENTS).length) {
                that.closeMenu()
            }
        })
    },
    openMenu: function () {
        this.menuIsOpen = true;
        this.btnNode.addClass('active')
        $('header').addClass('header__dark')
        $('.header').addClass('active')
        $('.header__border-container').addClass('active')


        this.headerLinksNode.stop(true, false).fadeIn(400);
        this.checkIsMobile()

    },
    closeMenu: function () {
        this.menuIsOpen = false;
        this.headerLinksNode.stop(true, false).fadeOut(400);
        this.btnNode.removeClass('active')
        $('header').removeClass('header__dark')
        $('.header').removeClass('active')
        $('.header__border-container').removeClass('active')
    },
    clickOutSide: function () {
        this.closeMenu()
    },
    checkIsMobile: function () {
        window.innerWidth <= 768 ? this.isMobile = true : this.isMobile = false


        if (this.isMobile) {
            let headerHeight = $('header').innerHeight();
            let mobileBookHeight = $('.mobile-book').innerHeight();
            let height = window.innerHeight - headerHeight - mobileBookHeight;
            $('.header-links-menu__scrolled').css({
                height: Math.max(height, 0)
            });
            return
        }

        $('.header-links-menu__scrolled').css({
            height: ''
        });





    },
    init: function () {
        this.handleClick()

        // Викликаємо один раз при ініціалізації
        this.checkIsMobile();

        // Оновлюємо значення при ресайзі вікна
        $(window).on('resize', () => {
            this.checkIsMobile();
        });
    }
}

APP.header.changeHeaderColor = {
    init: function () {
        const header = document.querySelector('header[data-canChange]');
        if (!header) return;

        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                if (self.scroll() > 0) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }
}

APP.heroHomepageSlider = () => {
    let heroHomePageSLider = new Swiper('.heroHomePageSLider', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 600,
        pagination: {
            el: '.heroHomePageSLider-pagination',
            clickable: true,
        }
    })
}

APP.drawSVGPlugin = () => {
    document.querySelectorAll("[data-svg-draw]").forEach((el) => {
        gsap.fromTo(
            el,
            { drawSVG: "0%" },
            {
                drawSVG: "100%",
                duration: 3,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    });
}

APP.gsapInit = () => {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

APP.showreelsSlider = () => {
    let showreelsSlider = new Swiper('.showreelsSlider', {

        pagination: {
            el: '.showreelsSlider-mobile-pagination',
            clickable: true
        },
        breakpoints: {
            0: {
                slidesPerView: 'auto',
                slidesOffsetAfter: 12,
                slidesOffsetBefore: 12,
                spaceBetween: 8,
            },
            1025: {
                slidesPerView: 'auto',
                slidesOffsetAfter: 40,
                slidesOffsetBefore: 40,
                spaceBetween: 16,
            },
            1681: {
                slidesPerView: 4,
                slidesOffsetAfter: 0,
                slidesOffsetBefore: 0,
                spaceBetween: 16,
            }
        },
        navigation: {
            prevEl: '.showreels-prev-btn',
            nextEl: '.showreels-next-btn',
        }

    })
}

APP.showreelsPlyr = () => {

    const players = [];
    $('.initVideo').each(function (id, el) {
        const player = new Plyr(el, {
            controls: ['play', 'progress'],
            iconUrl: '../assets/utils/plyr.svg'
        });
        players.push(player);

        // Слухаємо подію play
        player.on('play', () => {
            // Проходимось по всіх інших і ставимо на паузу
            players.forEach(p => {
                if (p !== player) p.pause();
            });
        });
    });

}





APP.servicesSLider = () => {
    const $buttons = $('.services__navigation .tm');
    let servicesSlider = new Swiper('.servicesSlider', {
        slidesPerView: 1,
        spaceBetween: 16,
        // effect: "fade",
        loop: false,
        navigation: {
            prevEl: '.services-btn-prev',
            nextEl: '.services-btn-next',
        },
    })
    const getSlideIndex = function () {

    }

    $buttons.each(function (index, btn) {
        const $btn = $(btn)
        const target = $btn.data('target-slider');

        $btn.click(function () {
            // Знаходимо індекс слайда з відповідним data-target-slider

            const slideIndex = servicesSlider.slides.findIndex(slide => $(slide).data('target-slider') === target);


            if (slideIndex !== -1) {
                servicesSlider.slideToLoop(slideIndex); // slideToLoop враховує loop:true
            }

            // Активація кнопки
            $buttons.removeClass('active');
            $btn.addClass('active');
        });


        // $(btn).click(function () {
        //     servicesSlider.slideTo(index);
        // })
    });

    servicesSlider.on('slideChangeTransitionStart', () => {
        const dataSlide = $('.servicesSlider .swiper-slide-active').data('target-slider')

        $buttons.removeClass('active');
        $buttons.filter(`[data-target-slider="${dataSlide}"]`).addClass('active');
    });
}


APP.customerSlider = () => {
    let customerFeedbackSwiper = new Swiper('.customer-feedback-swiper', {
        loop: true,
        navigation: {
            prevEl: '.customer-feedback-slider-prev',
            nextEl: '.customer-feedback-slider-next',
        },
        breakpoints: {

            0: {
                slidesOffsetAfter: 12,
                slidesOffsetBefore: 12,
                slidesPerView: 'auto',
                spaceBetween: 8,
            },
            768: {
                slidesOffsetAfter: 12,
                slidesOffsetBefore: 12,
                slidesPerView: 2,
                spaceBetween: 16,
            },
            1025: {
                slidesOffsetAfter: 40,
                slidesOffsetBefore: 40,
                slidesPerView: 3,
                spaceBetween: 16,
            },
            1681: {
                slidesOffsetAfter: 0,
                slidesOffsetBefore: 0,
                slidesPerView: 3,
                spaceBetween: 16,
            }
        }

    })
}

APP.faq = () => {
    $('.faq .faq__body .item').click(function () {
        $(this).toggleClass('active')
        $(this).find('.item__body').slideToggle()
    })
}


// INPUTSs
APP.inputMasks = () => {
    $('input[data-input-type]').each(function () {
        const inputType = $(this).data('input-type');

        switch (inputType) {
            case 'text':
                // Маска для текстового поля (дозволяє тільки літери та пробіли)
                $(this).inputmask({
                    mask: '*{1,50}',
                    definitions: {
                        '*': {
                            validator: '[A-Za-zА-Яа-яЁё\\s]',
                            cardinality: 1
                        }
                    },
                    placeholder: '',
                    clearIncomplete: true
                });
                break;

            case 'number':
                // Маска для числового поля (дозволяє тільки цифри)
                $(this).inputmask({
                    mask: '9{1,10}',
                    placeholder: '',
                    clearIncomplete: true
                });
                break;

            case 'email':
                // Маска для email
                $(this).inputmask({
                    mask: '*{1,64}@*{1,64}.*{1,10}',
                    greedy: false,
                    definitions: {
                        '*': {
                            validator: '[0-9A-Za-z!#$%&\'*+/=?^_`{|}~-]',
                            cardinality: 1
                        }
                    },
                    placeholder: '',
                    clearIncomplete: true
                });
                break;

            case 'phone':
                // Маска для телефону (формат +38 (XXX) XXX-XX-XX)
                $(this).inputmask({
                    mask: '+1 999 999 9999',
                    placeholder: '+1 ___ ___ ____',
                    clearIncomplete: true
                });
                break;
        }
    });
}

APP.textareaAutoGrow = () => {

    $('.textarea').each(function (id, el) {
        const $textarea = $(this).find('textarea');
        $textarea.css({
            height: $textarea[0].scrollHeight + 'px'
        })


        $textarea.on('input', function () {
            $textarea.css('height', 'auto');
            $textarea.css('height', this.scrollHeight + 'px');
        });



    })
}

APP.formDropdown = () => {
    $('.dropdown-box').each(function () {
        const $btns = $(this).find('.dropdown__body button')
        const $dropdownBody = $(this).find('.dropdown__body')
        const $label = $(this).find('.dropdown-container')
        const $fakeInput = $label.find('.fake-input')

        $label.click(function (e) {
            e.stopPropagation();
            $dropdownBody.slideToggle()
            $fakeInput.toggleClass('active')
        })

        $btns.click(function (e) {
            e.stopPropagation();
            $btns.removeClass('active')
            $(this).addClass('active')
            const data = $(this).data('target')
            $label.find('input').val(data)
            $label.find('input').removeClass('error-class')



            $fakeInput.find('.text').text(data)
            $fakeInput.removeClass('active')
            $fakeInput.removeClass('first')
            $dropdownBody.slideUp()
        })


        if ($('.dropdown-box').hasClass('small')) {
            const $firstBtn = $btns.first()
            const data = $firstBtn.data('target')
            $firstBtn.addClass('active')
            $fakeInput.find('.text').text(data)
            $label.find('input').val(data)
        }



        const INTERACTIVE_ELEMENTS = '.dropdown-box'
        $document.click(function (e) {
            if (!$(e.target).closest(INTERACTIVE_ELEMENTS).length) {
                $dropdownBody.slideUp()
                $fakeInput.removeClass('active')
            }
        })
    })
}



APP.contactFormValidate = () => {
    $("#contactForm").validate({
        // ignore: [], // щоб чекбокс теж перевірявся
        errorClass: "error-class", // клас для помилок
        focusInvalid: false,
        onkeyup: false,
        onfocusout: true,
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            surname: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true,
                minlength: 10
            },
            typeCleaning: {
                required: true
            },
            addres: {
                required: true,
                minlength: 5
            },
            "agree-checkbox": {
                required: true
            }
        },

        messages: {
            name: {
                required: "Enter name",
            },
            surname: {
                required: "Enter surname",
            },
            phone: {
                required: "Enter phone number",
                minlength: "Minimum 10 digits"
            },
            typeCleaning: {
                required: "Select an option",
            },
            addres: {
                required: "Enter address",
                minlength: "Minimum 5 characters"
            },
            "agree-checkbox": {
                required: "Agree to the terms"
            }
        },

        errorPlacement: function (error, element) {
            if (element.attr("type") === "checkbox") {
                element.siblings('.checkbox-custom').addClass('error-class')

            } else {
                const errorBox = element.closest(".input__box").find(".error");
                console.log('error:', error)
                console.log($("input[name='name']").length);
                errorBox.text(error.text()).show();
            }
        },

        success: function (label, element) {
            if ($(element).attr("type") !== "checkbox") {
                $(element).closest(".input__box").find(".error").hide();
            }
            else {
                $(element).siblings('.checkbox-custom').removeClass('error-class')
            }
        },
        submitHandler: function (form) {
            alert("Форма валідна, можна відправляти!");
            form.submit();
        }
    });
}


APP.chistoSlider = () => {

    let teamSlider = null;


    const sliderConfig = {
        spaceBetween: 8,
        slidesPerView: 'auto',
        slidesOffsetAfter: 12,
        slidesOffsetBefore: 12,
        navigation: {
            prevEl: '.teamSlide-prev',
            nextEl: '.teamSlide-next',
        }
    }


    const initSlider = () => {
        const windowWidth = window.innerWidth;

        if (windowWidth <= 767 && !teamSlider) {
            teamSlider = new Swiper('.teamSlider', sliderConfig);
        } else if (windowWidth > 768 && teamSlider) {
            teamSlider.destroy(true, true);
            teamSlider = null;
        }
    };

    initSlider();

    const handleResize = APP.utils.debounce(initSlider, 300);
    window.addEventListener('resize', handleResize);
}



APP.cleaningHeroSlider = () => {
    let cleaningHeroSlider = new Swiper('.cleaningHeroSlider', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: {
            el: '.cleaningHeroSlider-pagination',
            clickable: true,
        }

    })
}


APP.notAllSlider = () => {
    let notAllSlider = new Swiper('.notAllSlider', {
        slidesPerView: 'auto',
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 'auto',
                slidesOffsetAfter: 12,
                slidesOffsetBefore: 12,
                spaceBetween: 8,
            },
            1025: {
                slidesPerView: 'auto',
                slidesOffsetAfter: 40,
                slidesOffsetBefore: 40,
                spaceBetween: 16,
            },
            1681: {
                slidesPerView: 4,
                slidesOffsetAfter: 0,
                slidesOffsetBefore: 0,
                spaceBetween: 16,
            }
        },
        pagination: {
            el: '.notAllSlider-pagination',
            clickable: true,
        }
    })

    const checkIsLocked = () => {
        if (notAllSlider.isLocked) {
            $('.notAllSlider-pagination').hide()
        } else {
            $('.notAllSlider-pagination').show()
        }
    }

    const handleResize = APP.utils.debounce(checkIsLocked, 300);
    checkIsLocked()
    window.addEventListener('resize', handleResize);

}


APP.includedTarifes = {
    break: 850,
    isMobile: false,
    item: $('.included__tarifes .item'),
    body: $('.included__tarifes .item .body'),
    setEqualHeight: function () {
        const $blocks = $('.included__tarifes .item .body__content .block');
        let maxHeight = 0;

        // скидаємо висоту, щоб правильно порахувати
        $blocks.css('height', 'auto');

        $blocks.each(function () {
            const h = $(this).outerHeight();
            if (h > maxHeight) {
                maxHeight = h;
            }
        });

        // застосовуємо максимальну висоту тільки на десктопі
        if (window.innerWidth > APP.includedTarifes.break) {
            $blocks.css('height', maxHeight + 'px');
        } else {
            $blocks.css('height', 'auto'); // на мобільних скидаємо
        }
    },

    checkIsMobile: function () {
        const $body = this.body
        const $item = this.item
        if (window.innerWidth < this.break) {
            $body.hide();
            $item.off('click.included').on('click.included', function () {
                $(this).find('.body').stop().slideToggle();
                $(this).toggleClass('active')
            });
            this.showFirst()
        } else {
            $item.removeClass('active')
            $body.show();
            $item.off('click.included');
        }
    },
    showFirst: function () {
        this.item.first().addClass('active').find('.body').show()
    },
    init: function () {
        const that = this;

        const onResize = APP.utils.debounce(() => {
            that.checkIsMobile();
            that.setEqualHeight();
        }, 50);

        this.checkIsMobile();
        this.setEqualHeight();
        window.addEventListener('resize', onResize);
    }
}


APP.smallMarginForFooter = () => {
    const $main = $('main section')

    if ($main.last().hasClass('want-a-clean')) {
        $('footer').addClass('small-margin')
    }
}


APP.linePosition = {
    line: document.querySelector(".images .line"),
    setMobile: function (first, second, container) {
        const offset = 8;

        // центр по X
        const firstCenterX = first.left + first.width / 2;

        // координати
        const startY = first.bottom + offset;
        const endY = second.top - offset;
        const lineHeight = endY - startY;

        // стилі
        this.line.style.position = "absolute";
        this.line.style.left = (firstCenterX - container.left) + "px";
        this.line.style.top = (startY - container.top) + "px";
        this.line.style.height = lineHeight + "px";
        this.line.style.width = "2px";
    },
    setDesktop: function (first, second, container) {
        const offset = 12;

        // центр по Y
        const firstCenterY = first.top + first.height / 2;

        // координати
        const startX = first.right + offset;
        const endX = second.left - offset;
        const lineWidth = endX - startX;

        // стилі
        this.line.style.position = "absolute";
        this.line.style.left = (startX - container.left) + "px";
        this.line.style.top = (firstCenterY - container.top) + "px";
        this.line.style.width = lineWidth + "px";
        this.line.style.height = "2px";
    },
    setPosition: function () {
        const $texts = document.querySelectorAll(".images .block .text");

        if ($texts.length < 2 || !this.line) return;

        const first = $texts[0].getBoundingClientRect();
        const second = $texts[1].getBoundingClientRect();
        const container = document.querySelector(".images").getBoundingClientRect();

        if (window.innerWidth <= 540) {
            this.setMobile(first, second, container)
        } else {
            this.setDesktop(first, second, container)
        }
    },
    init: function () {
        this.setPosition()
        const handleResize = APP.utils.debounce(() => this.setPosition(), 10);
        window.addEventListener('resize', handleResize);
    }
}

APP.gsapWantClean = () => {

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".want-a-clean",
            start: "top center", // коли верх елемента доходить до середини екрану
            toggleActions: "play none none none" // граємо один раз
        }
    });

    // початковий стан (можна прописати тут або в CSS)
    gsap.set(".want-a-clean .images .block, .want-a-clean .images .text", { opacity: 0 });

    // 1. перше зображення (rectangle)
    tl.to(".want-a-clean .images .block.rectangle", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
    })

        // 2. друге зображення (oval)
        .to(".want-a-clean .images .block.oval", {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        })

        // 3. перший текст (h2)
        .to(".want-a-clean .grid .block.rectangle .text", {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        })

        // 4. виклик функції APP.linePosition.init()
        .add(() => {
            if (typeof APP !== "undefined" && APP.linePosition && APP.linePosition.init) {
                APP.linePosition.init();
            }
        })

        // 5. другий текст (зображення з класом .oval .text)
        .to(".want-a-clean .images .block.oval .text", {
            opacity: 1,
            duration: 0.6,
            delay: 0.4,
            ease: "power2.out"
        });
}



APP.bigForm = {

    roomCount: {
        changeValue: function (el, mathAction) {
            const input = el.find('.value input');
            let currentValue = parseInt(input.val()) || 0;
            let newValue = currentValue + mathAction;

            if (newValue < 0) {
                newValue = 0;
            }

            input.val(newValue);

            const numberElement = el.find('.value .number');
            if (numberElement.length) {
                numberElement.html(newValue);
            }

        },
        init: function () {
            const that = this;
            $('.form-your-apartment .rooms .item').each(function (id, el) {
                const $el = $(el);

                $el.find('.decrease').click(function () {
                    that.changeValue($el, -1)
                });

                $el.find('.increase').click(function () {
                    that.changeValue($el, 1)
                });
            });
        }
    },

    calendar: {
        bookedDates: [
            "2025-09-12"
        ],
        calendar: null,
        selectedDate: null,
        createFletPicker: function () {
            // ініціалізація flatpickr
            const that = this
            const flatPicker = flatpickr("#calendar", {
                inline: true, // показує календар одразу
                dateFormat: "Y-m-d",
                altInput: false,
                monthSelectorType: "static",
                yearSelectorType: "static",
                nextArrow: icons.nextSvg,
                prevArrow: icons.prevSvg,
                disable: this.bookedDates,
                onChange: function (selectedDates, dateStr, instance) {
                    that.selectedDate = dateStr;
                },
                locale: {
                    weekdays: {
                        shorthand: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // короткі
                        longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]  // довгі
                    },
                }
            });
            this.calendar = flatPicker


        },
        dropdown: function () {
            const that = this

            $('.dropdown-box-calendar').each(function () {
                const $dropdownBody = $(this).find('.dropdown__body')
                const $btnCansel = $(this).find('.dropdown__body .cancel-btn')
                const $btnConfirm = $(this).find('.dropdown__body .confirm-btn')
                const $label = $(this).find('.dropdown-container')
                const $fakeInput = $label.find('.fake-input')
                const $input = $label.find('input')


                $label.click(function (e) {
                    e.stopPropagation();
                    $dropdownBody.fadeToggle()
                    $fakeInput.toggleClass('active')
                })
                const closeDropdown = () => {
                    $dropdownBody.fadeOut();
                    $fakeInput.removeClass('active');
                }

                // кнопка Cancel
                $btnCansel.on('click', closeDropdown);

                // кнопка Confirm
                $btnConfirm.on('click', function () {
                    if (that.selectedDate) {
                        $input.val(that.selectedDate);
                        const text = that.calendar.formatDate(that.calendar.selectedDates[0], "l, j F")
                        $fakeInput.text(text);
                        $fakeInput.removeClass('first');
                    }
                    closeDropdown()
                });

                const INTERACTIVE_ELEMENTS = '.dropdown-box-calendar'
                $document.click(function (e) {
                    if (!$(e.target).closest(INTERACTIVE_ELEMENTS).length) {
                        $dropdownBody.fadeOut()
                        $fakeInput.removeClass('active')
                    }
                })
            })
        },

        init: function () {
            this.createFletPicker()
            this.dropdown()
        }
    },


    tooltip: {
        tooltips: [], // збережемо інстанси tippy

        createToolTip: function () {
            if (window.innerWidth <= 767) {
                this.destroyToolTip()
                return
            }

            // спочатку видаляємо попередні, щоб не дублювались
            this.destroyToolTip()

            document.querySelectorAll('.tooltip.tippy').forEach(button => {
                const instance = tippy(button, {
                    content: (reference) => {
                        const tipContent = reference.getAttribute('data-content-tippy')
                        return `<p>${tipContent}</p>`
                    },
                    allowHTML: true,
                    theme: '#0F1D4E',
                    arrow: true,
                    placement: 'top',
                    interactive: true,
                    trigger: 'click',
                    animation: 'scale',
                    zIndex: 10,
                    offset: [42, 5.5]
                })

                this.tooltips.push(instance)
            })
        },

        destroyToolTip: function () {
            this.tooltips.forEach(t => t.destroy())
            this.tooltips = []
        },

        init: function () {
            this.createToolTip()

            // слухаємо ресайз
            const handleResize = APP.utils.debounce(() => { this.createToolTip() }, 300);

            window.addEventListener('resize', handleResize);

        },
    },

    tooltipPopup: {

        $modal: null,
        $modalContent: null,
        $openBtn: null,
        $closeBtn: null,
        INTERACTIVE_ELEMENTS: null,


        setValues: function (data) {
            const that = this
            this.$modalContent.find('.heading h4').html(data.title)
            this.$modalContent.find('> p').html(data.text)
            this.$modalContent.find('.add-extraserrvices').click(() => {
                that.activateCheckbox(data.id)
            })
        },
        activateCheckbox: function (id) {
            $(`#${id}`).prop('checked', true)
        },

        openModal: function () {
            if (window.innerWidth > 767) {
                this.closeModal()
                return
            }
            this.openOptions();
            this.$modal.fadeIn(400);
            this.$openBtn.addClass('open');
        },

        openOptions: function () {
            // додаткові дії при відкритті модалки
        },
        addExtraService: function () {
            this.closeModal()
        },

        closeModal: function () {
            this.closeOptions();
            this.$modal.fadeOut(400);
            this.$openBtn.removeClass('open');
        },

        closeOptions: function () {
            // додаткові дії при закритті модалки
        },

        modalHandler: function () {
            if (this.$openBtn.hasClass('open')) {
                this.closeModal();
            } else {
                this.openModal();
            }
        },
        init: function (modalSelector, openHandlerSelector, closeHandlerSelector, btnAddExtraService) {
            this.$modal = $(modalSelector);
            this.$modalContent = $(`${modalSelector}__content`);
            this.$openBtn = $(openHandlerSelector);
            this.$addBtn = $(btnAddExtraService);
            this.$closeBtn = $(closeHandlerSelector);
            this.INTERACTIVE_ELEMENTS = `${modalSelector}__content, ${openHandlerSelector}`;

            this.$modal.hide();

            const that = this
            // Прив’язка обробників
            this.$openBtn.click(function () {
                const data = {
                    id: $(this).data('popup-id'),
                    title: $(this).data('popup-title'),
                    text: $(this).data('content-tippy'),
                }
                that.setValues(data)

                that.modalHandler()
            })
            // this.$openBtn.on('click', () => this.modalHandler());
            this.$closeBtn.on('click', () => this.closeModal());
            this.$addBtn.on('click', () => this.addExtraService());

            $(document).on('click', (e) => {
                if (!$(e.target).closest(this.INTERACTIVE_ELEMENTS).length) {
                    this.closeModal();
                }
            });
        },



    },

    promocode: {
        promoContainer: $('.big-form-sticky .promo__container .promo'),
        applyBtn: null,
        input: null,
        activeBtnText: {
            'initial': "Apply",
            'succes': "Remove",
        },
        activeBtn: function () {
            const val = this.input.val().trim();
            this.removeError()
            if (val.length > 0) {
                this.applyBtn.prop('disabled', false); // знімаємо disabled
            } else {
                this.applyBtn.prop('disabled', true);  // знову навішуємо disabled
            }
        },
        getPromo: function () {
            return true
        },
        successPromo: function () {
            this.promoContainer.find('.answer').addClass('show')
            const answer = this.promoContainer.find('.answer')
            const that = this

            answer.find('.tsb').html(this.input.val())

            setTimeout(() => {
                that.promoContainer.find('.icon').addClass('succes')
                that.applyBtn.html(that.activeBtnText.succes)
                this.input.prop('disabled', true)
            }, 300)
            setTimeout(() => {
                answer.removeClass('show')
                that.promoContainer.addClass('succes')
            }, 2000)
        },
        removePromo: function () {
            this.input.val('')
            this.promoContainer.find('.icon').removeClass('succes')
            this.promoContainer.removeClass('succes')
            this.input.prop('disabled', false)
            this.applyBtn.text(this.activeBtnText.initial)
        },
        addError: function () {
            $('.promo__container .error-message').fadeIn(100)
            this.promoContainer.addClass('error')
            this.promoContainer.find('.icon').addClass('error')
            this.applyBtn.prop('disabled', true)
        },
        removeError: function () {
            $('.promo__container .error-message').fadeOut(100)
            this.promoContainer.removeClass('error')
            this.promoContainer.find('.icon').removeClass('error')
            this.applyBtn.prop('disabled', false)
        },
        checkPromo: function () {
            const res = this.getPromo()
            const isPromoCorrect = res

            if (isPromoCorrect) {
                this.successPromo()
            } else {
                this.addError()
            }




        },
        init: function () {
            this.applyBtn = this.promoContainer.find('.apply');
            this.input = this.promoContainer.find('input');



            // при вводі
            this.input.on('input', () => {
                this.activeBtn();
            });

            this.applyBtn.on('click', () => {
                console.log(':',)
                if (this.applyBtn.text() === this.activeBtnText.initial) {
                    this.checkPromo()
                } else {
                    this.removePromo()
                }



            })
            this.input.on('input', () => { this.activeBtn() })
        }
    },

    validation: {
        init: function () {

        }
    },





    init: function () {
        this.roomCount.init()
        this.calendar.init()
        this.tooltip.init()
        this.tooltipPopup.init(
            '.extra-sergvice-popup',
            '.tooltip.tippy',
            '.extra-service-popup-close',
            '.add-extraserrvices'

        )
        this.promocode.init()
        this.validation.init()
    }
}
APP.callbackModal = {

    openModal() {
        this.$modal.fadeIn(400)
        this.$openBtn.addClass('open')
    },

    closeModal() {
        this.$modal.fadeOut(400)
        this.$openBtn.removeClass('open')
    },
    modalHandler() {
        if (this.$openBtn.hasClass('open')) {
            this.closeModal()
        } else {
            this.openModal()
        }
    },



    init(modalSelector, openHandlerSelector, closeHandlerSelector) {

        this.$modal = $(modalSelector)
        this.$modalContent = $(`${modalSelector}__content`)
        this.$openBtn = $(openHandlerSelector)
        this.$closeBtn = $(closeHandlerSelector)
        this.INTERACTIVE_ELEMENTS = `${modalSelector}__content, ${openHandlerSelector}`

        this.$modal.hide()
        this.$openBtn.on('click', () => this.modalHandler())
        this.$closeBtn.on('click', () => this.closeModal())

        $(document).on('click', (e) => {
            if (!$(e.target).closest(this.INTERACTIVE_ELEMENTS).length) {
                this.closeModal()
            }
        })
    }

}

APP.newsBigSlider = () => {
    let newsBigSlider = new Swiper('.newsBigSlider', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        navigation: {
            prevEl: '.newsBigSlider--prev',
            nextEl: '.newsBigSlider--next',
        },
        pagination: {
            el: '.newsBigSlider__pagination'
        }
    })
}

APP.sharePostIntoSoccials = {
    shareUrl: window.location.href,
    shareToFacebook: function () {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP.sharePostIntoSoccials.shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    },
    shareToLinkedIn: function () {
        const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(APP.sharePostIntoSoccials.shareUrl)}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=400');
    },
    copyLink: function () {
        const textToCopy = APP.sharePostIntoSoccials.shareUrl;
        APP.utils.copyToClipboard(textToCopy)
        APP.sharePostIntoSoccials.showMessage()
    },
    showMessage: function () {
        $('.share .message').fadeIn()
        setTimeout(() => {
            $('.share .message').fadeOut()
        }, 5000)
    },
    shareToX: function () {
        const text = encodeURIComponent("Переглянь це: ");
        const url = encodeURIComponent(APP.sharePostIntoSoccials.shareUrl);
        const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(xUrl, '_blank', 'width=600,height=400');
    },
    handlers: function () {
        $('.share-facebook').click(this.shareToFacebook)
        $('.share-x').click(this.shareToX)
        $('.share-inst').click(this.copyLink)
        $('.share-tiktok').click(this.copyLink)
        $('.share-copy').click(this.copyLink)
    },
    init: function () {
        this.handlers()
    }
}


APP.postSlider = () => {
    const postSlider = new Swiper('.postSlider', {
        navigation: {
            prevEl: '.postSlider-prev',
            nextEl: '.postSlider-next',
        },
        pagination: {
            el: '.postSlider-pagination',
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 'auto',
                slidesOffsetBefore: 12,
                slidesOffsetAfter: 12,
                loop: false,
                spaceBetween: 8,

            },
            1025: {
                slidesPerView: 'auto',
                slidesOffsetBefore: 40,
                slidesOffsetAfter: 40,
                loop: false,
                spaceBetween: 16,
            },
            1281: {
                slidesPerView: 2,
                slidesOffsetAfter: 0,
                slidesOffsetBefore: 0,
                loop: true,
                spaceBetween: 16,

            }
        }

    })
}

APP.copyContacts = () => {

    $('.contact-us .right .contact__info button').each(function (id, button) {
        const $button = $(button)
        const $copyText = $button.find('.copy')

        const copyString = $button.find('.text').text()
        const initialCopyText = $copyText.text()

        let timeout = null
        $button.click(function () {
            APP.utils.copyToClipboard(copyString)
            $copyText.text('Copied!')

            clearTimeout(timeout)
            timeout = setTimeout(() => {
                $copyText.text(initialCopyText)
            }, 5000)
        })
    })

}

APP.createSlideEffectForScrolling = () => {
    $('.pricing-list__block .overflow').each(function () {
        const $overflow = $(this);
        const $trace = $overflow.find(".trace");
        const $btnLeft = $overflow.find(".left");
        const $btnRight = $overflow.find(".right");

        if (!$trace.length || !$btnLeft.length || !$btnRight.length) return;

        const updateButtons = () => {
            const el = $trace[0];
            const maxScroll = el.scrollWidth - el.clientWidth;
            const scrollLeft = el.scrollLeft;

            // Якщо немає скролу
            if (maxScroll <= 0) {
                $btnLeft.css("opacity", 0);
                $btnRight.css("opacity", 0);
                return;
            }

            const EPS = 2; // допуск у 2px

            // Лівий край
            if (scrollLeft <= EPS) {
                $btnLeft.css("opacity", 0);
            } else {
                $btnLeft.css("opacity", 1);
            }

            // Правий край
            if (scrollLeft >= maxScroll - EPS) {
                $btnRight.css("opacity", 0);
            } else {
                $btnRight.css("opacity", 1);
            }
        };



        const scrollToEdge = (direction) => {
            const maxScroll = $trace[0].scrollWidth - $trace.outerWidth();
            $trace.animate(
                { scrollLeft: direction === "left" ? 0 : maxScroll },
                200
            );
        };

        $trace.on("scroll", updateButtons);
        $(window).on("resize", updateButtons);

        $btnLeft.on("click", () => scrollToEdge("left"));
        $btnRight.on("click", () => scrollToEdge("right"));

        // стартова ініціалізація
        updateButtons();
    });
}



APP.audio = () => {
    const currentTimeEl = document.querySelector('.current-time')
    const durationEl = document.querySelector('.duration')

    const $btn = $('.audio .toggleAudio')
    const $btnTextContainer = $btn.find('.text')
    const initialText = $btnTextContainer.text()

    if (!currentTimeEl && !durationEl) {
        return
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    const wavesurfer = WaveSurfer.create({
        container: '.audio .audio-trace .track',
        waveColor: '#B2B7C6',
        progressColor: '#0F1D4E',
        height: 32,
        barWidth: 1,
        barGap: 2,
    })

    wavesurfer.load('/assets/audio/audio.mp3')
    wavesurfer.on('error', (err) => {
        console.error('Audio loading error:', err)
    })

    wavesurfer.on('ready', () => {
        console.log('Audio file uploaded successfully')
        const duration = wavesurfer.getDuration()
        durationEl.textContent = formatTime(duration)
    })
    wavesurfer.on('audioprocess', () => {
        const currentTime = wavesurfer.getCurrentTime()
        currentTimeEl.textContent = formatTime(currentTime)
    })


    $btn.click(function () {
        wavesurfer.playPause()
        const $container = $(this).parent()
        $container.toggleClass('active')

        if ($container.hasClass('active')) {
            $btnTextContainer.text('Pause the article')
        } else {
            $btnTextContainer.text(initialText)
        }
    })
}



APP.cookies = {
    timeout: 200,
    modal: $('.modal.cookies'),
    closeCookiesModal: function (that) {
        console.log(that)
        that.modal.fadeOut(200)
    },
    openCookiesModal: function () {
        const that = this
        setTimeout(function () {
            that.modal.fadeIn(500)
        }, that.timeout)
    },
    checkHasLocalStorageKey: function () {
        const cookieConsent = localStorage.getItem('cookieConsent')
        if (cookieConsent) {
            const consentData = JSON.parse(cookieConsent)
            const now = new Date().getTime()
            // Check if consent is still valid (within 2 weeks = 14 days)
            if (now < consentData.expiry) {
                return true
            } else {
                // Remove expired consent
                localStorage.removeItem('cookieConsent')
                return false
            }
        }
        return false
    },
    setCookieConsent: function () {
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 14) // Set expiry to 2 weeks
        const consentData = {
            accepted: true,
            expiry: expiryDate.getTime()
        }
        localStorage.setItem('cookieConsent', JSON.stringify(consentData))
    },
    leaveWebSite: function () {
        window.location.href = 'about:blank'
    },
    handlers: function () {
        const that = this

        $('.accept-cookies').click(function () {
            that.setCookieConsent()
            that.closeCookiesModal(that)
        })
    },
    init: function () {
        if (!this.checkHasLocalStorageKey()) {
            this.handlers()
            this.openCookiesModal()
        }
    }
}


APP.gsapIndexServices = () => {
    gsap.registerPlugin(ScrollTrigger);

    const images = gsap.utils.toArray(".images__conainer .image");
    const blocks = gsap.utils.toArray(".text__container .block");

    if(images.length <= 0 && blocks.length <= 0 ){
        console.log('false:', )
        return
    }

    images[0].classList.add('active')

    // для кожного блоку підміняємо картинку
    blocks.forEach((block, i) => {
        ScrollTrigger.create({
            trigger: block,
            start: "top center",
            end: 'top center',
            onEnter: () => setActiveImage(i),
            onEnterBack: () => setActiveImage(i),
        });
    });
    function setActiveImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });
    }


    const scrollInToView = () => {

        if (window.innerWidth < 767) {
            return
        }
        document.querySelectorAll(".services__navigation button").forEach(btn => {
            btn.addEventListener("click", () => {
                const targetValue = btn.dataset.targetSlider;
                const target = document.querySelector(`[data-target-slide="${targetValue}"]`);
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });
    }

    scrollInToView()
};


APP.botAnimation = {
    container: null,
    svg: null,
    messages: null,
    timeLine: null,
    scrollTrigger: null,

    setNodes: function () {
        this.container = $('.cleaning-bot')
        this.svg = this.container.find('svg')
        this.messages = this.container.find('.messages .blur')
    },

    showAnimation: function () {
        this.timeLine && this.timeLine.kill()
        this.timeLine = gsap.timeline()

        gsap.set(this.container, {display: 'flex'})

        // SVG
        this.timeLine.fromTo(
            this.svg,
            {opacity: 0},
            {opacity: 1, duration: 0.4}
        )

        // Повідомлення
        this.messages.each((i, el) => {
            this.timeLine.fromTo(
                el,
                {display: "none", opacity: 0, y: 20, scale: 0.5},
                {display: "block", opacity: 1, y: 0, scale: 1, duration: 0.4},
                "+=" + (i === 0 ? 0.2 : 0.7)
            )
        })

        // ScrollTrigger для білого класу
        if (!this.scrollTrigger) {
            this.scrollTrigger = ScrollTrigger.create({
                trigger: ".homepage__hero",
                start: "top bottom", 
                end: "bottom top",    
                onEnter: () => this.container.addClass("white"),
                onEnterBack: () => this.container.addClass("white"),
                onLeave: () => this.container.removeClass("white"),
                onLeaveBack: () => this.container.removeClass("white"),
            })
        }
    },

    removeAnimation: function () {
        if (this.timeLine) {
            this.timeLine.kill()
            this.timeLine = null
        }

        if (this.scrollTrigger) {
            this.scrollTrigger.kill()
            this.scrollTrigger = null
        }

        gsap.set(this.messages, {display: "none", opacity: 0, y: 0, scale: 1})
        gsap.set(this.svg, {opacity: 0})
        gsap.set(this.container, {display: 'none'})
        this.container.removeClass('white')
    },

    checkWindow: function () {
        let isCanBeShowed = window.innerWidth >= 768

        if (isCanBeShowed) {
            this.showAnimation()
        } else {
            this.removeAnimation()
        }
    },

    init: function () {
        const handleResize = APP.utils.debounce(() => {
            this.checkWindow()
        }, 300)

        this.setNodes()
        this.removeAnimation()
        this.checkWindow()
        window.addEventListener('resize', handleResize)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    APP.gsapInit()
    APP.showreelsPlyr()
    APP.drawSVGPlugin()

    APP.header.navigationMenu.init()
    APP.header.changeHeaderColor.init()
    APP.heroHomepageSlider()

    APP.inputMasks()
    APP.formDropdown()

    APP.gsapWantClean()
    APP.gsapIndexServices()

    APP.showreelsSlider()
    APP.servicesSLider()
    APP.customerSlider()
    APP.chistoSlider()
    APP.newsBigSlider()
    APP.postSlider()

    APP.faq()
    APP.cleaningHeroSlider()
    APP.notAllSlider()
    APP.smallMarginForFooter()

    APP.includedTarifes.init()
    APP.contactFormValidate()



    APP.bigForm.init()
    APP.textareaAutoGrow()
    APP.callbackModal.init(
        '.callback-modal',
        '.callback-request',
        '.callback-modal-close'
    )


    APP.sharePostIntoSoccials.init()
    APP.copyContacts()
    APP.createSlideEffectForScrolling();

    APP.audio()
    APP.cookies.init()

    APP.botAnimation.init()
});
