const axios = require("axios");
const { 
  Product, 
  Province, 
  City, 
  District, 
  SubDistrict, 
  ShopAddress 
} = require("../models");

// Konfigurasi Axios Komerce
const komerceApi = axios.create({
  baseURL: "https://rajaongkir.komerce.id/api/v1",
  headers: {
    "key": process.env.KOMERCE_API_KEY, 
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

class RajaOngkirService {
  
  // --- WILAYAH (CACHING SYSTEM) ---

  async getProvinces() {
    try {
      const dbResult = await Province.findAll();
      // Validasi: Pastikan data tidak rusak (province_id tidak null)
      if (dbResult.length > 0 && dbResult[0].province_id !== null) {
        return dbResult.map((row) => JSON.parse(row.data));
      }
      
      // Cleanup jika data rusak
      if (dbResult.length > 0) await Province.destroy({ where: {}, truncate: true });

      console.log("📡 Fetching Provinces from API...");
      const response = await komerceApi.get("/destination/province");
      const apiResults = response.data.data;
      if (!apiResults) return [];

      await Province.bulkCreate(apiResults.map((p) => ({
        province_id: p.province_id || p.id, 
        data: JSON.stringify(p),
      })), { updateOnDuplicate: ["data"] });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal ambil provinsi: ${error.message}`);
    }
  }

  async getCities(provinceId) {
    if (!provinceId) throw new Error("Province ID required");
    try {
      const dbResult = await City.findAll({ where: { province_id: provinceId } });
      if (dbResult.length > 0 && dbResult[0].city_id !== null) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      if (dbResult.length > 0) await City.destroy({ where: { province_id: provinceId } });

      console.log(`📡 Fetching Cities for Prov ${provinceId}...`);
      const response = await komerceApi.get(`/destination/city/${provinceId}`);
      const apiResults = response.data.data;
      if (!apiResults) return [];

      await City.bulkCreate(apiResults.map((c) => ({
        city_id: c.city_id || c.id,
        province_id: provinceId,
        data: JSON.stringify(c),
      })), { updateOnDuplicate: ["data"] });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal ambil kota: ${error.message}`);
    }
  }

  async getDistricts(cityId) {
    if (!cityId) throw new Error("City ID required");
    try {
      const dbResult = await District.findAll({ where: { city_id: cityId } });
      if (dbResult.length > 0 && dbResult[0].district_id !== null) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      if (dbResult.length > 0) await District.destroy({ where: { city_id: cityId } });

      console.log(`📡 Fetching Districts for City ${cityId}...`);
      const response = await komerceApi.get(`/destination/district/${cityId}`);
      const apiResults = response.data.data;
      if (!apiResults) return [];

      await District.bulkCreate(apiResults.map((d) => ({
        district_id: d.district_id || d.id,
        city_id: cityId,
        data: JSON.stringify(d),
      })), { updateOnDuplicate: ["data"] });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal ambil kecamatan: ${error.message}`);
    }
  }

  async getSubDistricts(districtId) {
    if (!districtId) throw new Error("District ID required");
    try {
      const dbResult = await SubDistrict.findAll({ where: { district_id: districtId } });
      if (dbResult.length > 0 && dbResult[0].sub_district_id !== null) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      if (dbResult.length > 0) await SubDistrict.destroy({ where: { district_id: districtId } });

      console.log(`📡 Fetching SubDistricts for District ${districtId}...`);
      const response = await komerceApi.get(`/destination/sub-district/${districtId}`);
      const apiResults = response.data.data;
      if (!apiResults) return [];

      await SubDistrict.bulkCreate(apiResults.map((v) => ({
        sub_district_id: v.sub_district_id || v.id,
        district_id: districtId,
        data: JSON.stringify(v),
      })), { updateOnDuplicate: ["data"] });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal ambil kelurahan: ${error.message}`);
    }
  }

  // --- LOGIC ONGKIR ---

  async calculateCost({ destination, items, courier = "jne:sicepat:jnt" }) {
    try {
      // 1. Ambil Alamat Toko dari DB (Origin)
      const shopInfo = await ShopAddress.findOne();
      if (!shopInfo || !shopInfo.districtId) {
        throw new Error("Alamat toko belum diatur oleh Admin.");
      }
      const origin = shopInfo.districtId;

      // 2. Hitung Total Berat
      let totalWeight = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.id);
        if (product) {
          // Asumsi 1kg jika berat tidak ada di DB
          const weight = product.weight || 1000; 
          totalWeight += (weight * item.quantity);
        }
      }
      if (totalWeight === 0) totalWeight = 1000;

      // 3. Panggil API Cost
      const params = new URLSearchParams();
      params.append("origin", origin);
      params.append("destination", destination); // ID Kecamatan Tujuan
      params.append("weight", totalWeight);
      params.append("courier", courier);

      const response = await komerceApi.post("/calculate/district/domestic-cost", params);
      const rawResults = response.data.data;

      // 4. Filter & Sort
      const cleanedResults = rawResults
        .filter((i) => i.cost > 0)
        .sort((a, b) => a.cost - b.cost);

      return cleanedResults;

    } catch (error) {
      console.error("Ongkir Error:", error.response?.data || error.message);
      throw new Error("Gagal menghitung ongkir");
    }
  }
}

module.exports = new RajaOngkirService();