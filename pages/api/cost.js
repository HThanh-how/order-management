// pages/api/calculate-cost.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight } = req.body;

    const cost = calculateShippingCost(sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight);

    res.status(200).json({ cost });
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
// Khu vực 01:
[1]

// Khu vực 02:
[2, 31, 22, 30, 33, 21, 25, 26]

// Khu vực 03:
[4, 6, 8, 20, 19, 24]

// Khu vực 04:
[11, 12, 14, 15, 17]

// Khu vực 05:
[5, 27, 226, 35]

// Khu vực 06:
[38, 40, 42, 44, 45, 46]

// Khu vực 07:
[48, 49, 51]

// Khu vực 08:
[52, 54, 56]

// Khu vực 09:
[62, 64, 66, 67, 68]

// Khu vực 10:
[58, 60, 70, 72, 74, 75, 77]

// Khu vực 11:
[80, 82, 83, 84, 86, 87, 89, 91, 92, 93, 94, 95, 96]

// Khu vực 12:
[79]
function costCalculator(weight, cost) {
  if (weight <= 300) {
    return cost;
  } else if (weight > 300 && weight < 1000) {
    return cost * 1.2;
  } else if (weight >= 1000) {
    return cost * (1.4 + (weight - 1000) / 1000);
  }
}

function calculateShippingCost(sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight) {
  const baseCost = 15000;

  if (sendProvinceCode === receiveProvinceCode) {
    return costCalculator(weight, baseCost);
  }

  if (sendProvinceCode !== receiveProvinceCode) {
    const distance = Math.abs(sendProvinceCode - receiveProvinceCode + 1);
    const distanceCost = distance * 1000;
    return costCalculator(weight, baseCost + distanceCost);
  }
}