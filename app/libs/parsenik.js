const source = require("~/libs/source.json");

/**
 * Olah nik untuk mengetahui apakah valid atau tidak
 *
 * @param {number} nik
 * @return {boolean}
 * @private
 */
export function isValid(nik) {
  const result = parseNik(nik);
  return result.valid;
}

/**
 * Olah nik sehingga menghasilkan nilai valid, jenis kelamin, tanggal lahir, provinsi, kabupaten_kota, kecamatan, kodepos, kode unik
 *
 * @param {number} nik
 * @return {object}
 * @private
 */
export function parseNik(nik) {
  let resp = {
    nik: nik,
    valid: true,
  };

  try {
    let data = {
      jenis_kelamin: "LAKI-LAKI",
      tanggal_lahir: "",
      provinsi: "",
      kabupaten_kota: "",
      kecamatan: "",
      kodepos: "",
    };

    const tmpNIK = nik.toString();
    if (typeof nik !== "number") {
      throw new Error("NIK harus dalam bentuk angka");
    }
    if (tmpNIK.length !== 16) {
      throw new Error("Jumlah karakter NIK tidak sesuai");
    }

    let tglLahir = parseInt(tmpNIK.substring(6, 8), 10);
    let blnLahir = parseInt(tmpNIK.substring(8, 10), 10);
    let thnLahir = parseInt(tmpNIK.substring(10, 12), 10);

    // proses pencarian jenis kelamin
    if (tglLahir > 40) {
      data.jenis_kelamin = "PEREMPUAN";
      tglLahir -= 40;
    }

    // proses pencarian tanggal lahir
    tglLahir = tglLahir.toString().padStart(2, "0");
    blnLahir = blnLahir.toString().padStart(2, "0");
    const curThn = new Date().getFullYear() % 100;
    thnLahir = thnLahir < curThn ? `20${thnLahir}` : `19${thnLahir}`;
    const tglLahirFull = `${thnLahir}-${blnLahir}-${tglLahir}`;

    // Memastikan tanggal lahir valid
    if (!isValidDate(tglLahirFull)) {
      throw new Error("Tanggal Lahir tidak sesuai");
    }
    data.tanggal_lahir = tglLahirFull;

    // proses pencarian wilayah
    const foundDistrict = source.some((prov) =>
      prov.kabupaten_kota.some((kabkot) =>
        kabkot.kecamatan.some((kec) => {
          const check = kec.kode === tmpNIK.substring(0, 6);
          if (check) {
            data.provinsi = prov.nama;
            data.kabupaten_kota = kabkot.nama;
            data.kecamatan = kec.nama;
            data.kodepos = kec.kodepos;
          }
          return check;
        })
      )
    );

    if (!foundDistrict) {
      throw new Error("Wilayah tidak ditemukan");
    }

    resp = { ...resp, ...data };
  } catch (error) {
    resp.valid = false;
    resp.message = error.message;
  }

  return resp;
}

/**
 * Memastikan tanggal dalam format YYYY-MM-DD valid
 *
 * @param {string} dateString
 * @return {boolean}
 * @private
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return false;
  }
  return date.toISOString().startsWith(dateString);
}
