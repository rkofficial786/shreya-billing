import { Modal, Button, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FloatingLabelInput } from "../../../component/input";

interface UnitSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (unit: string) => void;
}

export const UnitSelectorModal = ({ visible, onClose, onSelect }: UnitSelectorModalProps) => {
  const units = ["Piece", "Kg", "Gram", "Meter", "Liter", "Box", "Dozen", "Pack", "Unit"];

  return (
    <Modal
      title="Select Unit"
      visible={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="select" type="primary" onClick={onClose}>Select</Button>
      ]}
    >
      <FloatingLabelInput
        prefix={<SearchOutlined className="text-gray-400" />}
        label="Search units"
        className="mb-4"
      />
      <div className="grid grid-cols-3 gap-4">
        {units.map((unit) => (
          <Card
            key={unit}
            size="small"
            className="cursor-pointer hover:border-blue-500"
            onClick={() => {
              onSelect(unit);
              onClose();
            }}
          >
            {unit}
          </Card>
        ))}
      </div>
    </Modal>
  );
};