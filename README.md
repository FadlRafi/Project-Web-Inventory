Untuk mencoba project website ini bisa mengujungi link dibawah ini :
https://project-web-inventory-production.up.railway.app/

Ini merupakan project web pertama saya. Project ini merupakan rancanga implementasi untuk mendata spare part yang ada di tempat kerja saya saat ini.

Project ini menggunakan html, css, javascript dan MySql. 
html dan css digunakan sebagai pembuatan UI project. Javascript digunakan untuk mengelola menu-menu project. Untuk main app di project ini adalah server.js yang ada di file BackEnd. MySql digunakan sebagai database dari project ini untuk menyimpan data-data seperti data karyawan, part electrical dan part mechanical.

Untuk tahapan penggunan menu/item bisa ikuti langkah sebagai berikut:

1. Register
   Fungsi dari menu ini adalah untuk menginput data karyawan seperti NIK (Nomor Induk Karyawan), Nama dan departement.
   Jika karyawan tidak didaftarkan maka tidak bisa menggunakan menu Part Pickup.
2. Part Pickup
   Fungsi dari menu ini adalah untuk mengambil part-part yang ada di menu inventory baik itu inventory electrical maupun
   inventory mechanical. Untuk Id karyawan adalah NIK yang telah di daftarkan pada menu Register, sedangkan untuk Kode Barang
   merupakan Id Barang yang dapat dilihat pada menu Inventory.
3. Part In
   Fungsi dari menu ini untuk memasukan part baru atau edit part baik itu part mechanical ataupun part electrical.
   Yang nantinya ketika tombol Save Inventory maka akan menyimpan part yang telah diinputkan ke database dan bisa dilihat
   pada menu Inventory
4. Inventory
   Fungsi dari menu ini untuk melihat part/item electrical/mechanical dari database. Dan dari menu ini kita bisa edit isi dari
   part seperti Nama, Range, Brand, Category, Type, dan Quantity maupun menghapus part/item dari database.
