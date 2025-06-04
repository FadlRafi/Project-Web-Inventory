import { getSelectedData, getIsEdit, setIsEdit } from "../inventory/state.js";

export async function main() {
  const saveButton = document.getElementById("saveButton");
  console.log(getIsEdit());
  if (getIsEdit()) {
    document.getElementById("id").value = getSelectedData().id;
    document.getElementById("name").value = getSelectedData().name;
    document.getElementById("range").value = getSelectedData().range;
    document.getElementById("brand").value = getSelectedData().brand;
    document.getElementById("type").value = getSelectedData().type;
    document.getElementById("qty").value = getSelectedData().qty;
    document.getElementById("listCategory").value = getSelectedData().cat;
  }
  saveButton.addEventListener("click", (e) => {
    const idValue = document.getElementById("id");
    const nameValue = document.getElementById("name");
    const rangeValue = document.getElementById("range");
    const brandValue = document.getElementById("brand");
    const typeValue = document.getElementById("type");
    const qtyValue = document.getElementById("qty");
    const catValue = document.getElementById("listCategory");
    const idInvalid = document.getElementById("idInvalid");
    const nameInvalid = document.getElementById("nameInvalid");
    const rangeInvalid = document.getElementById("rangeInvalid");
    const catInvalid = document.getElementById("catInvalid");
    const qtyInvalid = document.getElementById("qtyInvalid");

    if (
      !idValue.value ||
      !nameValue.value ||
      !rangeValue.value ||
      !catValue.value ||
      !qtyValue.value
    ) {
      e.preventDefault();
      alert("Input tidak boleh ada yang kosong!!");
      if (!idValue.value) {
        idInvalid.textContent = "Harus di isi!!";
      } else {
        idInvalid.textContent = "";
      }
      if (!nameValue.value) {
        nameInvalid.textContent = "Harus di isi!!";
      } else {
        nameInvalid.textContent = "";
      }
      if (!rangeValue.value) {
        rangeInvalid.textContent = "Harus di isi!!";
      } else {
        rangeInvalid.textContent = "";
      }
      if (!catValue.value) {
        catInvalid.textContent = "Harus di isi!!";
      } else {
        catInvalid.textContent = "";
      }
      if (!qtyValue.values) {
        qtyInvalid.textContent = "Harus di isi!!";
      } else {
        qtyInvalid.textContent = "";
      }
    } else {
      idInvalid.textContent = "";
      nameInvalid.textContent = "";
      rangeInvalid.textContent = "";
      catInvalid.textContent = "";
      qtyInvalid.textContent = "";

      const confirmSave = confirm("Apakah anda yakin menyimpan data ini?");

      console.log(getIsEdit());
      if (confirmSave) {
        if (getIsEdit()) {
          if (catValue.value === "Electrical") {
            updateElectricalInventory(
              idValue.value,
              nameValue.value,
              rangeValue.value,
              brandValue.value,
              typeValue.value,
              parseInt(qtyValue.value)
            );
          } else if (catValue.value === "Mechanical") {
            updateMechanicalInventory(
              idValue.value,
              nameValue.value,
              rangeValue.value,
              brandValue.value,
              typeValue.value,
              parseInt(qtyValue.value)
            );
          }
          setIsEdit(false);
          idValue.value = "";
          nameValue.value = "";
          rangeValue.value = "";
          brandValue.value = "";
          typeValue.value = "";
          qtyValue.value = "";
          catValue.value = "";
        } else {
          if (catValue.value === "Electrical") {
            findIdElectrical(idValue.value).then((available) => {
              if (!available) {
                addElectricalInventory(
                  idValue.value,
                  nameValue.value,
                  rangeValue.value,
                  brandValue.value,
                  typeValue.value,
                  parseInt(qtyValue.value)
                );
                idValue.value = "";
                nameValue.value = "";
                rangeValue.value = "";
                brandValue.value = "";
                typeValue.value = "";
                qtyValue.value = "";
                catValue.value = "";
              } else {
                alert("Id yang diinpunkan sudah ada!!");
              }
            });
          } else if (catValue.value === "Mechanical") {
            findIdMechanical(idValue.value).then((available) => {
              if (!available) {
                addMechanicalInventory(
                  idValue.value,
                  nameValue.value,
                  rangeValue.value,
                  brandValue.value,
                  typeValue.value,
                  parseInt(qtyValue.value)
                );
                idValue.value = "";
                nameValue.value = "";
                rangeValue.value = "";
                brandValue.value = "";
                typeValue.value = "";
                qtyValue.value = "";
                catValue.value = "";
              } else {
                alert("Id yang diinpunkan sudah ada!!");
              }
            });
          }
        }
      } else {
        alert("Penyimpanan dibatalkan");
      }
    }
  });

  document.getElementById("CancelButton").addEventListener("click", () => {
    const idValue = document.getElementById("id");
    const nameValue = document.getElementById("name");
    const rangeValue = document.getElementById("range");
    const brandValue = document.getElementById("brand");
    const typeValue = document.getElementById("type");
    const qtyValue = document.getElementById("qty");
    const catValue = document.getElementById("listCategory");

    idValue.value = "";
    nameValue.value = "";
    rangeValue.value = "";
    brandValue.value = "";
    typeValue.value = "";
    qtyValue.value = "";
    catValue.value = "";

    setIsEdit(false);
  });

  async function addElectricalInventory(idItem, name, range, brand, type, qty) {
    const API_URL = "/tblm_electrical_inv";
    const item = {
      id: idItem,
      nameItem: name,
      rangeItem: range,
      brandItem: brand,
      typeItem: type,
      qtyItem: qty,
    };

    try {
      const responses = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!responses.ok) {
        alert("Gagal memasukan data" + responses.err);
        console.log("Gagal menyimpan data");
      }

      const result = await responses.json();

      if (responses.ok) {
        alert("Data Berhasil disimpan");
        console.log(result);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function findIdElectrical(id) {
    const API_URL = "/api/data/id";

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        console.log(response.err);
      } else {
        let available = false;
        const result = await response.json();

        for (let x = 0; x < result.length; x++) {
          if (id === result[x]["id"]) {
            available = true;
            break;
          }
        }
        if (available) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function updateElectricalInventory(id, name, range, brand, type, qty) {
    try {
      const API_URL = "/api/update";
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, range, brand, type, qty }),
      });

      const result = await response.json();
      if (!response.ok) {
        // throw new Error(result.error || "Gagal menghapus inventory");
        alert("Gagal edit inventory", result.err);
      }
      if (result) {
        alert(result.message);
      }
      // console.log(result.message);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function addMechanicalInventory(idItem, name, range, brand, type, qty) {
    const API_URL = "/api/mechanical/inventory/add-new";
    const item = {
      id: idItem,
      nameItem: name,
      rangeItem: range,
      brandItem: brand,
      typeItem: type,
      qtyItem: qty,
    };

    try {
      const responses = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!responses.ok) {
        alert("Gagal memasukan data" + responses.err);
        console.log("Gagal menyimpan data");
      }

      const result = await responses.json();

      if (responses.ok) {
        alert("Data Berhasil disimpan");
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function findIdMechanical(id) {
    const API_URL = "/api/mechanical/inventory/data/id";

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        console.log(response.err);
      } else {
        let available = false;
        const result = await response.json();

        for (let x = 0; x < result.length; x++) {
          if (id === result[x]["id"]) {
            available = true;
            break;
          }
        }
        if (available) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateMechanicalInventory(
    id,
    nameItem,
    rangeItem,
    brandItem,
    typeItem,
    qtyItem
  ) {
    try {
      const API_URL =
        "/api/mechanical/inventory/update/all-data";
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameItem,
          rangeItem,
          brandItem,
          typeItem,
          qtyItem,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        // throw new Error(result.error || "Gagal menghapus inventory");
        alert("Gagal edit inventory", result.err);
      }
      if (result) {
        alert(result.message);
      }
      // console.log(result.message);
    } catch (error) {
      console.log(error);
    }
  }
}
