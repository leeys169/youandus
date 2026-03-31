document.addEventListener("DOMContentLoaded", function () {

    // HEADER
    $(function () {
    const $menuArea = $("#sec-0 .headerMenu nav");   // 메뉴 영역(gnb + 서브 포함)
    const $headerBg = $("#sec-0 .header-bg");        // 검정 배경
    const $lists = $("#sec-0 .lists");               // 모든 서브메뉴

    let timer;

    // 열기
    $menuArea.on("mouseenter", function () {
        clearTimeout(timer);
        $headerBg.stop(true, true).slideDown(300);
        $lists.stop(true, true).slideDown(300);
    });

    // 닫기(살짝 딜레이로 지지직 방지)
    $menuArea.on("mouseleave", function () {
        timer = setTimeout(() => {
        $headerBg.stop(true, true).slideUp(200);
        $lists.stop(true, true).slideUp(200);
        }, 120);
    });
    });
    // SWIPER
    const swiper = new Swiper(".slideBox", {
        wrapperClass: "slides-track",
        slideClass: "slide",
        loop: true,
        slidesOffsetBefore: 50,
        loopedSlides: 5, 
        centeredSlides: false, 

        // autoplay: {
        //     delay: 1000,
        //     disableOnInteraction: false,
        // },

        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        
        // 반응형 구간 설정
        breakpoints: {
            0: {
                slidesPerView: 1.2, 
                spaceBetween: 20,
                slidesOffsetBefore: 20,
                // autoplay: false,
            },
            768: {
                slidesPerView: 2.2, 
                spaceBetween: 30,
                slidesOffsetBefore: 30,
                // autoplay: false,
            },
            1024: {
                slidesPerView: 2.2,
                spaceBetween: 40,
                slidesOffsetBefore: 50,
                autoplay: {
                    delay: 1500,
                }
            }
        }
    });

    /* ================= GSAP 풀페이지 ================= */

const wrap = document.querySelector("#wrap");
    const sections = document.querySelectorAll("#wrap > .section");
    let currentIndex = 0;
    let isAnimating = false;
    let sectionTops = [];
    let totalHeight = 0;
    let isFullPageActive = true; // 풀페이지 활성 상태 확인용

    function calculatePositions() {
        if (!isFullPageActive) return;
        sectionTops = [];
        totalHeight = 0;
        sections.forEach(sec => {
            sectionTops.push(totalHeight);
            totalHeight += sec.offsetHeight;
        });
    }

    // [핵심] 반응형 상태를 체크하는 함수
    function checkResponse() {
        if (window.innerWidth <= 1590) { 
            // 모바일/태블릿: 풀페이지 기능 해제
            isFullPageActive = false;
            gsap.set(wrap, { clearProps: "all" }); // GSAP이 넣은 y축 값 제거
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        } else {
            isFullPageActive = true;
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            calculatePositions();
            moveSection(currentIndex); // 현재 위치로 재정렬
        }

        if (typeof swiper !== 'undefined') {
        swiper.update(); // 레이아웃 재계산
    }
    }

    function moveSection(index) {
        if (!isFullPageActive) return;
        isAnimating = true;
        const maxMove = totalHeight - window.innerHeight;
        const targetY = Math.min(sectionTops[index], maxMove);

        gsap.to(wrap, {
            y: -targetY,
            duration: 1.2,
            ease: "power4.out",
            onComplete: () => { isAnimating = false; }
        });
    }

    window.addEventListener("wheel", (e) => {
        if (!isFullPageActive) return; // 활성화 상태가 아니면 휠 막지 않음
        e.preventDefault();
        if (isAnimating) return;

        if (e.deltaY > 0) {
            if (currentIndex < sections.length - 1) {
                currentIndex++;
                moveSection(currentIndex);
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
                moveSection(currentIndex);
            }
        }
    }, { passive: false });

    window.addEventListener("resize", checkResponse);
    checkResponse(); // 초기 실행

    /* ===============================
        키보드 (선택)
    =============================== */

    window.addEventListener("keydown", (e) => {
        if (isAnimating) return;

        if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
        currentIndex++;
        moveSection(currentIndex);
        }
        if (e.key === "ArrowUp" && currentIndex > 0) {
        currentIndex--;
        moveSection(currentIndex);
        }
    });
});

