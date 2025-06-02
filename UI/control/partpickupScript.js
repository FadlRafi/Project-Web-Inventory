export async function mainPartPickup() {
  const nikKaryawan = document.getElementById("IdKaryawan");
  const applyButton = document.getElementById("idKaryawanApply");
  const barangButton = document.getElementById("idBarangButton");
  const containerKaryawan = document.getElementById("containerKaryawan");
  const inputBarang = document.getElementById("KodeBarang");
  const ambilBarangButton = document.getElementById("AmbilBarangButton");
  let registered = false;

  const data = [];

  nikKaryawan.focus();

  applyButton.addEventListener("click", async () => {
    await getNIK(nikKaryawan.value);

    if (registered) {
      const dataKaryawan = await getNIK(nikKaryawan.value);

      containerKaryawan.innerHTML = "";
      containerKaryawan.classList.add("active");
      renderDataKaryawan(
        dataKaryawan[0]["name"],
        dataKaryawan[0]["nik"],
        dataKaryawan[0]["departemen"]
      );
      inputBarang.removeAttribute("disabled");
      setTimeout(() => {
        inputBarang.focus();
      }, 100);
      registered = false;
    } else {
      containerKaryawan.classList.remove("active");
      nikKaryawan.value = "";
      nikKaryawan.focus();
    }
  });

  inputBarang.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      barangButton.click();
    }
  });

  barangButton.addEventListener("click", async () => {
    const catInventory = inputBarang.value.charAt(0);
    let dataBarang;
    if (catInventory === "E") {
      dataBarang = await getStuffElectrical(inputBarang.value);
    } else if (catInventory === "M") {
      dataBarang = await getStuffMechanical(inputBarang.value);
    }
    console.log(dataBarang);
    // console.log(dataBarang[0]["id"]);
    if (dataBarang.length === 0) {
      inputBarang.value = "";
      inputBarang.focus();
      return alert("Barang tidak terdaftar");
    }

    const existingIndex = data.findIndex(
      (object) => object.item.id === dataBarang[0]["id"]
    );
    console.log(existingIndex);
    if (existingIndex !== -1) {
      const inputQty = document.querySelectorAll(".inputQty");
      const inputToUpdate = inputQty[existingIndex];
      inputToUpdate.value = parseInt(inputToUpdate.value) + 1;

      inputBarang.value = "";
      inputBarang.focus();
      return;
    }

    const item = {
      id: dataBarang[0]["id"],
      name: dataBarang[0]["nameItem"],
      range: dataBarang[0]["rangeItem"],
      brand: dataBarang[0]["brandItem"],
      type: dataBarang[0]["typeItem"],
      qty: dataBarang[0]["qtyItem"],
      outItem: 1,
    };
    data.push({
      item,
    });

    renderBarang(item);
    console.log(data);
    inputBarang.value = "";
    inputBarang.focus();
  });

  ambilBarangButton.addEventListener("click", async () => {
    if (data.length !== 0) {
      data.forEach((object) => {
        const newQty = object.item.qty - parseInt(object.item.outItem);
        object.item.qty = newQty;
        // console.log(object.item.qty);
      });

      data.forEach((object) => {
        const catInventory = object.item.id.charAt(0);

        if(catInventory === "E") {
          updateOutItemElectrical(object.item.id, object.item.qty);
        }
        else if(catInventory === "M") {
          updateOutItemMechanical(object.item.id, object.item.qty);
        }
      });
      
      alert("Data berhasil di Update!!");
      nikKaryawan.value = "";
      inputBarang.value = "";
      containerKaryawan.innerHTML = "";
      containerKaryawan.classList.remove("active");
      document.getElementById("dataBarang").innerHTML = "";
      console.log(data);
    } else {
      alert("Harap masukan data barang yang mau diambil !!!");
      nikKaryawan.focus();
    }
  });

  function renderDataKaryawan(nama, nik, depart) {
    const dataKarywan = document.createElement("pre");

    dataKarywan.setAttribute("class", "dataKaryawan");

    dataKarywan.innerHTML = `
    Nama              : ${nama}

    NIK                  : ${nik}
    
    Departmen    : ${depart}
    `;

    containerKaryawan.appendChild(dataKarywan);
  }

  async function getNIK(nik) {
    const API_URL = "http://127.0.0.1:5700/api/datakaryawan";

    try {
      const responses = await fetch(`${API_URL}/${nik}`);
      const result = await responses.json();

      if (!responses.ok) {
        alert("Terjadi kesalahan dalam mengambil data");
        return;
      }

      if (result.length === 0) {
        alert("NIK tidak terdaftar");
        registered = false;
      } else {
        // console.log(result);
        registered = true;
        return result;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function getStuffElectrical(barcode) {
    try {
      const API_URL = "http://127.0.0.1:5700/api/data/barang";
      const id = barcode;

      const response = await fetch(`${API_URL}/${id}`);
      const result = await response.json();
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async function getStuffMechanical(barcode) {
    try {
      const API_URL = "http://127.0.0.1:5700/api/mechanical/inventory/data/by";
      const id = barcode;

      const response = await fetch(`${API_URL}/${id}`);
      const result = await response.json();
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  function renderBarang(item) {
    const { id, name, range, brand, type, qty, outItem } = item;
    const containerBarang = document.getElementById("dataBarang");
    // console.log(id, name, range, brand, type, qty);

    const itemInventory = document.createElement("div");
    const idItem = document.createElement("span");
    const nameItem = document.createElement("span");
    const rangeItem = document.createElement("span");
    const brandItem = document.createElement("span");
    const typeItem = document.createElement("span");
    const qtyItem = document.createElement("span");
    const outContainer = document.createElement("div");
    const minButton = document.createElement("button");
    const plusButton = document.createElement("button");
    const inputQty = document.createElement("input");

    itemInventory.setAttribute("class", "itemInventory");
    idItem.setAttribute("class", "idItem");
    nameItem.setAttribute("class", "nameItem");
    rangeItem.setAttribute("class", "rangeItem");
    brandItem.setAttribute("class", "brandItem");
    typeItem.setAttribute("class", "typeItem");
    qtyItem.setAttribute("class", "qtyItem");
    outContainer.setAttribute("class", "outItem");
    minButton.setAttribute("class", "minButton");
    minButton.setAttribute("id", "MinButton");
    plusButton.setAttribute("class", "plusButton");
    plusButton.setAttribute("id", "PlusButton");
    inputQty.setAttribute("class", "inputQty");
    inputQty.setAttribute("type", "text");
    inputQty.value = outItem;

    const txtIdItem = document.createTextNode(id);
    const textNameItem = document.createTextNode(name);
    const rangeNameItem = document.createTextNode(range);
    const brandNameItem = document.createTextNode(brand);
    const typeNameItem = document.createTextNode(type);
    const qtyNameItem = document.createTextNode(qty);
    const minButtonText = document.createTextNode("-");
    const plusButtonText = document.createTextNode("+");

    idItem.appendChild(txtIdItem);
    nameItem.appendChild(textNameItem);
    rangeItem.appendChild(rangeNameItem);
    brandItem.appendChild(brandNameItem);
    typeItem.appendChild(typeNameItem);
    qtyItem.appendChild(qtyNameItem);
    minButton.appendChild(minButtonText);
    plusButton.appendChild(plusButtonText);
    outContainer.append(minButton, inputQty, plusButton);

    itemInventory.append(
      idItem,
      nameItem,
      rangeItem,
      brandItem,
      typeItem,
      qtyItem,
      outContainer
    );
    containerBarang.appendChild(itemInventory);

    minButton.addEventListener("click", () => {
      const outStuff = data.find((object) => object.item.id === id);
      console.log(inputQty.value);
      if (inputQty.value > 1) {
        inputQty.value = parseInt(inputQty.value) - 1;
        outStuff.item.outItem = inputQty.value;
      } else {
        const findIndexData = data.findIndex((object) => object.item.id === id);
        data.splice(findIndexData, 1);

        itemInventory.classList.add("fade-out");

        setTimeout(() => {
          containerBarang.innerHTML = "";

          data.forEach((object) => {
            renderBarang(object.item);
          });
        }, 300);
      }
    });

    plusButton.addEventListener("click", () => {
      const outStuff = data.find((object) => object.item.id === id);
      inputQty.value = parseInt(inputQty.value) + 1;

      outStuff.item.outItem = inputQty.value;
    });
  }

  async function updateOutItemElectrical(id, qtyItem) {
    const API_URL = "http://127.0.0.1:5700/api/update/outitem";

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qtyItem }),
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Gagal update data");
        alert("Gagal Update Data!!!");
      }

      console.log(result);
    } catch (error) {
      console.log(error);
      alert("Gagal Update Data!!!");
    }
  }

  async function updateOutItemMechanical(id, qtyItem) {
    const API_URL =
      "http://127.0.0.1:5700/api/mechanical/inventory/update/out-item";

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qtyItem }),
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Gagal update data");
        alert("Gagal Update Data!!!");
      }

      console.log(result);
    } catch (error) {
      console.log(error);
      alert("Gagal Update Data!!!");
    }
  }
}
