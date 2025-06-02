export async function mainRegister() {
  document.getElementById("nik").value = "";
  document.getElementById("name").value = "";
  document.getElementById("listDepartement").value = "";


  document
    .getElementById("inputKaryawan")
    .addEventListener("click", async () => {
      const nik = document.getElementById("nik");
      const name = document.getElementById("name");
      const depart = document.getElementById("listDepartement");

      if (!nik.value || !name.value || !depart.value) {
        if (!nik.value) {
          document.getElementById("nikInvalid").innerText =
            "NIK tidak boleh kosong !!!";
        } else {
          document.getElementById("nikInvalid").innerText = "";
        }
        if (!name.value) {
          document.getElementById("nameInvalid").innerText =
            "Nama tidak boleh kosong !!!";
        } else {
          document.getElementById("nameInvalid").innerText = "";
        }
        if (!depart.value) {
          document.getElementById("departementInvalid").innerText =
            "Departement tidak boleh kosong !!!";
        } else {
          document.getElementById("departementInvalid").innerText = "";
        }
        return;
      } else {
        document.getElementById("nikInvalid").innerText = "";
        document.getElementById("nameInvalid").innerText = "";
        document.getElementById("departementInvalid").innerText = "";
      }

      const confirmRegister = confirm("Apakah anda yakin mau register?");
      if (confirmRegister) {
        const dataNik = await getAllNik();
        let available = false;
        dataNik.forEach((data) => {
          if (nik.value === data["nik"]) {
            alert("Nik sudah terdaftar");
            available = true;
            return;
          }
        });
        if (!available) {
          registerEmployee(nik.value, name.value, depart.value);
        }
        alert("Berhasil register karyawan !!!!");
        nik.value = "";
        name.value = "";
        depart.value = "";
      } else {
        alert("Register dibatalkan");
      }
    });

  async function registerEmployee(nikEmployee, name, depart) {
    try {
      const API_URL = "http://127.0.0.1:5700/api/register/register-employee";
      const nik = nikEmployee;
      const nameEmployee = name;
      const departement = depart;
      const responses = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik, nameEmployee, departement }),
      });
      const result = await responses.json();

      if (!responses.ok) {
        alert("Gagal register karyawan");
        console.log(result);
      }
      console.log(result);
    } catch (error) {
      alert(error);
    }
  }

  async function getAllNik() {
    try {
      const API_URL = "http://127.0.0.1:5700/api/register/get/all-nik";
      const responses = await fetch(API_URL);
      const result = await responses.json();

      if (!responses.ok) {
        console.log(result);
        return;
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
