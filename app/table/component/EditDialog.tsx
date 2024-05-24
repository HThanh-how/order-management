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
  HStack,
  useToast,
  Image,
  Center,
} from "@chakra-ui/react";

import { useEffect, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form"
import { useEditCustomerMutation } from "@/app/_lib/features/api/apiSlice"
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";
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
  receivedPlace: string,
  deliveryTimeFrame: string,
  callBeforeSend: boolean,
  receiveAtPost: boolean,
}

export default function EditDialog({ isOpen, onClose, selectedCustomer }: any) {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: selectedCustomer?.name || "",
      phoneNumber: selectedCustomer?.phoneNumber || "",
      address: selectedCustomer?.address || "",
      detailedAddress: selectedCustomer?.detailedAddress || "",
      note: selectedCustomer?.note || "",
      receivedPlace: "",
      deliveryTimeFrame: "",
      callBeforeSend: selectedCustomer?.callBeforeSend,
      receiveAtPost: selectedCustomer?.receiveAtPost,
    }
  })

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [editCustomer, { isLoading }] = useEditCustomerMutation();

  const toast = useToast();


  useEffect(() => {
    reset(selectedCustomer);
  }, [selectedCustomer])

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

  const onSubmit = async (data: FormData) => {
    const { village, district, city, ...sendData } = data;
    console.log(sendData);
    let isSuccess: boolean = true;
    try {
      await editCustomer(sendData).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to edit customer: ', err)
      toast({
        title: 'Có lỗi khi sửa thông tin người nhận',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if (isSuccess) {
        toast({
          title: 'Cập nhật thông tin người nhận thành công',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        // setTimeout(() => window.location.reload(), 1000);
      }
    }
  }

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{ base: 'sm', md: 'md' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật thông tin người nhận</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired isInvalid={Boolean(errors?.name?.type === 'required' || errors?.name?.type === 'maxLength')}>
            <FormLabel>Tên người nhận</FormLabel>
            <Input type='text' id="name" {...register('name', {
              required: 'Trường này không được bỏ trống',
              maxLength: 30,
            })} />
            <FormErrorMessage>
              {errors.name?.type === 'required' && errors.name?.message || errors.name?.type === 'maxLength' && "Không vượt quá 30 kí tự"}
            </FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.name)} mt={4}>
            <FormLabel>Số điện thoại </FormLabel>
            <Input type='text' {...register('phoneNumber', {
              required: 'Trường này không được bỏ trống',
              pattern: {
                value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                message: 'Số điện thoại không hợp lệ'
              }
            })} />
            {errors.phoneNumber && <Text color="red.500" mb={2} mt={2}>{errors.phoneNumber.message}</Text>}
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
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
          <FormControl mt={4} isRequired isInvalid={Boolean(errors.detailedAddress?.type === 'required' || errors.detailedAddress?.type === 'maxLength')}>
              <FormLabel>Địa chỉ chi tiết</FormLabel>
              <Input
                maxLength={255}
                type="text"
                placeholder={"Số nhà, tên đường, địa chỉ chi tiết"}
                {...register('detailedAddress', {
                  required: 'Trường này không được bỏ trống',
                  maxLength: 30,
                })}
              />
              <FormErrorMessage>
                {errors.detailedAddress?.type === 'required' && errors.detailedAddress?.message || errors.detailedAddress?.type === 'maxLength' && "Không vượt quá 30 kí tự"}
              </FormErrorMessage>
            </FormControl>
          <FormControl mt={4}>
            <FormLabel>Ghi chú</FormLabel>
            <Textarea placeholder={"Ghi chú"} {...register('note')} />
          </FormControl>

        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Huỷ
          </Button>
          {isSubmitting ? (
            <Button
              isLoading
              loadingText='Đang lưu'
              color="white"
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              sx={{
                '@media (hover: hover)': {
                  _hover: {
                    backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                  }
                }
              }}
            >
              Lưu
            </Button>
          ) : (
            <Button color="white"
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
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}