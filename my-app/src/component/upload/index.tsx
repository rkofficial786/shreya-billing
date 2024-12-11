import { Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const FileUpload = ({ index, field, handleFieldChange }) => {
  const handleUploadChange = (info) => {
    const { file } = info;

    if (file.status === "done" || file.status === "uploading") {
      // Simulate successful upload
      handleFieldChange(index, "value", file.name); // Update the field value with the file name
      message.success(`${file.name} uploaded successfully.`);
    } else if (file.status === "error") {
      message.error(`Failed to upload ${file.name}.`);
    }
  };

  return (
    <div className="w-1/2">
      <Upload
        customRequest={({ onSuccess }) => {
          // Simulate an immediate success response
          setTimeout(() => onSuccess("ok"), 0);
        }}
        onChange={handleUploadChange}
        showUploadList={false} // Don't show the default file list
      >
        <Button
          icon={<UploadOutlined />}
          className="w-full flex items-center justify-center"
        >
          Upload File
        </Button>
      </Upload>
      {field.value && (
        <Text className="block mt-2 text-sm text-gray-600">
          Uploaded File: <strong>{field.value}</strong>
        </Text>
      )}
    </div>
  );
};

export default FileUpload;




// import { Upload, Button, Typography, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { Text } = Typography;

// const FileUpload = ({ index, field, handleFieldChange }) => {
//   const handleUploadChange = (info) => {
//     const { file } = info;

//     if (file.status === "done") {
//       // Assume the API returns the file name or URL in `file.response`
//       const uploadedFileName = file.response?.name || file.name; // Fallback to the local file name
//       handleFieldChange(index, "value", uploadedFileName); // Update the field value
//       message.success(`${file.name} uploaded successfully.`);
//     } else if (file.status === "error") {
//       const errorMsg =
//         file?.error?.message || `Failed to upload ${file.name}.`;
//       console.error("Upload Error:", errorMsg, file.error);
//       message.error(errorMsg);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isValidType =
//       file.type === "image/png" ||
//       file.type === "image/jpeg" ||
//       file.type === "application/pdf" ||
//       file.type === "application/msword" ||
//       file.type ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

//     if (!isValidType) {
//       message.error("You can only upload images or documents!");
//       return Upload.LIST_IGNORE; // Ignore unsupported files
//     }

//     return true;
//   };

//   return (
//     <div className="w-1/2">
//       <Upload
//         name="file"
//         action="/upload" // Replace with your upload API endpoint
//         onChange={handleUploadChange}
//         beforeUpload={beforeUpload}
//         showUploadList={false} // Don't show default Ant Design file list
//       >
//         <Button
//           icon={<UploadOutlined />}
//           className="w-full flex items-center justify-center"
//         >
//           Upload File
//         </Button>
//       </Upload>
//       {field.value && (
//         <Text className="block mt-2 text-sm text-gray-600">
//           Uploaded File: <strong>{field.value}</strong>
//         </Text>
//       )}
//     </div>
//   );
// };

// export default FileUpload;

