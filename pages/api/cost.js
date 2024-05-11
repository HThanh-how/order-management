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