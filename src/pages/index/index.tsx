import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { Button, Cell, Space } from "@nutui/nutui-react-taro";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <Text>Hello world!</Text>

      {/* NutUI 组件示例 */}
      <Space direction="vertical" style={{ margin: "20px" }}>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="warning">警告按钮</Button>
      </Space>
      
      <View style={{ margin: "20px" }}>
        <Cell title="单元格标题">描述文字</Cell>
        <Cell title="可点击" />
      </View>
    </View>
  );
}
