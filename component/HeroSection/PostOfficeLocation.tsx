"use client";
import { Box, Button, Flex, Input, Select, SimpleGrid, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import findPostOffice from "@/app/_lib/features/getPostOfficeLocation.js";

import data from "@/public/province.json";
import { ChangeEvent, useEffect, useState } from "react";
import { cityData, City, District, Ward } from "./CityData";
import { calculateShippingCost } from "./shippingCaculate"
import { useToast } from "@chakra-ui/react"
import Location from "@/app/_lib/PostOfficeLocation"
import { FiArrowUpRight } from "react-icons/fi";
interface Office {
  id: number;
  code: number;
  name: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  phone?: number | string;
}

export default function PostOfficeLocation() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState<string | null>(null);
  const [wardName, setWardName] = useState<string | null>(null);
  const [sendWard, setSendWard] = useState("");
  const toast = useToast()
  const [postOffices, setPostOffices] = useState<Office[]>([]);



  const handleButtonClick = () => {

    if (selectedCity === "") {


      toast({
        title: "Chưa tìm thấy",
        description: "Vui lòng điền tỉnh thành để chúng tôi tìm bưu cục cho bạn",
        status: "error",
        duration: 3000,
        isClosable: true,

      })
      return;
    }
    const offices = findPostOffice(provinceName, districtName, wardName)
      .map(office => ({ ...office, ward: String(office.ward) }));
    setPostOffices(offices);
    if (offices.length == 0) {

      toast({
        title: "Không tìm thấy bưu cục ở khu vực này",
        description: "Vui lòng chọn khu vực khác hoặc thử lại sau",
        status: "error",
        duration: 3000,
        isClosable: true,

      })
      return;
    }

    if (offices.length > 30) {

      toast({
        title: "Lưu ý: Có quá nhiều bưu cục hiển thị",
        description: "Vui lòng điền thêm quận để chúng tôi tìm bưu cục chính xác hơn",
        status: "success",
        duration: 3000,
        isClosable: true,

      })
      return;
    }
   
    // console.table(offices);
  };


  const getProvinceName = (cityCodename: string) => {
    const city = cityData.find(city => city.codename === cityCodename);
    return city ? city.name : null;
  };

  // Function to get district code
  const getDistrictName = (cityCodename: string, districtCodename: string) => {
    const city = cityData.find(city => city.codename === cityCodename);
    if (city) {
      const district = city.districts.find(district => district.codename === districtCodename);
      return district ? district.name : null;
    }
    return null;
  };
  const getWardName = (cityCodename: string, districtCodename: string, wardCodename: string) => {
    const city = cityData.find(city => city.codename === cityCodename);
    if (city) {
      const district = city.districts.find(district => district.codename === districtCodename);
      if (district) {
        const ward = district.wards.find(ward => ward.codename === wardCodename);
        return ward ? ward.name : null;
      }
    }
    return null;
  };


  useEffect(() => {
    setProvinceName(getProvinceName(selectedCity));
    setDistrictName(getDistrictName(selectedCity, selectedDistrict));
    setWardName(getWardName(selectedCity, selectedDistrict, sendWard));

  }, [selectedCity, selectedDistrict, sendWard]);








  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(event.target.value);
  };

  const handleWardChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSendWard(event.target.value);
  };


  const selectedCityData = cityData.find(
    (city) => city.codename === selectedCity
  );
  const selectedDistrictData = selectedCityData?.districts.find(
    (district) => district.codename === selectedDistrict
  );








  return (
    <SimpleGrid columns={{ base: 1, md: 2 }}>
      <Box w={{ base: "60vw", md: "20vw" }} mt={4}>
        {/* Dropdown chọn thành phố */}
        {/* <Text fontSize="xl">Địa chỉ nơi gửi</Text> */}
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
            Tất cả các quận
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
          onChange={handleWardChange}
        >
          <option value="" disabled hidden>
            Tất cả các phường
          </option>
          {selectedDistrictData?.wards.map((ward) => (
            <option key={ward.code} value={ward.codename}>
              {ward.name}
            </option>
          ))}
        </Select>
        <Button m={4} ml={4} color="white"
          backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
          sx={{
            '@media (hover: hover)': {
              _hover: {
                backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
              }
            }
          }} w={{ base: '80%', md: 'auto' }} size={{ base: 'sm', md: 'md' }} onClick={handleButtonClick}>
          Tìm bưu cục
        </Button>
      </Box>
      <Box overflow={"auto"} w={{ base: "60vw", md: "27vw" }} mt={2} m ={4} maxH={{ base: "40vh", md: "50vw", lg: "20vw" }}>
        {postOffices.map((postOffice, index) => (
          postOffice.phone && (


            <Box key={index} mb={3} >
              <a href={`https://www.google.com/maps/search/?api=1&query=VNPost+${postOffice.detailAddress}+${postOffice.district}+${postOffice.province}`}
                target="_blank"
                rel="noopener noreferrer">
                <Flex fontWeight={"bold"}
                >Bưu cục {" "} {postOffice.name} <FiArrowUpRight /></Flex>
                <Text>{postOffice.detailAddress}</Text> </a>
              {isMobile ? (
                <a href={`tel:${postOffice.phone}`}>
                  <Text>Điện thoại: 0{postOffice.phone.toLocaleString('en-US').replace(/,/g, ' ')}</Text>
                </a>
              ) : (
                <Text>Điện thoại: 0{postOffice.phone.toLocaleString('en-US').replace(/,/g, ' ')}</Text>
              )}


            </Box>

          )
        ))}
      </Box>



    </SimpleGrid>
  );
}
