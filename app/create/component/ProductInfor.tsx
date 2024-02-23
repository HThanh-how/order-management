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
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form"
import Dialog from "@/app/product/component/Dialog";

type Product = {
  id: number;
  name: string;
  photo: string;
  status: string;
  price: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
};

type Store = {
  id: number;
  name: string;
  status: string;
  tags: string[];
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  description: string;
};

type Staff = {
  id: number;
  name: string;
  status: string;
  permission: string[];
  phoneNumber: string;
};

type FormData = {
  code: string,
  height: number,
  width: number,
  depth: number,
  items: Product[],
  store: Store,
  receiver: Staff,
  price: {
      collectionCharge: number,
      itemsPrice: number,
      shippingFee: number,
  },
  isDocument: boolean,
  isBulky: boolean,
  isFragile: boolean,
  isValuable: boolean,
  delivery: any
}

export default function AddressSelect() {
  const [items, setItems] = useState([0]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const firstUpdate = useRef(true);
  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>( {defaultValues: {
    items: products,
  }})

  const getProducts = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/products`, 
                {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  }
                
                })
    .then(data => data.json())
    .then(processedData => setProducts(processedData.data))
    .catch(error => console.log(error))

  }

  const getStores = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/stores`, 
                {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  }
                
                })
    .then(data => data.json())
    .then(processedData => setStores(processedData.data))
    .catch(error => console.log(error))

  }

  const getReceivers = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/receivers`, 
                {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  }
                
                })
    .then(data => data.json())
    .then(processedData => setReceivers(processedData.data))
    .catch(error => console.log(error))

  }

  const onSubmit = async(data: FormData) => {
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/order`, 
                {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  },
                  body: JSON.stringify(data),
                
                })
    .then(data => data.json())
    .then(processedData => console.log(processedData.data))
    .catch(error => console.log(error))

}

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      getProducts();
      return;
    }
  }, [products])

  const addItem = () => {
    setItems([...items, items.length]);
  };

  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const { fields } = useFieldArray({
    name: 'items',
    control
  })

  return (
    <Box>
      <Box bg="gray.50" p={4}>
        <Text fontWeight={"800"}>Thông tin hàng hoá</Text>
        {items.map((item, index) => (
          <Box key={index}>
            <Divider my={2} orientation="horizontal" color={"gray.800"} />
            <Flex mt={4}>
              {/* Dropdown */}
              <FormControl isRequired isInvalid={Boolean(errors.items)}>
                <Select placeholder="Tên sản phẩm" variant="filled" {...register('items', {
                  required: 'This is required',
                })}>
                {fields?.map((product: any, index) => (
                  <option key={product.id} value={product}>
                    {product.name}
                  </option>
                ))}
                </Select>
                <FormErrorMessage>
                  {errors.items && errors.items.message}
                </FormErrorMessage>
              </FormControl>
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
              
              <Input mt={4} placeholder={"Số lượng "} />
              <FormControl isRequired isInvalid={Boolean(errors.depth)}>
                <Input m={4} placeholder={"Khối lượng"} {...register('depth', {
                  required: 'This is required'
                })} />
                <FormErrorMessage>
                  {errors.depth && errors.depth.message}
                </FormErrorMessage>
              </FormControl>
              <InputGroup m={4}>
                <InputLeftElement
                  pointerEvents="none"
                  color="teal.400"
                  fontSize="1.2em"
                >$</InputLeftElement>
                <Input  placeholder="Tiền thu hộ" {...register('price.collectionCharge', {
                  required: 'This is required'
                })} />
              </InputGroup>
            </Flex>
          </Box>
        ))}
        <Flex>
          
          <Button
            onClick={addItem}
            colorScheme="teal"
            variant="outline"
            alignSelf={"center"}
            alignItems={"center"}
          >
            Thêm hàng hoá
          </Button>
          {/* <Dialog setProducts={setProducts}/> */}
        </Flex>

        <Divider my={2} orientation="horizontal" color={"gray.800"} />
        <Text fontWeight={"500"}>Kích thước</Text>
        <Flex>
          <Input mt={4} placeholder={"Dài - cm"}/>
          <Input m={4} placeholder={"Rộng - cm"} {...register('width')}/>
          <Input mt={4} placeholder={" Cao - cm"} {...register('height')}/>
        </Flex>
        <HStack columnGap={2}>
          <Box>
            <Checkbox m={2} {...register('isDocument')}>Tài liệu/ Văn kiện </Checkbox>
            <Checkbox m={2} {...register('isValuable')}>Giá trị cao</Checkbox>
          </Box>
          <Box>
            <Checkbox m={2} {...register('isFragile')}>Dễ vỡ</Checkbox>
            <Checkbox m={2} {...register('isBulky')}>Quá khổ</Checkbox>
          </Box>
        </HStack>
      </Box>
      <Box mt={4} bg="gray.50" p={4}>
        <Text fontWeight={"800"}>Thành tiền</Text>
        <Checkbox m={4}>Thu hộ bằng tiền hàng</Checkbox>
        <Flex p={4}>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="teal.400"
              fontSize="1.2em"
            >$</InputLeftElement>
            <Input placeholder="Tiền thu hộ" />
          </InputGroup>
          
        </Flex>
        <RadioGroup defaultValue="1" m={4}>
          <Stack spacing={5} direction="row">
          <Text fontWeight={"500"}>Người trả cước: </Text>
            <Radio colorScheme="teal" value="1">
              Người gửi
            </Radio>
            <Radio colorScheme="teal" value="2">
              Người nhận
            </Radio>
          </Stack>
        </RadioGroup>
        <Text fontWeight={"500"}>Ghi chú: </Text>
        <Textarea m={4}placeholder='Ghi chú' w={"95%"}/>
        <Flex justifyContent={"right"} m={4}>
        <Button colorScheme='gray' m={2} >Lưu nháp</Button>
        <Button colorScheme="teal" m={2} onClick={handleSubmit(onSubmit)}>Gửi</Button>
        </Flex>
      </Box>
 
    </Box>
  );
}
