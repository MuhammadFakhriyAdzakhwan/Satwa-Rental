const vehicles = [
  {
    id: 1,
    nama: "Toyota Avanza",
    jenis: "Mobil",
    harga: 350000,
    gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZDtSjAH-K92CKKmNsM1YokrqqYdKkumPLnW38kTQfeNY9pm9D94n7M5sr5ymBC193718&usqp=CAU",
  },
  {
    id: 2,
    nama: "Suzuki Ertiga",
    jenis: "Mobil",
    harga: 370000,
    gambar: "https://www.suzukiauto.co.za/hubfs/Ertiga%20-%20Metallic%20Magma%20Grey.png",
  },
  {
    id: 3,
    nama: "Honda Beat",
    jenis: "Motor",
    harga: 90000,
    gambar: "https://www.hondacengkareng.com/wp-content/uploads/2018/11/Honda-Beat-Sporty-Deluxe-SmartKey-Matte-Blue-1.png",
  },
];

const container = document.getElementById("vehicleList");

vehicles.forEach(v => {
  const card = document.createElement("div");

  card.className =
    "bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl";

  card.innerHTML = `
    <img src="${v.gambar}" alt="${v.nama}" class="w-full h-48 object-cover">
    <div class="p-4">
      <h4 class="text-lg font-semibold">${v.nama}</h4>
      <p class="text-sm text-gray-500 mb-2">${v.jenis}</p>
      <p class="text-blue-600 font-bold mb-4">Rp ${v.harga.toLocaleString()}/hari</p>
      <a href="booking.html" class="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Sewa Sekarang</a>
    </div>
  `;

  container.appendChild(card);
});


 // script.js

// 1. Dapatkan elemen formulir
const loginForm = document.getElementById('loginForm');

// 2. Tambahkan event listener untuk submit formulir
loginForm.addEventListener('submit', async function(event) {
    // Mencegah refresh halaman default
    event.preventDefault(); 

    // 3. Ambil nilai dari input form
    const email = document.getElementById('email').value.trim();
    // Di backend, kita akan menggunakan email untuk mencari user, 
    // tetapi kita akan mengirimkannya sebagai 'username' atau 'email' tergantung backend Anda.
    const password = document.getElementById('password').value.trim();

    // 4. Endpoint Login API Anda
    // Ganti URL ini sesuai dengan rute login yang Anda buat di server.js (misalnya: /api/auth/login)
    const loginEndpoint = '/api/auth/login'; 

    try {
        // 5. Kirim data ke server menggunakan Fetch API
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Beritahu server bahwa kita mengirim JSON
            },
            // Kirim email dan password ke server
            body: JSON.stringify({ email, password }) 
        });

        const data = await response.json();

        // 6. Cek status respons dari server
        if (response.ok) {
            // LOGIN BERHASIL!

            // Simpan token JWT untuk otentikasi selanjutnya
            localStorage.setItem('authToken', data.token);
            // Simpan role (PENTING untuk membedakan Admin)
            localStorage.setItem('userRole', data.user.role); 
            
            alert('Login Berhasil! Selamat datang ' + data.user.username);

            // Arahkan pengguna berdasarkan role
            if (data.user.role === 'admin') {
                // Arahkan Admin ke halaman upload/dashboard admin
                window.location.href = 'admin_dashboard.html'; 
            } else {
                // Arahkan Pengguna biasa ke halaman utama/katalog
                window.location.href = 'index.html'; 
            }

        } else {
            // LOGIN GAGAL! (misalnya: password salah, user tidak ditemukan)
            // Tampilkan pesan error dari server
            alert('Login Gagal: ' + (data.message || 'Terjadi kesalahan saat masuk.'));
        }

    } catch (error) {
        console.error('Error saat menghubungi server:', error);
        alert('Gagal terhubung ke server. Pastikan server berjalan.');
    }
});

    // register
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Registrasi berhasil! Silakan login.`);
            window.location.href = "login.html"; // redirect ke halaman login
        } else {
            alert(`Registrasi Gagal: ${data.message}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Gagal terhubung ke server.');
    }
});

