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
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAddCustomerMutation, useAddCustomerForEmployeeMutation } from "@/app/_lib/features/api/apiSlice";
import { cityData } from "@/component/HeroSection/CityData";
import { useAppSelector } from "@/app/_lib/hooks";

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
  name: string;
  phoneNumber: string;
  address: string;
  village: string;
  district: string;
  city: string;
  detailedAddress: string;
  note: string;
  callBeforeSend: boolean;
  receiveAtPost: boolean;
};

export default function AddressSelect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const toast = useToast();
  const role: any = useAppSelector((state: any) => state.role.value);
  const [addCustomer, { isLoading: isLoadingU }] = useAddCustomerMutation();
  const [addCustomerForEmployee, { isLoading: isLoadingE }] = useAddCustomerForEmployeeMutation();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

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
    setValue("address", `${event.target.value}, ${selectedDistrict}, ${selectedCity}`);
  };

  const selectedCityData = cityData.find((city) => city.name === selectedCity);
  const selectedDistrictData = selectedCityData?.districts.find((district) => district.name === selectedDistrict);

  const onSubmit = async (data: FormData) => {
    const { village, district, city, ...sendData } = data;
    let isSuccess: boolean = true;
    try {
      if(role === "ROLE_USER")
        await addCustomer(sendData).unwrap();
      else await addCustomerForEmployee(sendData).unwrap();
      onClose();
    } catch (err: any) {
      isSuccess = false;
      console.error("Failed to save customer: ", err);
      if (err?.data?.message === "Access is denied")
        toast({
          title: "Bạn không có quyền thêm khách hàng mới",
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      else
        toast({
          title: "Có lỗi khi thêm khách hàng mới",
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    } finally {
      if (isSuccess) {
        toast({
          title: "Thêm khách hàng mới thành công",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Button
        m={{ base: 2, xl: 8 }}
        color="white"
        backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
        sx={{
          "@media (hover: hover)": {
            _hover: {
              backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
            },
          },
        }}
        onClick={onOpen}
      >
        Thêm người nhận
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered size={{ base: "sm", md: "2xl" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm người nhận</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem>
                <FormControl isRequired isInvalid={Boolean(errors?.name?.type === "required" || errors?.name?.type === "maxLength")}>
                  <FormLabel>Tên người nhận</FormLabel>
                  <Input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Trường này không được bỏ trống",
                      maxLength: 30,
                    })}
                  />
                  <FormErrorMessage>
                    {(errors.name?.type === "required" && errors.name?.message) ||
                      (errors.name?.type === "maxLength" && "Không vượt quá 30 kí tự")}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isRequired isInvalid={Boolean(errors.phoneNumber)}>
                  <FormLabel>Số điện thoại</FormLabel>
                  <Input
                    type="text"
                    {...register("phoneNumber", {
                      required: "Trường này không được bỏ trống",
                      pattern: {
                        value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isRequired isInvalid={Boolean(errors.detailedAddress?.type === "required" || errors.detailedAddress?.type === "maxLength")}>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <Input
                    maxLength={255}
                    type="text"
                    placeholder={"Số nhà, tên đường, địa chỉ chi tiết"}
                    {...register("detailedAddress", {
                      required: "Trường này không được bỏ trống",
                      maxLength: 30,
                    })}
                  />
                  <FormErrorMessage>
                    {(errors.detailedAddress?.type === "required" && errors.detailedAddress?.message) ||
                      (errors.detailedAddress?.type === "maxLength" && "Không vượt quá 30 kí tự")}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea placeholder={"Ghi chú"} {...register("note")} maxLength={255} />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired isInvalid={Boolean(errors.city)}>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select
                    mb={4}
                    placeholder="Chọn tỉnh thành"
                    variant="filled"
                    {...register("city", {
                      required: "Trường này không được bỏ trống",
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
                  <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isRequired isInvalid={Boolean(errors.district)}>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    mb={4}
                    placeholder="Chọn quận"
                    isDisabled={selectedCity == "" ? true : false}
                    variant="filled"
                    {...register("district", {
                      required: "Trường này không được bỏ trống",
                    })}
                    onChange={handleDistrictChange}
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
                  <FormErrorMessage>{errors.district && errors.district.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isRequired isInvalid={Boolean(errors.village)}>
                  <FormLabel>Phường/xã</FormLabel>
                  <Select
                    mb={4}
                    variant="filled"
                    placeholder="Chọn phường"
                    {...register("village", {
                      required: "Trường này không được bỏ trống",
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
                  <FormErrorMessage>{errors.village && errors.village.message}</FormErrorMessage>
                </FormControl>

                <Box mt={{base:4, md: 12}}>
                  <Checkbox mt={2} id="checkbox1" colorScheme="red" {...register("receiveAtPost")}>
                    Nhận tại bưu cục
                  </Checkbox>
                  <br />
                  <Checkbox mt={2} id="checkbox2" colorScheme="red" {...register("callBeforeSend")}>
                    Liên hệ trước khi gửi
                  </Checkbox>
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Huỷ
            </Button>
            {isSubmitting ? (
              <Button
                isLoading
                loadingText="Đang lưu"
                color="white"
                backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                sx={{
                  "@media (hover: hover)": {
                    _hover: {
                      backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                    },
                  },
                }}
              >
                Lưu
              </Button>
            ) : (
              <Button
                color="white"
                backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                sx={{
                  "@media (hover: hover)": {
                    _hover: {
                      backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                    },
                  },
                }}
                onClick={handleSubmit(onSubmit)}
              >
                Lưu
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
