

const regions = [
    { name: 'mienBacVungDongBac', provinces: [2, 4, 6, 8, 20, 22] },
    { name: 'mienBacVungTayBac', provinces: [10, 11, 12, 14, 15, 17] },
    { name: 'mienBacVungDongBangSongHong', provinces: [24, 35, 33, 36, 37, 34, 26, 1, 30, 31] },
    { name: 'mienTrungBacTrungBo', provinces: [38, 40, 42, 44, 45, 46] },
    { name: 'mienTrungTayNguyen', provinces: [62, 64, 66, 67, 68] },
    { name: 'mienTrungDuyenHaiNamTrungBo', provinces: [48, 49, 51, 52, 54, 56, 58, 60] },
    { name: 'mienNamDongNamBo', provinces: [70, 72, 74, 75, 77, 79] },
    { name: 'mienNamDongBangSongCuuLong', provinces: [80, 82, 83, 84, 86, 87, 89, 91, 92, 93, 94, 95, 96] },
  ];
  
  function findProvinceInfo(provinceId) {
    for (let region of regions) {
      let index = region.provinces.indexOf(provinceId);
      if (index !== -1) {
        return { region: region.name, position: index };
      }
    }
    return 1;
  }
  
  function costCalculator(weight, cost) {
    if (weight <= 300) {
      return cost;
    } else if (weight > 300 && weight < 1000) {
      return cost * 1.2;
    } else if (weight >= 1000) {
      return cost * (1.4 + (weight - 1000) / 1000);
    }
  }
  
  function calculateDistanceCost(senderProvinceId, receiverProvinceId) {
    let senderInfo = findProvinceInfo(senderProvinceId);
    let receiverInfo = findProvinceInfo(receiverProvinceId);
    console.log(senderInfo, receiverInfo)
    if (senderInfo && receiverInfo) {
        if (senderInfo.region === receiverInfo.region) {
          let distance = Math.abs(senderInfo.position - receiverInfo.position);
          return Math.min(distance, 3) * 1000;
        } else {
          let senderRegionIndex = regions.findIndex(region => region.name === senderInfo.region);
          let receiverRegionIndex = regions.findIndex(region => region.name === receiverInfo.region);
          let regionDistance = Math.abs(senderRegionIndex - receiverRegionIndex);
          return Math.min(regionDistance * 3000 + 1000, 20000);
        }
      }
  
    return 1000;
  }
  
  export function calculateShippingCost(sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight) {
    const baseCost = 15000;
  
    if (sendProvinceCode === receiveProvinceCode) {
      if (sendDistrictCode===receiveDistrictCode) {
        return costCalculator(weight, baseCost-5000);
      }
      return costCalculator(weight, baseCost);
    }
  
    if (sendProvinceCode !== receiveProvinceCode) {
      // const distance = Math.abs(sendProvinceCode - receiveProvinceCode + 1);
      
      const distanceCost = calculateDistanceCost(sendProvinceCode, receiveProvinceCode);
      console.log(sendProvinceCode, receiveProvinceCode, distanceCost)
      return costCalculator(weight, baseCost + distanceCost);
    }
  }