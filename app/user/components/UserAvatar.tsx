import { useState, useEffect } from 'react'
import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Box,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'
import getFromLocalStorage from "../../_lib/getFromLocalStorage";
import { useForm } from "react-hook-form";
import { useEditUserInfoMutation } from '@/app/_lib/features/api/apiSlice';

interface UserAvatarProps {
  user: any;
}

type FormData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isValid },
  } = useForm<FormData>({defaultValues: {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: user.dateOfBirth || "",
  }})
  const [img, setImg] = useState<any>(null);
  const [editUserInfo, {isLoading}] = useEditUserInfoMutation();

  useEffect(() => {
    if(isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset])

  const validateFiles = (e: any) => {
    if(e.target.files[0]) {
      const value = e.target.files[0];
      const fsMb = value.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return 'File không vượt quá 10MB'
      }     
      setImg(value);
    }
    return;
  }

  const uploadImage = async (value: any) => {
    const formData = new FormData();
    formData.append('file', value);
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/user/firebase/image`, 
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getFromLocalStorage('accessToken')}`,
      },
      body: formData, 
    })
    return res.json()
  }

  const onSubmit = async (data: FormData) => {
    if(img) {
      const tmp = await uploadImage(img);
      data.avatar = tmp.base64;
    }
    let isSuccess: boolean = true;
    try {
      await editUserInfo({
        newUserInfo: data,
        id: getFromLocalStorage('userId'),
      }).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to save product: ', err)
      toast({
        title: 'Có lỗi khi cập nhật thông tin',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if(isSuccess) {
        toast({
          title: 'Cập nhật thông tin thành công',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <Box
    as="aside"
    flex={1}
    mr={{ base: 0, md: 5 }}
    mb={{ base: 5, md: 0 }}
    bg="white"
    rounded="md"
    borderColor="#e9ebee"
    >
    <VStack spacing={3} py={5} borderColor="#e9ebee">
      <Avatar
        size="2xl"
        name="Tim Cook"
        src={user.avatar ? user.avatar : "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
      }
      >
        <AvatarBadge bg="#4164e3" boxSize="1em">
          <svg width="0.4em" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </AvatarBadge>
      </Avatar>
      <VStack spacing={1}>
        <Heading as="h3" fontSize="xl" color="#243156">
          {`${user?.lastName} ${user?.firstName}`}
        </Heading>
        {/* <Text color="brand.gray" fontSize="sm">
          CEO of Apple
        </Text> */}
      </VStack>
      <Button m={{ base: 2, md: 8 }} colorScheme="orange" onClick={onOpen}>
        Cập nhật thông tin
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{base: 'sm', md: 'md'}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật thông tin</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={Boolean(errors.firstName)}>
              <FormLabel>Tên</FormLabel>
              <Input type='text'  {...register('firstName', {
                required: 'Trường này không được bỏ trống',
              })}/>
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.lastName)}>
              <FormLabel>Họ</FormLabel>
              <Input type='text'  {...register('lastName', {
                required: 'Trường này không được bỏ trống',
              })}/>
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel>Số điện thoại</FormLabel>
              <Input type='text'  {...register('phoneNumber', {
                required: 'Trường này không được bỏ trống',
              })}/>
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.dateOfBirth)}>
              <FormLabel>Ngày sinh</FormLabel>
              <Input type='date'  {...register('dateOfBirth')}/>
              <FormErrorMessage>
                {errors.dateOfBirth && errors.dateOfBirth.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.avatar}>
              <FormLabel>Ảnh đại diện</FormLabel>
              <input type='file' accept="image/png" onChange={validateFiles}></input>
              <FormErrorMessage>
                {errors.avatar && errors?.avatar.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Huỷ 
            </Button>
            <Button colorScheme="orange" onClick={handleSubmit(onSubmit)}>
              Lưu
            </Button>
            
          </ModalFooter>
          </ModalContent>
          </Modal>
    </VStack>
    </Box>
  )
}
