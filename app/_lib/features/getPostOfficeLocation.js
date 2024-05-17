import locations from '../PostOfficeLocation';


export default function findPostOffice(province, district , ward) {
    province = province.replace('Tỉnh ', '').replace('Thành phố ', '').replace('Thủ đô ', '').trim();
    district = district ? district.replace('Quận ', '').replace('Thành phố ', '').replace('Huyện ', '').trim().replace('Thị trấn ', '').trim() : null;
    ward = ward ? ward.replace('Xã ', '').replace('Phường ', '').trim() : null;
console.log(typeof province, typeof district, typeof ward);

return locations.filter(location => 
    location.province.normalize('NFC') === province.normalize('NFC') &&
    (!district || location.district.normalize('NFC') === district.normalize('NFC')) &&
    (!ward || location.ward.normalize('NFC') === ward.normalize('NFC'))
);
}