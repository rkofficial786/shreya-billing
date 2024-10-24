import { Form, DatePicker } from "antd";
import { FloatingLabelInputNumber, FloatingLabelInput } from "../../../component/input";

export const StockSection = () => (
  <div className="grid grid-cols-2 gap-6">
    <Form.Item name="openingQuantity" label="Opening Quantity">
      <FloatingLabelInputNumber
        className="w-full"
        min={0}
        placeholder="Enter opening quantity"
      />
    </Form.Item>

    <Form.Item name="atPrice" label="At Price">
      <FloatingLabelInputNumber
        className="w-full"
        min={0}
        prefix="₹"
        placeholder="Enter price"
      />
    </Form.Item>

    <Form.Item name="asOfDate" label="As Of Date">
      <DatePicker
        className="w-full py-3"
        format="DD/MM/YYYY"
        placeholder="Select date"
      />
    </Form.Item>

    <Form.Item name="minStockToMaintain" label="Min Stock To Maintain">
      <FloatingLabelInputNumber
        className="w-full"
        min={0}
        placeholder="Enter minimum stock level"
      />
    </Form.Item>

    <Form.Item name="location" label="Location">
      <FloatingLabelInput placeholder="Enter storage location" />
    </Form.Item>
  </div>
);