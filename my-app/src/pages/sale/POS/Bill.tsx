import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Modal, Button, Alert } from "antd";

// Import the necessary fonts
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

Font.register({
  family: "Roboto-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  invoiceDetails: {
    fontSize: 12,
    marginTop: 4,
  },
  customerDetails: {
    marginTop: 20,
    fontSize: 12,
  },
  itemsTable: {
    marginTop: 20,
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableHeaderText: {
    width: "20%",
    textAlign: "left",
    fontFamily: "Roboto-Bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableCell: {
    width: "20%",
    textAlign: "left",
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    textAlign: "right",
  },
});

const BillPdf = ({ customer, items, total, visible, onClose }) => {
  const [error, setError] = useState(null);

  const handlePDFGeneration = () => {
    try {
      // PDF rendering logic
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      className="max-h-[80vh] w-fit"
      footer={null}
    >
      <PDFViewer className="" style={{ width: "100%", height: "80vh" }}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.companyName}>Acme Corporation</Text>
                <Text style={styles.invoiceDetails}>Invoice #123456</Text>
                <Text style={styles.invoiceDetails}>
                  Date: November 11, 2024
                </Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.invoiceDetails}>Acme Corporation</Text>
                <Text style={styles.invoiceDetails}>123 Main St.</Text>
                <Text style={styles.invoiceDetails}>Anytown, USA 12345</Text>
              </View>
            </View>

            <View style={styles.customerDetails}>
              <Text>Bill To:</Text>
              <Text>{customer.name}</Text>
              <Text>{customer.phone}</Text>
              <Text>{customer.email}</Text>
            </View>

            <View style={styles.itemsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Item</Text>
                <Text style={styles.tableHeaderText}>Qty</Text>
                <Text style={styles.tableHeaderText}>Price</Text>
                <Text style={styles.tableHeaderText}>Discount</Text>
                <Text style={styles.tableHeaderText}>Total</Text>
              </View>

              {items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>
                    Rs.{item.price.toFixed(2)}
                  </Text>
                  <Text style={styles.tableCell}>
                    Rs.{(item.discount || 0).toFixed(2)}
                  </Text>
                  <Text style={styles.tableCell}>
                    Rs.
                    {(
                      item.price * item.quantity -
                      (item.discount || 0)
                    ).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.total}>
              <Text>Total: Rs.{total}</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
      {error && (
        <Alert
          message="Error generating PDF"
          description={error.message}
          type="error"
          showIcon
        />
      )}
    </Modal>
  );
};

export default BillPdf;
