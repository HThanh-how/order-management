import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';


// Tạo styles cho document
const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    border: '1px solid #E4E4E4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E4E4E4',
    marginBottom: 10,
  },
  info: {
    fontSize: 10,
    marginBottom: 2,
  },
  barcode: {
    width: '100%',
    height: 'auto',
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  footer: {
    marginTop: 10,
    borderTop: '1px solid #E4E4E4',
    paddingTop: 10,
  }
});

// Tạo component PDF
const MyDocument = ({ order }) => {
  const [Font, setFont] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    QRCode.toDataURL(order.data.code)
      .then(url => {
        setQrCode(url);
      })
      .catch(err => {
        console.error(err);
      });
  }, [order]);
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
        <View style={styles.header}>
          <View>
            <Image src="logo.png" style={{ height: 50 }} />
            {/* <Text style={styles.boldText}>Shopee Xpress</Text> */}
          </View>
          <View>
            {/* <Image src={barcode} style={{ height: 50, width: 100 }} /> */}
            <Image src={qrCode} style={{ height: 50, width: 50 }} />

          </View>
          <Text style={styles.info}>Mã đơn hàng: {order.data.id}</Text>
            <Text style={styles.info}>Mã vận đơn {order.data.code}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Từ:</Text>
          <Text style={styles.info}>{order.data.storeDto.name}</Text>
          <Text style={styles.info}>{order.data.storeDto.address}</Text>
          <Text style={styles.info}>{order.data.storeDto.detailedAddress}</Text>
          <Text style={styles.info}>SĐT: {order.data.storeDto.phoneNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Đến:</Text>
          <Text style={styles.info}>{order.data.receiverDto.name}</Text>
          <Text style={styles.info}>{order.data.receiverDto.address}</Text>
          <Text style={styles.info}>{order.data.receiverDto.detailedAddress}</Text>
          <Text style={styles.info}>SĐT: {order.data.receiverDto.phoneNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Nội dung hàng:</Text>
          {order.data.orderItemDtos.map((item, index) => (
            <Text key={index} style={styles.info}>
              {item.quantity} x {item.product.name}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Tiền thu Người nhận:</Text>
          <Text style={styles.info}>{order.data.totalAmount} VND</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Ngày đặt hàng:</Text>
          <Text style={styles.info}>{order.data.createdDate}</Text>
        </View>

        <View style={styles.section}>
          <Image src="barcode-placeholder.png" style={styles.barcode} />
        </View>

        <View style={styles.section}>
          <Image src="qrcode-placeholder.png" style={styles.qrCode} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.info}>Chỉ dẫn giao hàng: {order.data.deliveryInstructions}</Text>
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
