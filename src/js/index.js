import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    showMenuItems();
    initEventListeners();
  };

  const showMenuItems = () => {
    const menuItemTemplate = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                  <span class="${
                    menuItem.soldOut ? "sold-out" : ""
                  } w-100 pl-2 menu-name">${menuItem.name}</span>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                  >
                    품절
                  </button>
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

    $("#menu-list").innerHTML = menuItemTemplate;

    updateMenuCount();
  };

  const updateMenuCount = () => {
    $(".menu-count").innerText = `총 ${
      this.menu[this.currentCategory].length
    }개`;
  };

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;

    if (menuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      return response.json();
    });

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.menu[this.currentCategory] = data;
        showMenuItems();
        $("#menu-name").value = "";
      });
    // this.menu[this.currentCategory].push({ name: menuName });
    // store.setLocalStorage(this.menu);
    // showMenuItems();
    // $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴명을 입력해주세요: ",
      $menuName.innerText
    );
    if (updatedMenuName.length < 1) {
      alert("1자 이상 입력해주세요.");
      return;
    }
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    showMenuItems();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      showMenuItems();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    showMenuItems();
  };

  const initEventListeners = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        showMenuItems();
      }
    });
  };
}

const app = new App();
app.init(); // 해당 메소드 실행시켜주기
