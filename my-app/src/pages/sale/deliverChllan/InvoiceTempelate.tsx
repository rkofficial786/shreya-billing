import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Modal } from "antd";
import { company } from "../../../constants/constants";

// Register font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

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
  col2: { width: "25%" },
  col3: { width: "15%" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "20%", textAlign: "right" },
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
  address: {
    fontSize: 10,
    marginTop: 5,
  },
  gst: {
    fontSize: 10,
    marginTop: 5,
  },
  imageSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
    objectFit: "contain",
  },
});

const ChallanPDF = ({ challan }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Delivery Challan</Text>

        {/* Company Details */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text>Phone: {company.phone}</Text>
          <Text>State of Supply: {challan?.stateOfSupply}</Text>
        </View>

        {/* Party and Challan Details Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Party Details:</Text>
            <Text style={styles.partyName}>{challan?.party?.name}</Text>
            <Text style={styles.gst}>GSTIN: {challan?.party?.gstin}</Text>

            <Text style={styles.address}>Phone: {challan?.party?.phone}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.sectionTitle}>Challan Details:</Text>
            <Text style={styles.referenceNo}>
              Challan No: {challan?.challanNumber}
            </Text>
            <Text style={styles.referenceNo}>
              Challan Date: {formatDate(challan?.challanDate)}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Item</Text>
            <Text style={styles.col3}>Unit</Text>
            <Text style={styles.col4}>Qty</Text>
            <Text style={styles.col5}>Price/Unit</Text>
            <Text style={styles.col6}>Amount</Text>
          </View>
          {challan?.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.col1}>{index + 1}</Text>
              <Text style={styles.col2}>{item.name}</Text>
              <Text style={styles.col3}>{item.unit}</Text>
              <Text style={styles.col4}>{item.quantity}</Text>
              <Text style={styles.col5}>Rs.{item.pricePerUnit}</Text>
              <Text style={styles.col6}>Rs.{item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>
              Rs.{(challan?.total - challan?.items[0]?.taxAmount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>Rs.{challan?.items[0]?.taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Total:</Text>
            <Text>Rs.{challan?.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Terms and Signature */}
        <View style={styles.footer}>
          <Text style={styles.sectionTitle}>Terms & Conditions:</Text>
          <Text>1. This is a delivery challan and not a tax invoice.</Text>
          <Text>2. All items listed are for delivery purposes only.</Text>
          <Text>3. Please verify the items upon receipt.</Text>
          <Text style={styles.signature}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};

const ChallanPreviewModal = ({ visible, invoice, onCancel }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      bodyStyle={{ height: "80vh" }}
    >
      <PDFViewer width="100%" height="100%">
        <ChallanPDF challan={invoice} />
      </PDFViewer>
    </Modal>
  );
};

export default ChallanPreviewModal;
