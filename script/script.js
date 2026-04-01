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
    const sections = document.querySelectorAll(".section");
    let currentIndex = 0;
    let isAnimating = false;
    let sectionTops = [];
    let isFullPageActive = true;

    // 1. 위치 및 높이 계산 함수
    function calculatePositions() {
        sectionTops = [];
        let currentTop = 0;
        sections.forEach((sec) => {
            sectionTops.push(currentTop);
            currentTop += sec.offsetHeight;
        });
    }

    // 2. 섹션 이동 함수 (데스크탑 전용: 바닥 고정 로직 포함)
    function moveSection(index) {
        if (!isFullPageActive) return;
        isAnimating = true;

        // 전체 높이에서 화면 높이를 뺀 '진짜 바닥' 지점
        const maxMove = wrap.offsetHeight - window.innerHeight;
        
        // 목표 지점이 바닥보다 더 내려가면 바닥에 고정 (푸터 잘림 방지)
        let targetY = Math.min(sectionTops[index], maxMove);

        gsap.to(wrap, {
            y: -targetY,
            duration: 1.2,
            ease: "power4.out",
            onComplete: () => { isAnimating = false; }
        });
    }

    // 3. 반응형 체크 함수 (JS로 모든 스타일 제어)
    function checkResponse() {
        const width = window.innerWidth;

        if (width <= 1590) {
            // [모바일/태블릿 모드]
            isFullPageActive = false;
            
            // GSAP 및 인라인 스타일 완전 제거 (푸터 늘어남 방지 핵심)
            gsap.set(wrap, { clearProps: "all" });
            wrap.style.transform = "none";
            wrap.style.height = "auto";

            // 스크롤바 복원
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        } else {
            // [데스크탑 풀페이지 모드]
            isFullPageActive = true;
            
            // 스크롤바 제거
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            calculatePositions();
            moveSection(currentIndex);
        }

        // 스와이퍼 업데이트
        if (typeof swiper !== 'undefined') swiper.update();
    }

    // 4. 휠 이벤트
    window.addEventListener("wheel", (e) => {
        if (!isFullPageActive) return; 
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

    // 윈도우 리사이즈 이벤트
    window.addEventListener("resize", () => {
        // 리사이즈 시 높이 다시 계산
        if (isFullPageActive) calculatePositions();
        checkResponse();
    });

    // 초기 실행
    checkResponse();
    
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

