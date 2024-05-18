import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Tạo styles cho document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    fontFamily: 'Roboto',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontFamily: 'Roboto',
  }
});

// Tạo component PDF
const MyDocument = ({ order }) => {
  const [Font, setFont] = useState(null);

  useEffect(() => {
    import('@react-pdf/renderer').then((rpdf) => {
      setFont(rpdf.Font);
      if (rpdf.Font) {
        rpdf.Font.register({
          family: 'Roboto',
          src: '/fonts/Roboto-Regular.ttf',
        });
      }
    });
  }, []);

  return (
    <Document title={`Order ${order.data.code}`}>
      <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{`Order ID: ${order.data.id}`}</Text>
        <Text>{`Order Code: ${order.data.code}`}</Text>
        <Text>{`Customer Name: ${order.data.userId}`}</Text>
        <Text>{`Order Status: ${order.data.orderStatus}`}</Text>
        <Text>{`Created By: ${order.data.createdBy}`}</Text>
        <Text>{`Created Date: ${order.data.createdDate}`}</Text>
        <Text>{`Last Updated By: ${order.data.lastUpdatedBy}`}</Text>
        <Text>{`Last Updated Date: ${order.data.lastUpdatedDate}`}</Text>
        <Text>{`Receiver Name: ${order.data.receiverDto.name}`}</Text>
        <Text>{`Receiver Phone Number: ${order.data.receiverDto.phoneNumber}`}</Text>
        <Text>{`Receiver Address: ${order.data.receiverDto.address}`}</Text>
        <Text>{`Receiver Detailed Address: ${order.data.receiverDto.detailedAddress}`}</Text>
        <Text>{`Receiver Note: ${order.data.receiverDto.note}`}</Text>
        <Text>{`Store Name: ${order.data.storeDto.name}`}</Text>
        <Text>{`Store Phone Number: ${order.data.storeDto.phoneNumber}`}</Text>
        <Text>{`Store Address: ${order.data.storeDto.address}`}</Text>
        <Text>{`Store Detailed Address: ${order.data.storeDto.detailedAddress}`}</Text>
        <Text>{`Store Description: ${order.data.storeDto.description}`}</Text>
        {order.data.orderItemDtos.map((item, index) => (
          <View key={index}>
            <Text>{`Item ${index + 1}: ${item.product.name}`}</Text>
            <Text>{`Quantity: ${item.quantity}`}</Text>
            <Text>{`Price: ${item.price}`}</Text>
          </View>
        ))}
      </View>
      </Page>
    </Document>
  );
};

const handlePrintPDF = (order) => {
  return (
    <PDFDownloadLink document={<MyDocument order={order} />} fileName="order.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
  );
};

export default MyDocument;