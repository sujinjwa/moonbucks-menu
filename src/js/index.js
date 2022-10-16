const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  this.menu = []; // 메뉴이름 -> 상태를 나타내는 변하는 데이터이므로 property로 지정
  this.init = () => {
    if (store.getLocalStorage().length >= 1) {
      this.menu = store.getLocalStorage();
    }

    showMenuItems(); // menu Items 보여주기
  };

  const showMenuItems = () => {
    const menuItemTemplate = this.menu
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${item.name}</span>
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
      })
      .join("");

    $("#espresso-menu-list").innerHTML = menuItemTemplate;

    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;

    if (espressoMenuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu.push({ name: espressoMenuName }); // 객체 담아주기
    store.setLocalStorage(this.menu); // localStorage에 추가한 객체 저장하기

    showMenuItems();

    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴명을 입력해주세요: ",
      $menuName.innerText
    );
    this.menu[menuId].name = updatedMenuName; // HTML 내 보이는 this.menu의 name 수정
    store.setLocalStorage(this.menu); // 새로 수정된 this.menu를 localSorage에 저장
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      e.target.closest("li").remove();
      store.setLocalStorage(this.menu);
      updateMenuCount();
    }
  };

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });

  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      console.log(categoryName);
    }
  });
}

const app = new App();
app.init(); // 해당 메소드 실행시켜주기
