import { setSelectedData, setIsEdit } from "../inventory/state.js";
import { loadPage } from "./controlPage.js";

export async function mainMechanicalInventory() {
  await getAllMechanicalInventory();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const items = document.querySelectorAll(".itemInventory");

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();

      if (text.includes(keyword)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

  async function getAllMechanicalInventory() {
    const item = await getMechanicalInventory();

    const lengthInventory = item.length;
    document.getElementById("ItemInventory").innerHTML = "";
    for (let x = 0; x < lengthInventory; x++) {
      renderInventory(
        item[x]["id"],
        item[x]["nameItem"],
        item[x]["rangeItem"],
        item[x]["brandItem"],
        item[x]["typeItem"],
        item[x]["qtyItem"]
      );
    }
    // console.log(item[x]['nameItem']);
  }
  // window.initElectricalInventoryScript = initElectricalInventoryScript;

  function renderInventory(id, name, range, brand, type, qty) {
    const mainContent = document.getElementById("ItemInventory");

    const itemInventory = document.createElement("div");
    const idItem = document.createElement("span");
    const nameItem = document.createElement("span");
    const rangeItem = document.createElement("span");
    const brandItem = document.createElement("span");
    const typeItem = document.createElement("span");
    const qtyItem = document.createElement("span");
    const containerModify = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    itemInventory.setAttribute("class", "itemInventory");
    idItem.setAttribute("class", "idItem");
    nameItem.setAttribute("class", "nameItem");
    rangeItem.setAttribute("class", "rangeItem");
    brandItem.setAttribute("class", "brandItem");
    typeItem.setAttribute("class", "typeItem");
    qtyItem.setAttribute("class", "qtyItem");
    containerModify.setAttribute("class", "modify");
    editButton.setAttribute("class", "editButton");
    deleteButton.setAttribute("class", "deleteButton");

    const txtIdItem = document.createTextNode(id);
    const textNameItem = document.createTextNode(name);
    const rangeNameItem = document.createTextNode(range);
    const brandNameItem = document.createTextNode(brand);
    const typeNameItem = document.createTextNode(type);
    const qtyNameItem = document.createTextNode(qty);
    const textEditButton = document.createTextNode("Edit");
    const textDeleteButton = document.createTextNode("Delete");

    idItem.appendChild(txtIdItem);
    nameItem.appendChild(textNameItem);
    rangeItem.appendChild(rangeNameItem);
    brandItem.appendChild(brandNameItem);
    typeItem.appendChild(typeNameItem);
    qtyItem.appendChild(qtyNameItem);
    editButton.appendChild(textEditButton);
    deleteButton.appendChild(textDeleteButton);

    containerModify.append(editButton, deleteButton);

    itemInventory.append(
      idItem,
      nameItem,
      rangeItem,
      brandItem,
      typeItem,
      qtyItem,
      containerModify
    );
    mainContent.appendChild(itemInventory);

    editButton.addEventListener("click", () => {
      document.querySelector(".submenu").style.display = "none";
      document.getElementById("Mechanical").classList.remove("active");
      document.getElementById("Inventory").classList.remove("active");
      document.getElementById("Partin").classList.add("active");
      const partInURL = "UI/pages/partin.html";
      setSelectedData(id, name, range, brand, type, qty, "Mechanical");
      setIsEdit(true);
      loadPage(partInURL);
      // console.log(getSelectedData().name) ;
    });

    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm("Yakin ingin menghapus Item?");

      if (confirmed) {
        itemInventory.classList.add("fade-out");

        setTimeout(async () => {
          await deleteInventory(id);
          await getAllMechanicalInventory();
        }, 300);
      } else {
        alert("Item tidak jadi dihapus");
      }
    });
  }

  async function deleteInventory(id) {
    try {
      const API_URL = "/api/mechanical/inventory/delete";
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        // throw new Error(result.error + "Gagal Menghapus Inventory");
        alert("Gagal menghapus inventory", result.error);
      }
      if (result) {
        alert("Inventory berhasil dihapus!!");
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getMechanicalInventory() {
    try {
      const API_URL = "/api/mechanical/inventory/alldata";
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        console.log(result);
      }
      console.log(result);
      return result;
    } catch (error) {}
  }
}
