import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Modal } from "antd";
import { company } from "../../../constants/constants";

// Register a standard font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  companySection: {
    marginBottom: 20,
    padding: 10,
    border: "1pt solid #999",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 20,
  },
  gridItem: {
    flex: 1,
    padding: 10,
    border: "1pt solid #999",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderBottom: "1pt solid #999",
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1pt solid #999",
    fontSize: 10,
  },
  col1: { width: "5%" },
  col2: { width: "30%" },
  col3: { width: "15%" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "15%", textAlign: "right" },
  col6: { width: "20%", textAlign: "right" },
  totalsSection: {
    width: "40%",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottom: "1pt solid #999",
  },
  footer: {
    marginTop: 30,
  },
  signature: {
    marginTop: 50,
    alignSelf: "flex-end",
    width: 200,
    textAlign: "center",
    borderTop: "1pt solid #000",
  },
  partyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  referenceNo: {
    fontSize: 12,
    marginBottom: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

const InvoicePDF = ({ invoice }) => {
  const { rawData } = invoice;
  const { refNumber, invoiceDate, party, total, items, status } = rawData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Tax Invoice</Text>

        {/* Company Details */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text>Phone: {company.phone}</Text>
        </View>

        {/* Bill To and Invoice Details Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.partyName}>
              {party?.name || "Demetrius Sykes"}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Invoice Details:</Text>
            <Text style={styles.referenceNo}>No: {refNumber}</Text>
            <Text>Date: {new Date(invoiceDate).toLocaleDateString()}</Text>
            <Text style={styles.status}>Status: {status}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Item name</Text>
            <Text style={styles.col3}>HSN/SAC</Text>
            <Text style={styles.col4}>Quantity</Text>
            <Text style={styles.col5}>Price/Unit</Text>
            <Text style={styles.col6}>Amount</Text>
          </View>
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.col1}>{index + 1}</Text>
              <Text style={styles.col2}>{item.name}</Text>
              <Text style={styles.col3}>{item.hsn || "NA"}</Text>
              <Text style={styles.col4}>{item.quantity}</Text>
              <Text style={styles.col5}>{item.pricePerUnit}</Text>
              <Text style={styles.col6}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Total:</Text>
            <Text>Rs.{total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Received:</Text>
            <Text>Rs.{invoice?.received?.toFixed(2) || "0.00"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Balance:</Text>
            <Text>
              Rs.{invoice?.balanceDue?.toFixed(2) || total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Terms and Signature */}
        <View style={styles.footer}>
          <Text style={styles.sectionTitle}>Terms & Conditions:</Text>
          <Text>Thanks for doing business with us!</Text>
          <Text style={styles.signature}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};
// Modal component to show PDF preview
const InvoicePreviewModal = ({ visible, invoice, onCancel }) => {
  console.log("hello");

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      className=""
      bodyStyle={{ height: "80vh" }}
    >
      <PDFViewer className="p-6" width="100%" height="100%">
        <InvoicePDF invoice={invoice} />
      </PDFViewer>
    </Modal>
  );
};

// Function to handle print/download
// export const handleInvoiceAction = (
//   record,
//   setPreviewVisible,
//   setSelectedInvoice
// ) => {
//   console.log(record, "record");

//   setSelectedInvoice(record);
//   setPreviewVisible(true);
// };

export default InvoicePreviewModal;
