// server.js

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

// Konfigurasi Koneksi Database PostgreSQL
const pool = new Pool({
    user: 'postgres',    
    host: 'localhost',
    database: 'sewa_kendaraan_db',
    password: '123',
    port: 5432,
});

// Middleware
app.use(cors()); // Izinkan permintaan dari frontend Anda
app.use(express.json()); // Memparsing body permintaan dalam format JSON

// ===================================
// ENDPOINT REGISTER
// ===================================
app.post('/api/register', async (req, res) => {
    const { nama, email, password } = req.body;

    try {
        // 1. Cek apakah pengguna sudah terdaftar
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        // 2. Hash Password (Wajib untuk keamanan!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Simpan pengguna baru ke database
        const newUser = await pool.query(
            'INSERT INTO users (nama, email, password) VALUES ($1, $2, $3) RETURNING id, nama, email',
            [nama, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Registrasi berhasil!', 
            user: newUser.rows[0] 
        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat registrasi.' });
    }
});

// ===================================
// ENDPOINT LOGIN
// ===================================
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cari pengguna berdasarkan email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Email atau Password salah.' });
        }

        // 2. Bandingkan Password (Plain text dengan Hash yang tersimpan)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau Password salah.' });
        }

        // 3. Login berhasil (Di sini Anda biasanya akan membuat JWT Token)
        res.status(200).json({ 
            message: 'Login berhasil!', 
            user: { id: user.id, nama: user.nama, email: user.email } 
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat login.' });
    }
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});