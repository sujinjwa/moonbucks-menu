const $ = (selector) => document.querySelector(selector);

function App() {
  // form 태그가 자동으로 서버에 데이터 전송하는 것을 막아준다
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    // 메뉴입력창에서 엔터키 클릭한 경우
    if (e.key === "Enter") {
      const espressoMenuName = $("#espresso-menu-name").value;

      // 추가할 새로운 메뉴의 template 생성 함수
      const menuItemTemplate = (espressoMenuName) => {
        return `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
      };

      // 위 menuItemTemplate 함수 이용하여 생성한 새로운 메뉴의 template을
      // #espresso-menu-list 요소 안의 가장 마지막 child("beforeend")에
      // 추가(insertAdjacentHTML)해준다
      $("#espresso-menu-list").insertAdjacentHTML(
        "beforeend",
        menuItemTemplate(espressoMenuName)
      );

      // menu-list 내 li item의 총 개수
      const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
      $(".menu-count").innerText = `총 ${menuCount}개`;
    }
  });
}

App();
