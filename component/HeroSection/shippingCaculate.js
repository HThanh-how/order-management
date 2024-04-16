


function costCalculator(weight, cost) {
    if (weight <= 300) {

        return cost;

    } else if (weight >300 && weight <1000) {
        return cost*1.2;
    }
    else if (weight >=1000) {
        return cost*(1.4+(weight-1000)/1000);
    }
}
export function calculateShippingCost(sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight) {
    const baseCost = 15000;
    
    // return costCalculator(weight, baseCost);
    console.log(sendProvinceCode, receiveProvinceCode)
    if (sendProvinceCode === receiveProvinceCode) {
        return costCalculator(weight, baseCost);
    }
    console.log(sendProvinceCode, receiveProvinceCode)
    if (sendProvinceCode !== receiveProvinceCode) {
        const distance = Math.abs(sendProvinceCode - receiveProvinceCode+1);
        const distanceCost = distance * 1000;
        return costCalculator(weight, baseCost + distanceCost);
    }


    return shippingCost;
}