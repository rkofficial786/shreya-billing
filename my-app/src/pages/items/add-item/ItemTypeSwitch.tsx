import { Switch } from "antd";

interface ItemTypeSwitchProps {
  isProductType: boolean;
  onChange: (isProduct: boolean) => void;
}

export const ItemTypeSwitch = ({ isProductType, onChange }: ItemTypeSwitchProps) => (
  <div className="flex items-center gap-4 mb-6">
    <span className={`${isProductType ? "text-blue-500" : "text-gray-500"}`}>
      Product
    </span>
    <Switch
      checked={!isProductType}
      onChange={(checked) => onChange(!checked)}
      className="bg-gray-300"
    />
    <span className={`${!isProductType ? "text-blue-500" : "text-gray-500"}`}>
      Service
    </span>
  </div>
);