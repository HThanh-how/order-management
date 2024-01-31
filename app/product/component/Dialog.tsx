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
} from "@chakra-ui/react";

import { useState } from "react";


export default function AddressSelect({ setProducts }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [formData, setFormData] = useState({
    name:"",
    photo:"",
    status: "AVAILABLE",
    price: 0,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    description:"",
  });

  const handleChange = (e: { target: { name: any; value: any; } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const getProducts = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v1/products`, 
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

  const onSubmit = async(event: any) => {
    event.preventDefault();
    
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/products`, 
                {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  },
                  body: JSON.stringify(formData),
                
                })
    .then(data => data.json())
    .then(processedData => console.log(processedData.data))
    .catch(error => console.log(error))

    onClose();
    getProducts();
}
  


  return (
    <>
      <Button m={{ base: 2, md: 8 }} colorScheme="orange" onClick={onOpen}>
        Thêm sản phẩm
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            <FormControl isRequired>
              <FormLabel>Tên hàng hóa</FormLabel>
              <Input type='text' name="name"  onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Ảnh</FormLabel>
              <Input type='text' name="photo"  onChange={handleChange} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Trọng lượng (g)</FormLabel>
              <Input type='text' name="weight"  onChange={handleChange}/>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Đơn giá (VNĐ)</FormLabel>
              <Input type='text' name="price"  onChange={handleChange}/>
            </FormControl>
            <HStack spacing='16px' mt={4}>
              <FormControl>
                <FormLabel>Dài (cm)</FormLabel>
                <Input type='text' name="length"  onChange={handleChange}/>
              </FormControl>
              <FormControl>
                <FormLabel>Rộng (cm)</FormLabel>
                <Input type='text' name="width"  onChange={handleChange}/>
              </FormControl>
              <FormControl>
                <FormLabel>Cao (cm)</FormLabel>
                <Input type='text' name="height"  onChange={handleChange}/>
              </FormControl>
            </HStack>
            <Textarea mt={4} 
              placeholder="Mô tả chi tiết"
              name="description"
              value={formData.description} 
              onChange={handleChange}
            />
            
            
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="orange" onClick={onSubmit}>
              Save
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}