import { Card, Tabs, Space, Typography } from "antd";
import Me from "./pages/Me";
import ProjectDetails from "./pages/ProjectDetails";
import Demo from "./pages/Demo";

const { Title } = Typography;
function App() {
  return (
    <div
      style={{
        minHeight: '90vh',
        background: '#f5f5f7',
        display: 'flex',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      
      <Card
        style={{ width: 720, borderRadius: 16 }}
        styles={{ body: { padding: 32 } }}
      >
        <Space direction="vertical" size={4} style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Handwritten Digit Recognition
          </Title>
        </Space>
        <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Test",
            key: "1",
            children: <Demo />,
          },
          {
            label: "Project Details",
            key: "2",
            children: <ProjectDetails />,
          },
          // {
          //   label: "About Me",
          //   key: "3",
          //   children: <Me />,
          // },
        ]}
      />
         </Card>
      
    </div>
    // 
     
  
  );
}

export default App;
