import { 
    Card,
    CardHeader, 
    CardBody, 
    CardFooter,
    Heading,
    Stack,
    StackDivider,
    Box,
    Text, 
    Flex,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import { useMemo } from 'react';
import { useGetCustomersQuery } from '@/app/_lib/features/api/apiSlice';

function CustomerCard() {
    const {
        data: customers,
        isLoading,
        isSuccess,
        isError,
        error,
      } = useGetCustomersQuery()
    
      const getCustomers = useMemo (() => {
        if(isSuccess) return customers.data
      }, [customers])

    return (
        <>
        {isLoading ? (
            <Flex
            alignItems="center"
            justify="center"
            direction={{ base: "column", md: "row" }}
            >
              <Spinner size='lg' color='orange.500' />
            </Flex>
        ) : isError ? (
            <Flex
            alignItems="center"
            justify="center"
            direction={{ base: "column", md: "row" }}
            m={4}
            >
              <Alert w='25%' status='error'>
                <AlertIcon />
                Can not fetch data from server
              </Alert>
            </Flex>
          ) : (
            <Card mt={4}>
                {/* Làm nút xem thêm
                Chỉ hiển thị 5 khách gần nhất */}
                <CardHeader>
                    <Heading size='sm'>Khách hàng tiềm năng</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                    {getCustomers.map((customer: any) => (
                        <Box key={customer.id}>
                            <Heading size='xs' textTransform='uppercase'>
                                {customer.name}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {customer.address}
                            </Text>
                        </Box>
                    ))}
                    {/* <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Summary
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                        View a summary of all your clients over the last month.
                        </Text>
                    </Box>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Overview
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                        Check out the overview of your clients.
                        </Text>
                    </Box>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                        Analysis
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                        See a detailed analysis of all your business clients.
                        </Text>
                    </Box> */}
                    </Stack>
                </CardBody>
            </Card>
    )}
    </>
)}
export default CustomerCard;