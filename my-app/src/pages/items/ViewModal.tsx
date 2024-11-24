import { Modal, Card, Descriptions, Divider } from 'antd';

const ItemDetailsModal = ({ visible, onCancel, selectedRecord }) => {
  return (
    <Modal
      title="Item Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      {selectedRecord && (
        <Card>
          <Descriptions title="General Information" bordered>
            <Descriptions.Item label="Name">{selectedRecord?.name}</Descriptions.Item>
            <Descriptions.Item label="HSN">{selectedRecord?.hsn}</Descriptions.Item>
            <Descriptions.Item label="Item Code">{selectedRecord?.itemCode}</Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedRecord?.category.length > 0
                ? selectedRecord?.category.map((cat) => cat.name).join(', ')
                : 'N/A'}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title="Pricing" bordered>
            <Descriptions.Item label="Purchase Price">
              {selectedRecord?.purchasePrice?.purchasePrice}
            </Descriptions.Item>
            <Descriptions.Item label="Purchase Tax Type">
              {selectedRecord?.purchasePrice?.taxType}
            </Descriptions.Item>
            <Descriptions.Item label="Sale Price">
              {selectedRecord?.salePrice?.salePrice}
            </Descriptions.Item>
            <Descriptions.Item label="Sale Tax Type">
              {selectedRecord?.salePrice?.taxType}
            </Descriptions.Item>
            <Descriptions.Item label="Discount Price">
              {selectedRecord?.salePrice?.discountPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Discount Type">
              {selectedRecord?.salePrice?.discountType}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title="Stock" bordered>
            <Descriptions.Item label="Base Unit">{selectedRecord?.unit?.baseUnit}</Descriptions.Item>
            <Descriptions.Item label="Opening Quantity">
              {selectedRecord?.stock?.openingQty}
            </Descriptions.Item>
            <Descriptions.Item label="At Price">{selectedRecord?.stock?.atPrice}</Descriptions.Item>
            <Descriptions.Item label="Stock Date">
              {new Date(selectedRecord?.stock?.date).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Minimum Stock">
              {selectedRecord?.stock?.minimumStock}
            </Descriptions.Item>
            <Descriptions.Item label="Location">{selectedRecord?.stock?.location}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title="Metadata" bordered>
            <Descriptions.Item label="Created At">
              {new Date(selectedRecord.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(selectedRecord.updatedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Taxes">{selectedRecord?.taxes}%</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Modal>
  );
};

export default ItemDetailsModal;