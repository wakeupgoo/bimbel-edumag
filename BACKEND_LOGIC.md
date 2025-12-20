URL: https://script.google.com/macros/s/AKfycbxsheqbKDYDDHVP_cg__P1QmqsPyHSWquklMCBUoYbeDionsjgynmFlxoaO3dItzjQRwg/exec

// TOKEN KEAMANAN (Samakan dengan yang ada di Admin Dashboard Anda)
const SECRET_TOKEN = "TOKEN_RAHASIA_KITA";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;

  try {
    // 1. Ambil Riwayat Nilai (getHistory)
    if (action === "getHistory") {
      const sheet = ss.getSheetByName("progress");
      if (!sheet) return response({ status: "error", message: "Sheet 'progress' tidak ditemukan" });

      const values = sheet.getDataRange().getValues();
      const headers = values.shift(); // Ambil baris pertama sebagai header

      // Ambil token dari URL dan bersihkan
      const searchToken = (e.parameter.token_siswa || "").toString().trim().toUpperCase();

      // Filter data: Kolom G (Index 6) adalah Token Siswa
      const filtered = values.filter(row => {
        return row[6] && row[6].toString().trim().toUpperCase() === searchToken;
      });

      return response({
        status: "success",
        history: formatToJSON(headers, filtered.reverse()) // Terbaru di atas
      });
    }

    // 2. Ambil Daftar Siswa (getStudents) - Perlu token auth
    if (action === "getStudents") {
      const token = e.parameter.token;
      const savedToken = PropertiesService.getScriptProperties().getProperty('ACTIVE_SESSION_TOKEN');

      if (!token || token !== savedToken) {
        return response({ status: "error", message: "Token tidak valid" });
      }

      const sheet = ss.getSheetByName("Siswa");
      const values = sheet.getDataRange().getValues();
      const headers = values.shift();
      return response(formatToJSON(headers, values));
    }

  } catch (err) {
    return response({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Fitur Login Admin
    if (data.action === "login") {
      const sheetUsers = ss.getSheetByName("users");
      const values = sheetUsers.getDataRange().getValues();
      values.shift();
      const user = values.find(row =>
        row[0].toString() === data.username.toString() &&
        row[1].toString() === data.password.toString()
      );

      if (user) {
        // Generate UUID sebagai authToken
        const authToken = Utilities.getUuid();

        // Simpan token ke PropertiesService
        PropertiesService.getScriptProperties().setProperty('ACTIVE_SESSION_TOKEN', authToken);

        return response({
          status: "success",
          token: authToken,
          nama: user[2]
        });
      } else {
        return response({
          status: "error",
          error: "Username atau Password salah!"
        });
      }
    }

    // Verifikasi token untuk semua action selain login
    const token = data.token;
    const savedToken = PropertiesService.getScriptProperties().getProperty('ACTIVE_SESSION_TOKEN');

    if (!token || token !== savedToken) {
      return response({ status: "error", message: "Token tidak valid atau sudah kadaluarsa" });
    }

    // 2. Fitur Input Progress Belajar
    if (data.action === "inputProgress") {
      const sheetProgress = ss.getSheetByName("progress");
      sheetProgress.appendRow([
        new Date(),
        data.tutor,
        data.siswa,
        data.materi,
        data.catatan,
        data.nilai,
        data.token_siswa.toString().trim()
      ]);
      return response({ status: "success", message: "Data berhasil disimpan!" });
    }

    // 3. Tambah Siswa Baru
    if (data.action === "addStudent") {
      const sheetSiswa = ss.getSheetByName("Siswa");
      sheetSiswa.appendRow([
        data.id_siswa,
        data.nama_siswa,
        data.kelas_siswa,
        data.token_siswa,
        data.whatsapp_siswa
      ]);
      return response({ status: "success", message: "Siswa berhasil ditambahkan!" });
    }

    // 4. Edit Siswa
    if (data.action === "editStudent") {
      const sheetSiswa = ss.getSheetByName("Siswa");
      const values = sheetSiswa.getDataRange().getValues();

      for (let i = 1; i < values.length; i++) {
        if (values[i][3] === data.old_token) { // Kolom D adalah token
          sheetSiswa.getRange(i + 1, 1, 1, 5).setValues([[
            data.id_siswa,
            data.nama_siswa,
            data.kelas_siswa,
            data.token_siswa,
            data.whatsapp_siswa
          ]]);
          return response({ status: "success", message: "Data siswa berhasil diupdate!" });
        }
      }
      return response({ status: "error", message: "Siswa tidak ditemukan" });
    }

    // 5. Hapus Siswa
    if (data.action === "deleteStudent") {
      const sheetSiswa = ss.getSheetByName("Siswa");
      const values = sheetSiswa.getDataRange().getValues();

      for (let i = 1; i < values.length; i++) {
        if (values[i][3] === data.token_siswa) { // Kolom D adalah token
          sheetSiswa.deleteRow(i + 1);
          return response({ status: "success", message: "Siswa berhasil dihapus!" });
        }
      }
      return response({ status: "error", message: "Siswa tidak ditemukan" });
    }

  } catch (err) {
    return response({ status: "error", message: "Server Error: " + err.toString() });
  }
}

function formatToJSON(headers, rows) {
  const keys = headers.map(h => h.toString().trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.map(row => {
    let obj = {};
    keys.forEach((key, i) => {
      let val = row[i];
      if (val instanceof Date) {
        obj[key] = Utilities.formatDate(val, "GMT+7", "dd/MM/yyyy HH:mm");
      } else {
        obj[key] = val;
      }
    });
    return obj;
  });
}

function response(content) {
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}
