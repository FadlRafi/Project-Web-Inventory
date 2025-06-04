function toggleSubmenu() {
  const subMenu = document.querySelector(".submenu");

  subMenu.style.display = "flex";
}

window.toggleSubmenu = toggleSubmenu;

document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const isClickInsideMenu = sidebar.contains(event.target);
  // const isClickSubmenu = event.target.closest("submenuItem");

  if (!isClickInsideMenu && isClickInsideMenu) {
    document.querySelector(".submenu").style.display = "none";
  }
});

const menuItems = document.querySelectorAll(".navMenuContent");
const submenuItems = document.querySelectorAll(".submenuItem");
const content = document.getElementById("content");

document.addEventListener("DOMContentLoaded", () => {
  loadPage("UI/pages/" + "aboutMe.html");

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      const subemnuItem = document.querySelectorAll(".submenuItem");
      subemnuItem.forEach((submenu) => submenu.classList.remove("active"));
      if (page != "inventory.html") {
        document.querySelector(".submenu").style.display = "none";
      }
      if (page != "inventory.html") {
        loadPage("UI/pages/" + page);
      }
      console.log(page);
      setActive(item);
    });
  });

  submenuItems.forEach((submenu) => {
    submenu.addEventListener("click", (e) => {
      e.preventDefault();
      const page = submenu.getAttribute("data-page");
      subMenutActive(submenu);
      loadPage("UI/pages/" + page);
    });
  });
});

function setActive(element) {
  const items = document.querySelectorAll(".navMenuContent");
  items.forEach((item) => item.classList.remove("active"));
  element.classList.add("active");
}

function subMenutActive(element) {
  const submenu = document.querySelectorAll(".submenuItem");

  submenu.forEach((submenu) => submenu.classList.remove("active"));
  element.classList.add("active");
}

export function loadPage(url) {
  
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
      document.title = content.children["title"].innerText;
      requestAnimationFrame(() => {
        content.querySelectorAll("script").forEach((oldScript) => {
          const newScript = document.createElement("script");
          newScript.setAttribute("type", "module");

          if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.async = false;
          } else {
            newScript.textContent = oldScript.textContent;
          }
          const srcScript = newScript.getAttribute("src");
          newScript.onload = () => {
            import(srcScript).then((module) => {
              if (typeof module.mainElectricalInventory === "function") {
                module.mainElectricalInventory();
                console.log(typeof module.mainElectricalInventory);
              } else if (typeof module.main === "function") {
                module.main();
                console.log(typeof module.main);
              } else if (typeof module.mainPartPickup === "function") {
                module.mainPartPickup();
                console.log(typeof module.mainPartPickup);
              } else if (typeof module.mainRegister === "function"){
                module.mainRegister();
              } else if(typeof module.mainMechanicalInventory === "function"){
                module.mainMechanicalInventory();
              }

              console.log(srcScript);
            });
          };
          document.body.appendChild(newScript);
          document.body.removeChild(newScript);
        });
      });
    })
    .catch((err) => {
      content.innerHTML = "<p>Error loading page.</p>";
    });
}
