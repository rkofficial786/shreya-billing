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
  text: {
    fontSize: 10,
    marginTop: 5,
  },
});

// Utility function for date formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Component for company header section
const CompanyHeader = ({ company, stateOfSupply }) => (
  <View style={styles.companySection}>
    <Text style={styles.companyName}>{company.name}</Text>
    <Text style={styles.text}>Phone: {company.phone}</Text>
    <Text style={styles.text}>State of Supply: {stateOfSupply}</Text>
  </View>
);

// Component for party and challan details
const DetailsGrid = ({ party, challanNumber, challanDate }) => (
  <View style={styles.gridContainer}>
    <View style={styles.gridItem}>
      <Text style={styles.sectionTitle}>Party Details:</Text>
      <Text style={styles.partyName}>{party.name}</Text>
      <Text style={styles.text}>GSTIN: {party.gstin}</Text>
      <Text style={styles.text}>Phone: {party.phone}</Text>
    </View>
    <View style={styles.gridItem}>
      <Text style={styles.sectionTitle}>Challan Details:</Text>
      <Text style={styles.text}>Challan No: {challanNumber}</Text>
      <Text style={styles.text}>Challan Date: {formatDate(challanDate)}</Text>
    </View>
  </View>
);

// Component for items table
const ItemsTable = ({ items }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={styles.col1}>#</Text>
      <Text style={styles.col2}>Item</Text>
      <Text style={styles.col3}>Unit</Text>
      <Text style={styles.col4}>Qty</Text>
      <Text style={styles.col5}>Price/Unit</Text>
      <Text style={styles.col6}>Amount</Text>
    </View>
    {items.map((item, index) => (
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
);

// Component for totals section
const TotalsSection = ({ subtotal, tax, total }) => (
  <View style={styles.totalsSection}>
    <View style={styles.totalRow}>
      <Text>Subtotal:</Text>
      <Text>Rs.{subtotal.toFixed(2)}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text>Tax:</Text>
      <Text>Rs.{tax.toFixed(2)}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text>Total:</Text>
      <Text>Rs.{total.toFixed(2)}</Text>
    </View>
  </View>
);

// Component for terms and signature

const ChallanPDF = ({ challan }) => {
  const subtotal = challan.total - challan.items[0]?.taxAmount;
  const tax = challan.items[0]?.taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Sale return</Text>

        <CompanyHeader
          company={company}
          stateOfSupply={challan.stateOfSupply}
        />

        <DetailsGrid
          party={challan.party}
          challanNumber={challan.challanNumber}
          challanDate={challan.challanDate}
        />

        <ItemsTable items={challan.items} />

        <TotalsSection subtotal={subtotal} tax={tax} total={challan.total} />
      </Page>
    </Document>
  );
};

const InvoicePreviewModal = ({ visible, invoice, onCancel }) => {
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

export default InvoicePreviewModal;
