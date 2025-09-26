import { View } from "@tarojs/components";
import { useRef } from "react";
import { Cell } from "@nutui/nutui-react-taro";
import CustomPicker from "../../components/custom-picker";

export default function Index() {
  const customPickerRef = useRef<any>(null);

  return (
    <View className="index">
      <View>
        <Cell
          title="可点击"
          clickable
          onClick={() => customPickerRef.current?.handleOpenPopup()}
        />
      </View>
      <CustomPicker
        ref={customPickerRef}
        onConfirm={(options) => console.log(options, "options")}
        minDate="2023-09-13"
        maxDate="2025-11-14"
        defaultDate="2025-10-14"
      />
    </View>
  );
}
