"use client";
import { Box, Button, Flex, Input, Select, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import data from "@/public/province.json";
import { ChangeEvent, useEffect, useState } from "react";
import { cityData, City, District, Ward } from "./CityData";
import {calculateShippingCost} from "./shippingCaculate"
import { useToast } from "@chakra-ui/react"

export default function AddressSelect() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [RecievedCity, setRecievedCity] = useState("");
  const [RecievedDistrict, setRecievedDistrict] = useState("");
  const [cost, setCost] = useState(0);
  const [sendProvinceCode, setSendProvinceCode] = useState<number | null>(null);
  const [sendDistrictCode, setSendDistrictCode] = useState<number | null>(null);
  const [receiveProvinceCode, setReceiveProvinceCode] = useState<number | null>(null);
  const [receiveDistrictCode, setReceiveDistrictCode] = useState<number | null>(null);
  const [weight, setWeight] = useState(0);
  const toast = useToast()



  const handleButtonClick = () => {
    const costCal = calculateShippingCost(sendProvinceCode, sendDistrictCode, receiveProvinceCode, receiveDistrictCode, weight);

    // console.log(sendProvinceCode, sendProvinceCode, receiveProvinceCode, receiveDistrictCode, weight, costCal)
    setCost(costCal)
    if (sendProvinceCode === null || receiveProvinceCode === null) {
      
      setCost(0)
      toast({
        title: "Chưa thể tính toán",
        description: "Vui lòng điền tỉnh thành để chúng tôi tính toán chi phí",
        status: "warning",
        duration: 3000,
        isClosable: true,
        
      })
      return;
    }
    if (weight === 0) {
      
      toast({
        title: "Lưu ý",
        description: "Đây là ước tính dựa trên khối lượng mặc định dưới 300g, giá cả thực tế có thể khác nhau",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      return;
    }
    toast({
      title: "Chú ý",
      description: "Giá cả thực tế có thể khác so với ước tính, phụ thuộc vào nhiều yếu tố khác nhau",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  };

  

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(event.target.value);
  };
  const RecieveCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecievedCity(event.target.value);
    setRecievedDistrict("");
  };

  const RecieveDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecievedDistrict(event.target.value);
  };
  const selectedCityData = cityData.find(
    (city) => city.codename === selectedCity
  );
  const selectedDistrictData = selectedCityData?.districts.find(
    (district) => district.codename === selectedDistrict
  );

  const getProvinceCode = (cityCodename: string) => {
    const city = cityData.find(city => city.codename === cityCodename);
    return city ? city.code : null;
  };
  
  // Function to get district code
  const getDistrictCode = (cityCodename: string, districtCodename: string) => {
    const city = cityData.find(city => city.codename === cityCodename);
    if (city) {
      const district = city.districts.find(district => district.codename === districtCodename);
      return district ? district.code : null;
    }
    return null;
  };


  const RecievedCityData = cityData.find(
    (city) => city.codename === RecievedCity
  );
  const RecievedDistrictData = RecievedCityData?.districts.find(
    (district) => district.codename === RecievedDistrict
  );
  useEffect(() => {
    setSendProvinceCode(getProvinceCode(selectedCity));
    setSendDistrictCode(getDistrictCode(selectedCity, selectedDistrict));
  
    setReceiveProvinceCode(getProvinceCode(RecievedCity));
    setReceiveDistrictCode(getDistrictCode(RecievedCity, RecievedDistrict));
  }, [selectedCity, selectedDistrict, RecievedCity, RecievedDistrict]);

  
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }}>
      <Box w={{base: "60vw", md: "20vw"}} mt={4}>
        {/* Dropdown chọn thành phố */}
        <Text fontSize="xl">Địa chỉ nơi gửi</Text>
        <Select
          m={4}
          placeholder="Chọn tỉnh thành"
          value={selectedCity}
          onChange={handleCityChange}
          variant="filled"
        >
          <option value="" disabled hidden>
            Chọn tỉnh thành
          </option>
          {cityData.map((city) => (
            <option key={city.code} value={city.codename}>
              {city.name}
            </option>
          ))}
        </Select>

        {/* Dropdown chọn quận */}

        <Select
          m={4}
          placeholder="Chọn quận"
          isDisabled={selectedCity == "" ? true : false}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          variant="filled"
        >
          <option value="" disabled hidden>
            Chọn quận
          </option>
          {selectedCityData?.districts.map((district) => (
            <option key={district.code} value={district.codename}>
              {district.name}
            </option>
          ))}
        </Select>

        {/* Dropdown chọn phường */}

        <Select
          m={4}
          variant="filled"
          placeholder="Chọn phường"
          isDisabled={selectedDistrict == "" ? true : false}
        >
          <option value="" disabled hidden>
            Chọn phường
          </option>
          {selectedDistrictData?.wards.map((ward) => (
            <option key={ward.code} value={ward.codename}>
              {ward.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box w={{base: "60vw", md: "20vw"}} mt={4}>
        {/* Dropdown chọn thành phố */}
        <Text fontSize={"xl"}>Địa chỉ nơi nhận</Text>
        <Select
          m={4}
          placeholder="Chọn tỉnh thành"
          value={RecievedCity}
          onChange={RecieveCityChange}
          variant="filled"
        >
          <option value="" disabled hidden>
            Chọn tỉnh thành
          </option>
          {cityData.map((city) => (
            <option key={city.code} value={city.codename}>
              {city.name}
            </option>
          ))}
        </Select>

        {/* Dropdown chọn quận */}

        <Select
          m={4}
          placeholder="Chọn quận"
          isDisabled={RecievedCity == "" ? true : false}
          value={RecievedDistrict}
          onChange={RecieveDistrictChange}
          variant="filled"
        >
          <option value="" disabled hidden>
            Chọn quận
          </option>
          {RecievedCityData?.districts.map((district) => (
            <option key={district.code} value={district.codename}>
              {district.name}
            </option>
          ))}
        </Select>

        {/* Dropdown chọn phường */}

        <Select
          m={4}
          variant="filled"
          placeholder="Chọn phường"
          isDisabled={RecievedDistrict == "" ? true : false}
        >
          <option value="" disabled hidden>
            Chọn phường
          </option>
          {RecievedDistrictData?.wards.map((ward) => (
            <option key={ward.code} value={ward.codename}>
              {ward.name}
            </option>
          ))}
        </Select>
      </Box>
      
      <Input m={4} placeholder="Khối lượng (g)" bgColor="gray.50" w={{base: "60vw", md: "20vw"}}  onChange={(e)=>setWeight(Number(e.target.value))}/>
      
      <Button  m={4} ml={4}        color="white"
                  
                    backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                    sx={{
                      '@media (hover: hover)': {
                        _hover: {
                          backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                        }
                      }
                    }} w={{base: '80%', md: '40%'}} size={{base:'sm', md: 'md'}} onClick={handleButtonClick}>
          Ước tính
      </Button>
      <Box>{cost !== 0 && <Flex  m={4} fontSize="xl" fontWeight={600} color="gray.800">Chi phí:  <Text mx={2} color="green">{" "} {cost} {" "}</Text>  đồng</Flex>}</Box>
    </SimpleGrid>
  );
}
