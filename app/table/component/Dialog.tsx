"use client";
import {
  Box,
  Select,
  Input,
  Text,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";


import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { useAddCustomerMutation } from "@/app/_lib/features/api/apiSlice"
import { cityData } from "@/component/HeroSection/CityData";


interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: Ward[];
}

interface City {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: District[];
}

type FormData = {
  name: string,
  phoneNumber: string,
  address: string,
  village: string,
  district: string,
  city: string,
  detailedAddress: string,
  note: string,
  callBeforeSend: boolean,
  receiveAtPost: boolean,
}

export default function AddressSelect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  //only 1 checkbox be checked
  const [checkbox1Checked, setCheckbox1Checked] = useState(true);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const toast = useToast();

  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>()

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset])

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(event.target.value);
    setSelectedVillage("");
  };

  const handleVillageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVillage(event.target.value);
    setValue('address', `${event.target.value}, ${selectedDistrict}, ${selectedCity}`);
  };

  const selectedCityData = cityData.find(
    (city) => city.name === selectedCity
  );
  const selectedDistrictData = selectedCityData?.districts.find(
    (district) => district.name === selectedDistrict
  );

  const handleCheckboxChange = (checkboxId: string) => {
    if (checkboxId === 'checkbox1') {
      setCheckbox1Checked(true);
      setCheckbox2Checked(false);
      setValue('callBeforeSend', false);
    } else if (checkboxId === 'checkbox2') {
      setCheckbox1Checked(false);
      setCheckbox2Checked(true);
      setValue('receiveAtPost', false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const { village, district, city, ...sendData } = data;
    let isSuccess: boolean = true;
    try {
      await addCustomer(sendData).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to save customer: ', err)
      toast({
        title: 'Có lỗi khi thêm khách hàng mới',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if (isSuccess) {
        toast({
          title: 'Thêm khách hàng mới thành công',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      <Button m={{ base: 2, md: 8 }} color="white"
        backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
        sx={{
          '@media (hover: hover)': {
            _hover: {
              backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
            }
          }
        }} onClick={onOpen}>
        Thêm người nhận
      </Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{ base: 'sm', md: 'md' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm người nhận</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={Boolean(errors.name)}>
              <FormLabel>Tên người nhận</FormLabel>
              <Input type='text' {...register('name', {
                required: 'Trường này không được bỏ trống',
              })} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel>Số điện thoại</FormLabel>
              <Input type='text' {...register('phoneNumber', {
                required: 'Trường này không được bỏ trống',
              })} />
            </FormControl>
            {/* Dropdown chọn thành phố */}
            <FormControl mt={4} isRequired isInvalid={Boolean(errors.city)}>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Select
                my={4}
                placeholder="Chọn tỉnh thành"
                // value={selectedCity}
                variant="filled"
                {...register('city', {
                  required: 'Trường này không được bỏ trống',
                })}
                onChange={handleCityChange}
              >
                <option value="" disabled hidden>
                  Chọn tỉnh thành
                </option>
                {cityData.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={Boolean(errors.district)}>
              <FormLabel>Quận/Huyện</FormLabel>
              <Select
                my={4}
                placeholder="Chọn quận"
                isDisabled={selectedCity == "" ? true : false}
                // value={selectedDistrict}
                {...register('district', {
                  required: 'Trường này không được bỏ trống',
                })}
                onChange={handleDistrictChange}
                variant="filled"
              >
                <option value="" disabled hidden>
                  Chọn quận
                </option>
                {selectedCityData?.districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.district && errors.district.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={Boolean(errors.village)}>
              <FormLabel>Phường/xã</FormLabel>
              <Select
                my={4}
                variant="filled"
                placeholder="Chọn phường"
                {...register('village', {
                  required: 'Trường này không được bỏ trống',
                })}
                onChange={handleVillageChange}
                isDisabled={selectedDistrict == "" ? true : false}
              >
                <option value="" disabled hidden>
                  Chọn phường
                </option>
                {selectedDistrictData?.wards.map((ward) => (
                  <option key={ward.code} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.village && errors.village.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={Boolean(errors.detailedAddress)}>
              <FormLabel>Địa chỉ chi tiết</FormLabel>
              <Input
                type="text"
                placeholder={"Số nhà, tên đường, địa chỉ chi tiết"}
                {...register('detailedAddress', {
                  required: 'Trường này không được bỏ trống',
                })}
              />
              <FormErrorMessage>
                {errors.detailedAddress && errors.detailedAddress.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Ghi chú</FormLabel>
              <Textarea placeholder={"Ghi chú"} {...register('note')} />
            </FormControl>

            <Checkbox id="checkbox1" colorScheme="orange" isChecked={checkbox1Checked} {...register('receiveAtPost')} onChange={() => handleCheckboxChange('checkbox1')}>
              Nhận tại bưu cục
            </Checkbox>
            <br />
            <Checkbox id="checkbox2" colorScheme="orange" isChecked={checkbox2Checked} {...register('callBeforeSend')} onChange={() => handleCheckboxChange('checkbox2')}>
              Liên hệ trước khi gửi
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Huỷ
            </Button>
            <Button                   color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={handleSubmit(onSubmit)}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}