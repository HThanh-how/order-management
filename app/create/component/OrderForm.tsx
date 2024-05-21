import {
  Box,
  Select,
  Input,
  Text,
  Checkbox,
  Flex,
  Divider,
  Button,
  Stack,
  VStack,
  HStack,
  Container,
  InputGroup,
  InputLeftElement,
  RadioGroup,
  Radio,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Menu,
  MenuList, MenuButton, MenuItem,
  Alert,
  AlertIcon,
  useToast,
  StackDivider,
  Link,  Popover, PopoverTrigger, PopoverContent,
  Skeleton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form"
import ProductDialog from "@/app/product/component/Dialog";
import ReceiverDialog from "../../table/component/Dialog";
import { useGetProductsQuery, useGetCustomersQuery, useGetStoresQuery, useAddOrderMutation, useAddOrderForEmployeeMutation } from "@/app/_lib/features/api/apiSlice"
import { useAppSelector } from "@/app/_lib/hooks";
import { Product, Customer, Store } from "@/app/type";
import { cityData } from "@/component/HeroSection/CityData";
import { calculateShippingCost } from "@/pages/api/cost";
import { current } from "@reduxjs/toolkit";


type OrderItem = {
  quantity: number,
  price: number,
  product: Product,
}

type FormData = {
  code: string,
  height: number,
  width: number,
  length: number,
  items: OrderItem[],
  store: Store,
  receiver: Customer,
  price: {
    collectionCharge: number,
    itemsPrice: number,
    shippingFee: number,
  },
  isDocument: boolean,
  isBulky: boolean,
  isFragile: boolean,
  isValuable: boolean,
  delivery: {
    payer: string,
    hasLostInsurance: boolean,
    isCollected: boolean,
    deliveryMethod: string,
    luuKho: string,
    layHang: string,
    giaoHang: string,
    shippingFee: number,
    collectionFee: number,
    isDraft: boolean,
    note: string,
  }
}


export default function OrderForm() {
  const [items, setItems] = useState([0]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [quantityItem, setQuantityItem] = useState<number[]>([]);
  const [priceItem, setPriceItem] = useState<number[]>([]);
  const [totalPriceItems, setTotalPriceItems] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  const [optionValuable, setOptionValuable] = useState<number>(0);
  const [optionBulky, setOptionBulky] = useState<number>(0);

  //only 1 checkbox of receiver box be checked
  const [checkbox1Checked, setCheckbox1Checked] = useState(true);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);

  const [receiverValue, setReceiverValue] = useState<string>("");
  const [receiverSuggestions, setReceiverSuggestions] = useState<Customer[]>([]);

  const [addOrder, { error: errorU }] = useAddOrderMutation();
  const [addOrderForEmployee, { error: errorE }] = useAddOrderForEmployeeMutation();
  const toast = useToast()
  const router = useRouter();
  const role = useAppSelector((state) => state.role.value);


  const {
    data: products,
    isLoading: isLoadingP,
    isSuccess: isSuccessP,
    isError: isErrorP,
    error: errorP,
  } = useGetProductsQuery()

  const {
    data: receivers,
    isLoading: isLoadingR,
    isSuccess: isSuccessR,
    isError: isErrorR,
    error: errorR,
  } = useGetCustomersQuery(1)

  const {
    data: stores,
    isLoading: isLoadingS,
    isSuccess: isSuccessS,
    isError: isErrorS,
    error: errorS,
  } = useGetStoresQuery()

  const getProducts = useMemo(() => {
    if (isSuccessP) return products.data
  }, [products])

  const getReceivers = useMemo(() => {
    if (isSuccessR) return receivers.data
  }, [receivers])

  const getStores = useMemo(() => {
    if (isSuccessS) return stores.data
  }, [stores])

  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>()


  useEffect(() => {
    setTotalPriceItems(priceItem.reduce((acc, currentValue) => acc + currentValue, 0))
    let tmp: number = 0;
    for (let i = 0; i < selectedItems.length; i++) {
      tmp += selectedItems[i].product.weight * quantityItem[i];
    }
    setTotalWeight(tmp);
  }, [priceItem])


  const onSubmit = async (data: FormData) => {
    let isSuccess: boolean = true;
    //handle option fee
    let result: any;
    try {
      data.items.map((item, index) => {
        item.price = priceItem[index];
        item.quantity = quantityItem[index];
      })
      data.price = {
        itemsPrice: 0,
        shippingFee: 0,
        collectionCharge: 0,
      };

      data.price.itemsPrice = totalPriceItems;
      data.price.shippingFee = shippingFee + optionValuable + optionBulky;
      data.price.collectionCharge = totalPriceItems + data.price.shippingFee;
      data.store = { ...selectedStore };
      if (role === "ROLE_USER") {
        result = await addOrder(data).unwrap();
      }
      else {
        result = await addOrderForEmployee(data).unwrap();
      }
    } catch (err: any) {
      isSuccess = false;
      console.error('Failed to create order: ', err)
      if (err?.data?.message === 'Access is denied')
        toast({
          title: 'Bạn không có quyền tạo đơn hàng mới',
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      else
        toast({
          title: 'Có lỗi khi tạo đơn hàng mới',
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
    } finally {
      if (isSuccess) {
        toast({
          title: 'Tạo đơn hàng thành công.',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setTimeout(() => router.push(`/order-details?id=${result?.data?.id}`), 1000);
      }
    }

  }

  const getProvinceCode = (cityName: string) => {
    const city = cityData.find(city => city.name === cityName);
    return city ? city.code : null;
  };

  // Function to get district code
  const getDistrictCode = (cityName: string, districtName: string) => {
    const city = cityData.find(city => city.name === cityName);
    if (city) {
      const district = city.districts.find(district => district.name === districtName);
      return district ? district.code : null;
    }
    return null;
  };

  const handleProductInputChange = async (value: string) => {
    if (getProducts && value.length > 1) { // Typically, we look for suggestions after 2 characters have been typed.
      const results = getProducts.filter((product: any) => product.name.toLowerCase().includes(value.toLowerCase()));
      setProductSuggestions(results);
    } else {
      setProductSuggestions([]);
    }
  };

  const handleReceiverInputChange = async (value: string) => {
    if (getReceivers && value.length > 1) { // Typically, we look for suggestions after 2 characters have been typed.
      const results = getReceivers.filter((receiver: any) => receiver.phoneNumber.includes(value));
      setReceiverSuggestions(results);
    } else {
      setReceiverSuggestions([]);
    }
  };

  const handleStoreChange = (value: string) => {
    if (value === "_store_add_") {
      router.push('/store');
      return;
    }
    const tmp = getStores.find((store: any) => store.name === value)
    setSelectedStore(tmp);
    //setValue('store', tmp);
  }

  const handleCheckboxChange = (checkboxId: string) => {
    if (checkboxId === 'checkbox1') {
      setCheckbox1Checked(true);
      setCheckbox2Checked(false);
    } else if (checkboxId === 'checkbox2') {
      setCheckbox1Checked(false);
      setCheckbox2Checked(true);
    }
  };

  const updatePriceItem = (index: any, newValue: number) => {
    // Create a copy of the array
    const newArray = [...priceItem];
    // Update the value at the specified index
    newArray[index] = newValue;
    // Set the state with the updated array
    setPriceItem(newArray);
  };

  const updateQuantityItem = (index: any, newValue: number) => {
    // Create a copy of the array
    const newArray = [...quantityItem];
    // Update the value at the specified index
    newArray[index] = newValue;
    // Set the state with the updated array
    setQuantityItem(newArray);
  };

  const addItem = () => {
    setItems([...items, items.length]);
  };

  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
    setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));
    setQuantityItem(quantityItem.filter((_, index) => index !== indexToRemove));
    setPriceItem(priceItem.filter((_, index) => index !== indexToRemove));
  };

  const renderProductSuggestions = () => productSuggestions.map((suggestion): any => (
    <option
      key={suggestion.id}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setSelectedItems([...selectedItems, {
          product: suggestion,
          price: 0,
          quantity: 0,
        }]);
        setPriceItem([...priceItem, 0]);
        setQuantityItem([...quantityItem, 0]);
        setValue('items', [...selectedItems, {
          quantity: 0,
          price: 0,
          product: suggestion,
        }]);

        setProductSuggestions([]);
      }}
    >
      {suggestion.name}  ({suggestion.price} VNĐ)
    </option>
  ));

  const renderReceiverSuggestions = () => receiverSuggestions.slice(0, 5).map((suggestion) => (
    <Button
      key={suggestion.id}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setReceiverValue(suggestion.phoneNumber);
        setSelectedReceiver(suggestion);
        setValue('receiver', suggestion);
        setReceiverSuggestions([]);
      }}
      width={"full"}
      m={1}
    >
      {suggestion.name}  {suggestion.phoneNumber}
    </Button>
  ));

  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Box w={{ base: "80wv", md: "50%" }}>
        <Box p={4} bg="gray.50">
          <Text color="orange.500" fontWeight={"bold"} fontSize="20px"> Người gửi: </Text>
          {isErrorS ? (
            <Flex
              alignItems="center"
              justify="center"
              direction={{ base: "column", md: "row" }}
              m={4}
            >
              <Alert w='50%' status='error'>
                <AlertIcon />
                Can not fetch data from server
              </Alert>
            </Flex>
          )
            : isLoadingS ? (
              <Flex
                alignItems="center"
                justify="center"
                direction={{ base: "column", md: "row" }}
                my={2}
              >
                <Skeleton rounded="md" height="40px" width="100%" />
              </Flex>
            )
              : (
                <FormControl isRequired isInvalid={Boolean(errors.store)}>
                  <Select
                    mt={4}
                    placeholder="Chọn cửa hàng/Nơi gửi hàng"
                    variant="filled"
                    {...register('store', {
                      required: 'Người gửi không được bỏ trống',
                    })}
                    onChange={(e) => handleStoreChange(e.target.value)}

                  >
                    {getStores.map((store: any) => (
                      <option key={store.id} value={store.name}>
                        {store.name}
                      </option>
                    ))}
                    <option value="_store_add_">Nơi gửi mới</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.store && errors.store.message}
                  </FormErrorMessage>
                </FormControl>
              )}
          {selectedStore && (
            <>
              <Input mt={4} value={selectedStore?.address} placeholder={"Địa chỉ"} readOnly />
              <Input mt={4} value={selectedStore?.detailedAddress} placeholder={"Số nhà, tên đường, địa chỉ chi tiết"} readOnly />
            </>

          )}

        </Box>
        <Box bg="gray.50" p={4} mt={4}>
          <Text color="orange.500" fontWeight={"bold"} fontSize="20px">Thông tin hàng hoá</Text>
          {items.map((item, index) => (
            <Box key={index}>
              <Divider my={2} orientation="horizontal" color={"gray.800"} />
              <Flex mt={4}>
                {/* Dropdown */}
                <Controller
                  name="items"
                  control={control}
                  rules={{ required: 'Trường này không được bỏ trống' }}
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl isInvalid={Boolean(errors.items)}>
                      <div>
                        <Input {...field}
                          placeholder="Tên sản phẩm"
                          value={selectedItems[index]?.product.name}
                          onChange={(e) => {
                            handleProductInputChange(e.target.value);
                            field.onChange(e.target.value); // important to update the form state
                          }}
                        />
                        {productSuggestions.length > 0 && index === selectedItems.length && (
                          <VStack
                            alignItems={'flex-start'}
                            divider={<StackDivider borderColor='gray.200' />}
                            spacing={2}
                          >
                            {renderProductSuggestions()}
                          </VStack>
                        )}
                      </div>
                      <FormErrorMessage>
                        Tên sản phẩm không được bỏ trống
                      </FormErrorMessage>

                    </FormControl>
                  )}
                />
                <Button
                  ml={2}
                  onClick={() => removeItem(index)}
                  colorScheme="red"
                  variant="outline"
                  alignItems={"center"}
                >
                  X
                </Button>
              </Flex>
              <Flex>

                <Input
                  mt={4}
                  w={{ base: '50%', md: '25%' }}
                  placeholder={"Số lượng "}
                  type="number"
                  onChange={(e) => {
                    // setQuantityItem([...quantityItem.slice(0, quantityItem.length-1), Number(e.target.value)]);
                    // setPriceItem([...priceItem.slice(0, priceItem.length-1), selectedItems[index]?.product.price * Number(e.target.value)]);
                    updateQuantityItem(index, Number(e.target.value));
                    updatePriceItem(index, selectedItems[index]?.product.price * Number(e.target.value))
                  }}
                />
                {/* <FormControl isRequired isInvalid={Boolean(errors.depth)}>
                <Input m={4} value={selectedProduct[index]?.weight} placeholder={"Khối lượng"} {...register('depth', {
                  required: 'This is required'
                })} />
                <FormErrorMessage>
                  {errors.depth && errors.depth.message}
                </FormErrorMessage>
              </FormControl> */}
                <InputGroup m={4}>
                  <InputLeftElement
                    pointerEvents="none"
                    color="teal.400"
                    fontSize="1.2em"
                  >$</InputLeftElement>
                  <Input placeholder="Tiền hàng" value={priceItem[index] ? String(priceItem[index]) : ""} readOnly />
                </InputGroup>
              </Flex>
            </Box>
          ))}
          {role === 'ROLE_USER' && (
            <Flex>
              <Button
                onClick={addItem}
                borderColor={"#ff0348"}
                backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                backgroundClip="text"
                color="transparent"
                sx={{
                  transition: "all 0.3s",
                  '@media (hover: hover)': {
                    _hover: {
                      backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                      textColor: "white",

                    }
                  }
                }}
                variant="outline"
                alignSelf={"center"}
                alignItems={"center"}
              >
                Thêm hàng hoá
              </Button>
              <ProductDialog />
            </Flex>
          )}

          {role === 'ROLE_EMPLOYEE' && (
            <Button
              onClick={addItem}
              borderColor={"#ff0348"}
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              backgroundClip="text"
              color="transparent"
              sx={{
                transition: "all 0.3s",
                '@media (hover: hover)': {
                  _hover: {
                    backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                    textColor: "white",

                  }
                }
              }}
              variant="outline"
              alignSelf={"center"}
              alignItems={"center"}
            >
              Thêm hàng hoá
            </Button>
          )}

          <Divider my={2} orientation="horizontal" color={"gray.800"} />
          <Text fontWeight={"500"} color="orange.500">Kích thước</Text>
          <Stack direction={{ base: 'column', md: 'row' }}>
            <Input mt={{ base: 2, md: 4 }} placeholder={"Dài - cm"} {...register('length')} />
            <Input mt={{ base: 2, md: 4 }} placeholder={"Rộng - cm"} {...register('width')} />
            <Input mt={{ base: 2, md: 4 }} placeholder={" Cao - cm"} {...register('height')} />
          </Stack>
          <HStack mt={{ base: 2, md: 4 }} justifyContent={'space-between'} >
            <Checkbox colorScheme="red" {...register('isDocument')}>
              Tài liệu/ Văn kiện
            </Checkbox>
            <Checkbox colorScheme="orange" {...register('isValuable')} value="true" onChange={(e) => {
              if (e.target.checked) setOptionValuable(Math.ceil(0.03 * totalPriceItems));
              else setOptionValuable(0);
            }}>
              Giá trị cao
            </Checkbox>
            <Checkbox colorScheme="red" {...register('isFragile')}>
              Dễ vỡ
            </Checkbox>
            <Checkbox colorScheme="orange" {...register('isBulky')} value="true" onChange={(e) => {
              if (e.target.checked) setOptionBulky(20000);
              else setOptionBulky(0);
            }}>
              Quá khổ
            </Checkbox>
          </HStack>
          <Box my={4}>
            <Text color="orange.500" fontWeight={"bold"} fontSize="18px">Tổng tiền hàng: {totalPriceItems} VNĐ</Text><br />
            <Text color="orange.500" fontWeight={"bold"} fontSize="18px">Tổng khối lượng: {totalWeight} g</Text>
          </Box>
        </Box>
      </Box>
      <Box w={{ base: "80wv", lg: "50%" }}>
        <Box p={4} bg="gray.50">
          <Text color="orange.500" fontWeight={"bold"} fontSize="20px">Người nhận</Text>
          <FormControl isRequired isInvalid={Boolean(errors.receiver)}>
            <div>
              <Popover isOpen={receiverSuggestions.length > 0} placement="bottom-start">
                <PopoverTrigger>
                  <Input
                    mt={4}
                    placeholder={"Số điện thoại"}
                    value={receiverValue}
                    {...register('receiver', {
                      required: 'Người nhận không được bỏ trống',
                      pattern: {
                        value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    onChange={(e) => {
                      handleReceiverInputChange(e.target.value);
                      setReceiverValue(e.target.value)
                    }}
                  />
                </PopoverTrigger>
                {errors.receiver && <Text color="red.500" mb={2} mt={-2}>{errors.receiver.message}</Text>}
                <PopoverContent pr={2}>
                  <Box>
                    {renderReceiverSuggestions()}
                  </Box>
                </PopoverContent>
              </Popover>
            </div>
            <FormErrorMessage>
              {errors.receiver && errors.receiver.message}
            </FormErrorMessage>
          </FormControl>
          {selectedReceiver && (
            <>
              <Input mt={4} value={selectedReceiver?.name} placeholder={"Họ và tên"} readOnly />
              <Input mt={4} value={selectedReceiver?.address} placeholder={"Địa chỉ"} readOnly />
              <Input mt={4} value={selectedReceiver?.detailedAddress} placeholder={"Số nhà, tên đường, địa chỉ chi tiết"} readOnly />
              <Checkbox
                id="checkbox1"
                m={4}
                colorScheme="red"
                isChecked={checkbox1Checked}
                {...register('receiver.receiveAtPost')}
                onChange={() => handleCheckboxChange('checkbox1')}
              >
                Nhận tại bưu cục
              </Checkbox>
              <Checkbox
                id="checkbox2"
                m={4}
                colorScheme="red"
                isChecked={checkbox2Checked}
                {...register('receiver.callBeforeSend')}
                onChange={() => handleCheckboxChange('checkbox2')}
              >
                Liên hệ trước khi gửi
              </Checkbox>
            </>
          )}
          {role === 'ROLE_USER' && (
            <ReceiverDialog />
          )}
        </Box>

        <Box mt={4} bg="gray.50" p={4}>
          <Text color="orange.500" fontWeight={"bold"} fontSize="20px">Vận chuyển</Text>
          <RadioGroup defaultValue="RECEIVER" m={4}>
            <Stack spacing={10} direction="row">
              <Text fontWeight={"500"}>Người trả cước</Text>
              <Radio colorScheme="red" {...register('delivery.payer')} value="SENDER">
                Người gửi
              </Radio>
              <Radio colorScheme="red" {...register('delivery.payer')} value="RECEIVER">
                Người nhận
              </Radio>
            </Stack>
          </RadioGroup>

          <Stack spacing={6} direction="row" m={4}>
            <FormControl isRequired isInvalid={Boolean(errors.delivery)}>
              <FormLabel>Loại vận chuyển</FormLabel>
              <Select mt={2}
                variant="filled"
                {...register('delivery.deliveryMethod', {
                  required: 'This is required',
                })}
              >
                <option value="MOT_TIENG">Hoả tốc</option>
                <option value="BA_GIO">BA GIỜ</option>
                <option value="MOT_NGAY">MỘT NGÀY</option>
              </Select>
              <FormErrorMessage>
                {errors.delivery && errors.delivery.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.delivery)}>
              <FormLabel>Lấy hàng</FormLabel>
              <Select mt={{ base: 8, md: 2 }}
                variant="filled"
                {...register('delivery.layHang', {
                  required: 'This is required',
                })}
              >
                <option value="CA_NGAY">MỘT NGÀY</option>
                <option value="BA_NGAY">BA NGÀY</option>
              </Select>
              <FormErrorMessage>
                {errors.delivery && errors.delivery.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <Stack mt={4} spacing={6} direction="row" m={4}>
            <FormControl isRequired isInvalid={Boolean(errors.delivery)}>
              <FormLabel>Lưu kho</FormLabel>
              <Select mt={2}
                variant="filled"
                {...register('delivery.luuKho', {
                  required: 'This is required',
                })}
              >
                <option value="CA_NGAY">MỘT NGÀY</option>
                <option value="BA_NGAY">BA NGÀY</option>
              </Select>
              <FormErrorMessage>
                {errors.delivery && errors.delivery.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.delivery)}>
              <FormLabel>Giao hàng</FormLabel>
              <Select mt={2}
                variant="filled"
                {...register('delivery.giaoHang', {
                  required: 'This is required',
                })}
              >
                <option value="CA_NGAY">MỘT NGÀY</option>
                <option value="BA_NGAY">BA NGÀY</option>
              </Select>
              <FormErrorMessage>
                {errors.delivery && errors.delivery.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>
          <Checkbox m={4} fontWeight={"500"} colorScheme="red"{...register('delivery.hasLostInsurance')}>Bảo hiểm thất lạc</Checkbox>

          <Text mx={4} my={2} fontWeight={"500"}>Ghi chú </Text>
          <Textarea ml={4} mb={4} placeholder='Ghi chú' w={"95%"} {...register('delivery.note')} />
          <Flex m={4} justifyContent={'space-between'}>
            <Text color="orange.500" fontWeight={"bold"} fontSize="18px">Phí ship: {shippingFee} {optionValuable + optionBulky !== 0 ? `+ ${optionValuable + optionBulky} (phí tuỳ chọn)` : ""} VNĐ</Text>

            {selectedReceiver && selectedStore && (
              <Link color='orange.500' onClick={() => {
                const sendLocation = selectedStore?.address?.split(", ")
                const receiveLocation = selectedReceiver?.address?.split(", ")
                setShippingFee(Math.ceil(calculateShippingCost(
                  getProvinceCode(sendLocation[2]),
                  getDistrictCode(sendLocation[2], sendLocation[1]),
                  getProvinceCode(receiveLocation[2]),
                  getDistrictCode(receiveLocation[2], receiveLocation[1]),
                  totalWeight
                )))
              }
              }>Kiểm tra phí ship</Link>
            )}

          </Flex>
          <Flex m={4}>
            <Text color="orange.500" fontWeight={"bold"} fontSize="18px">Thành tiền: {totalPriceItems + shippingFee + optionValuable + optionBulky} VNĐ</Text>

          </Flex>
          <Flex justifyContent={"right"} m={4}>
            {/* <Button colorScheme='gray' m={2} >Lưu nháp</Button> */}
            {isSubmitting ? (
              <Button
                isLoading
                loadingText='Đang tạo'
                colorScheme='orange'
                variant='outline'
              >
                Tạo
              </Button>
            )
              : (
                <Button type="submit" color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} m={2} onClick={handleSubmit(onSubmit)}>Tạo</Button>
              )}
          </Flex>
        </Box>

      </Box>
    </Stack>
  );
}
