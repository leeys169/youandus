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

        speed: 1200,

        // spaceBetween: 300,

        autoplay: {
            delay: 1000,
            disableOnInteraction: false
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },

        // slidesPerView: 2,

        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 2,
                spaceBetween: 20
            }
        }
    });

    /* ================= GSAP 풀페이지 ================= */

    const wrap = document.querySelector("#wrap");
    const sections = document.querySelectorAll("#wrap > .section");

    let currentIndex = 0;
    let isAnimating = false;

    /* ===============================
        섹션 위치 계산 (핵심)
    =============================== */

    let sectionTops = [];
    let totalHeight = 0;

    function calculatePositions() {
        sectionTops = [];
        totalHeight = 0;

        sections.forEach(sec => {
        sectionTops.push(totalHeight);
        totalHeight += sec.offsetHeight;
        });
    }

    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    /* ===============================
        섹션 이동
    =============================== */

    function moveSection(index) {
        isAnimating = true;

        // footer가 화면보다 짧을 경우 보정
        const maxMove = totalHeight - window.innerHeight;
        const targetY = Math.min(sectionTops[index], maxMove);

        gsap.to(wrap, {
        y: -targetY,
        duration: 1.5,
        ease: "power4.out",
        onComplete: () => {
            isAnimating = false;
            updateTopButton(index);
        }
        });
    }

    /* ===============================
        마우스 휠 제어
    =============================== */

    window.addEventListener("wheel", (e) => {
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





// /* ================필수공부 분해라 이예슬!=========================================
//    GSAP 풀페이지(FullPage) 구현 - 초보자용 초상세 주석 버전
//    ---------------------------------------------------------
//    목표:
//    1) 스크롤바로 움직이지 않고(= 자연 스크롤 X)
//    2) 마우스 휠을 돌리면 섹션 단위로 "한 화면씩" 이동
//    3) 이동은 GSAP 애니메이션으로 부드럽게 처리
//    4) footer처럼 높이가 100vh가 아닌 섹션도 대응
//    ========================================================= */

// /* 
//   [1] wrap: 우리가 "움직일 대상"
//   - #wrap 안에 섹션들이 들어있고
//   - 우리는 #wrap 전체를 위로/아래로 이동시키면
//     화면에 보이는 섹션이 바뀌게 된다.
// */
// const wrap = document.querySelector("#wrap");

// /*
//   [2] sections: 풀페이지로 취급할 섹션들 목록(배열 비슷한 NodeList)
//   - "#wrap > .section" 의미:
//     #wrap 바로 아래 자식 중에서 class="section"인 것만 가져오기
// */
// const sections = document.querySelectorAll("#wrap > .section");

// /*
//   [3] currentIndex: 현재 몇 번째 섹션을 보고 있는지 저장
//   - 0은 첫 섹션
//   - 1은 두 번째 섹션
//   - ... 이런 식으로 "번호"로 관리
// */
// let currentIndex = 0;

// /*
//   [4] isAnimating: 애니메이션 중복 방지
//   - 마우스 휠은 한 번 굴리면 이벤트가 여러 번 연속으로 들어올 수 있어.
//   - 그때마다 섹션이 막 넘어가면 "휙휙 건너뛰는" 버그가 생김
//   - 그래서 애니메이션이 진행 중이면 휠 입력을 무시하게 만든다.
// */
// let isAnimating = false;


// /* =========================================================
//    [A] 섹션 "위치" 계산 파트 (핵심)
//    ---------------------------------------------------------
//    우리가 하고 싶은 것:
//    - "N번째 섹션으로 이동"하려면
//    - #wrap을 얼마나 위로 올려야 하는지 알아야 함

//    예를 들어:
//    - 0번째 섹션은 시작 위치가 0px
//    - 1번째 섹션은 시작 위치가 900px (첫 섹션 높이가 900이라면)
//    - 2번째 섹션은 시작 위치가 1800px ...
//    이런 "각 섹션의 시작 위치"를 미리 계산해서 저장한다.
//    ========================================================= */

// /*
//   sectionTops: 각 섹션의 시작 위치들을 저장하는 배열
//   - 처음엔 빈 배열 [] 로 시작
//   - 계산 후 예시:
//     sectionTops = [0, 900, 1800, 2700, 3400 ...]
// */
// let sectionTops = [];

// /*
//   totalHeight: 모든 섹션 높이를 더한 "전체 높이"
//   - 예: 900 + 900 + 900 + 900 + 500(footer) = 4100
// */
// let totalHeight = 0;

// /*
//   calculatePositions(): 섹션들의 위치(시작 Y)를 다시 계산하는 함수
//   - 화면 크기가 바뀌면 섹션 높이도 달라질 수 있으니(반응형)
//   - resize 때도 다시 계산해야 한다.
// */
// function calculatePositions() {
//   // 매번 새로 계산해야 하므로 초기화부터 한다.
//   sectionTops = [];
//   totalHeight = 0;

//   /*
//     sections.forEach(...) :
//     - sections에 들어있는 섹션들을 "하나씩" 꺼내서 실행하는 반복문
//     - sec는 섹션 하나를 의미
//   */
//   sections.forEach((sec) => {
//     /*
//       지금까지 쌓인 totalHeight가
//       곧 "현재 섹션이 시작되는 위치"가 된다.
      
//       예:
//       - 첫 섹션 전에는 totalHeight가 0 → 시작 위치 0 저장
//       - 첫 섹션 높이를 더하면 totalHeight가 900 → 다음 섹션 시작 위치 900 저장
//     */
//     sectionTops.push(totalHeight);

//     /*
//       sec.offsetHeight:
//       - 그 섹션의 실제 높이(px)
//       - 100vh인 섹션은 화면 높이만큼 나오고
//       - footer처럼 auto인 섹션은 콘텐츠 높이만큼 나온다.
      
//       그래서 이걸 누적(totalHeight += ...) 해야
//       섹션들의 시작 위치를 정확히 만들 수 있다.
//     */
//     totalHeight += sec.offsetHeight;
//   });
// }

// /*
//   페이지 처음 로드 시 1회 실행:
//   - sectionTops와 totalHeight를 준비해두는 것
// */
// calculatePositions();

// /*
//   창 크기 바뀌면 다시 계산:
//   - 모바일 회전, 브라우저 크기 조절 등에서
//   - 섹션 높이가 달라질 수 있으니 위치 재계산 필요
// */
// window.addEventListener("resize", calculatePositions);


// /* =========================================================
//    [B] 섹션 이동 함수 (GSAP 사용)
//    ---------------------------------------------------------
//    moveSection(index):
//    - index번째 섹션을 화면에 보여주기 위해
//    - #wrap을 위로 올린다(y를 음수로)
//    ========================================================= */
// function moveSection(index) {
//   // 애니메이션 시작 → 휠 입력 잠금
//   isAnimating = true;

//   /*
//     maxMove:
//     - 우리가 #wrap을 올릴 수 있는 "최대 이동량"
//     - 전체 높이(totalHeight)에서 화면 높이(window.innerHeight)를 뺀 값
//     - 왜?
//       화면은 한 번에 window.innerHeight 만큼만 보이니까
//       너무 많이 올리면 "빈 화면"이 나올 수 있다.
    
//     예:
//     전체 높이 4100, 화면 높이 900이면
//     maxMove = 4100 - 900 = 3200
//     즉, y를 -3200보다 더 올리면 밑에 빈 공간이 보일 수 있음
//   */
//   const maxMove = totalHeight - window.innerHeight;

//   /*
//     targetY:
//     - 원래는 sectionTops[index]로 이동하면 되는데,
//     - 마지막 섹션(footer)이 화면보다 짧으면
//       sectionTops[index]가 maxMove보다 커질 수 있음 → 빈 공간 발생
    
//     그래서 Math.min으로 "상한선"을 둔다.
//     - sectionTops[index]가 maxMove보다 크면 maxMove까지만 이동
//   */
//   const targetY = Math.min(sectionTops[index], maxMove);

//   /*
//     GSAP 애니메이션:
//     - wrap을 y = -targetY만큼 이동 (위로 올림)
//     - duration: 1초 동안
//     - ease: 부드럽게 감속하면서 멈추는 느낌
//   */
//   gsap.to(wrap, {
//     y: -targetY,
//     duration: 1,
//     ease: "power4.out",

//     /*
//       애니메이션 끝났을 때 실행되는 함수
//       - isAnimating을 false로 바꿔서 휠 입력 다시 받게 함
//     */
//     onComplete: () => {
//       isAnimating = false;
//     }
//   });
// }


// /* =========================================================
//    [C] 마우스 휠 이벤트
//    ---------------------------------------------------------
//    휠을 아래로 굴리면 다음 섹션으로
//    휠을 위로 굴리면 이전 섹션으로
//    ========================================================= */
// window.addEventListener(
//   "wheel",
//   (e) => {
//     /*
//       e.preventDefault():
//       - 브라우저 기본 스크롤을 막는다.
//       - 우리는 스크롤바로 움직이는 게 아니라
//         "섹션 이동"으로 움직이니까 필요
//     */
//     e.preventDefault();

//     // 애니메이션 중이면 아무 것도 하지 않음(중복 방지)
//     if (isAnimating) return;

//     /*
//       e.deltaY:
//       - 휠 방향 값
//       - 보통 아래로 내리면 양수(>0)
//       - 위로 올리면 음수(<0)
//     */
//     if (e.deltaY > 0) {
//       // 아래로 → 다음 섹션
//       if (currentIndex < sections.length - 1) {
//         currentIndex++;              // 현재 섹션 번호를 1 증가
//         moveSection(currentIndex);   // 그 섹션으로 이동
//       }
//     } else {
//       // 위로 → 이전 섹션
//       if (currentIndex > 0) {
//         currentIndex--;              // 현재 섹션 번호를 1 감소
//         moveSection(currentIndex);   // 그 섹션으로 이동
//       }
//     }
//   },
//   /*
//     { passive: false }:
//     - wheel 이벤트에서 preventDefault를 쓰려면
//       passive가 false여야 함
//     - 이거 안 쓰면 크롬에서 preventDefault가 막히는 경우가 있음
//   */
//   { passive: false }
// );


// /* =========================================================
//    [D] 키보드 이벤트 (선택 기능)
//    ---------------------------------------------------------
//    ArrowDown: 다음 섹션
//    ArrowUp: 이전 섹션
//    ========================================================= */
// window.addEventListener("keydown", (e) => {
//   if (isAnimating) return;

//   if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
//     currentIndex++;
//     moveSection(currentIndex);
//   }

//   if (e.key === "ArrowUp" && currentIndex > 0) {
//     currentIndex--;
//     moveSection(currentIndex);
//   }

