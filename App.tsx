import React, { useState, useEffect } from 'react';
import { SimulationStep } from './components/SimulationStep';
import { DataVisualizer } from './components/DataVisualizer';
import { AIPlayground } from './components/AIPlayground';
import { SimulationData } from './types';

// Icons
const IconBuyer = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const IconTranslator = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconNetwork = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const IconSupplier = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;
const IconForm = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;

function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'ai'>('learn');
  const [simulationStep, setSimulationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const simulationData: SimulationData = {
    buyerName: "RetailCo Inc.",
    buyerNameCN: "未来零售有限公司",
    supplierName: "TechMfg Ltd.",
    supplierNameCN: "高科制造集团",
    itemName: "Wireless Headset X1",
    itemNameCN: "高保真无线蓝牙耳机 X1",
    quantity: 500,
    price: 45.00,
    poNumber: "PO-2023-8891"
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && simulationStep < 4) {
      timer = setTimeout(() => {
        setSimulationStep(prev => prev + 1);
      }, 3500); // Slower steps to allow reading
    } else if (isPlaying && simulationStep === 4) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, simulationStep]);

  const resetSimulation = () => {
    setSimulationStep(0);
    setIsPlaying(false);
  };

  const steps = [
    { id: 0, title: "1. 采购录入", desc: "买方(中国)生成订单", icon: <IconForm /> },
    { id: 1, title: "2. 格式转换", desc: "翻译为 EDI 标准", icon: <IconTranslator /> },
    { id: 2, title: "3. 网络传输", desc: "跨国传输 (VAN/AS2)", icon: <IconNetwork /> },
    { id: 3, title: "4. 格式解析", desc: "解析为内部格式", icon: <IconTranslator /> },
    { id: 4, title: "5. 订单接收", desc: "卖方(美国)接收订单", icon: <IconSupplier /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">E</div>
              <span className="font-bold text-xl text-gray-900">EDI 供应链教学系统</span>
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('learn')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'learn' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                工作原理
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'ai' ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                实操练习 (ERP模拟)
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {activeTab === 'learn' ? (
            <div className="space-y-8">
              
              {/* Introduction Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">国际供应链中的 EDI (电子数据交换)</h1>
                <p className="text-gray-600 leading-relaxed">
                  本案例演示一个跨国采购场景：<span className="font-bold text-blue-700">中国买家</span>向<span className="font-bold text-orange-600">美国供应商</span>采购商品。
                  请注意观察 EDI 如何作为“通用语言”，让使用中文系统的买家与使用英文系统的卖家实现无缝的数据对接，消除语言和格式障碍。
                </p>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                    跨越语言障碍
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                    标准化格式
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800">
                    全球通用
                  </span>
                </div>
              </div>

              {/* Visualization Area */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">EDI 国际订单流模拟 - ANSI X12 850</h2>
                  <div className="space-x-2">
                    <button 
                      onClick={resetSimulation}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      重置
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={simulationStep >= 4}
                      className={`px-4 py-1 text-sm rounded text-white font-medium transition-colors ${simulationStep >= 4 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isPlaying ? '暂停' : simulationStep >= 4 ? '已完成' : '开始跨国传输'}
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Stepper */}
                  <div className="flex justify-between mb-12 relative">
                    {steps.map((step, index) => (
                      <SimulationStep
                        key={step.id}
                        isActive={simulationStep === index}
                        isCompleted={simulationStep > index}
                        stepNumber={index}
                        title={step.title}
                        description={step.desc}
                        icon={step.icon}
                      />
                    ))}
                  </div>

                  {/* Dynamic Data View */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Explanation */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 h-full">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{simulationStep + 1}</span>
                          当前状态
                        </h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                          {simulationStep === 0 && "买方（中国零售商）在中文 ERP 系统中创建了一个采购订单。注意：界面是全中文的，使用人民币或美元结算，方便本地员工操作。"}
                          {simulationStep === 1 && "EDI 翻译软件（Translation Software）提取关键数据（如数量、价格、SKU），将其“翻译”为国际通用的 ANSI X12 标准代码。"}
                          {simulationStep === 2 && "标准化的 EDI 报文（850 Purchase Order）通过安全网络跨越国界传输。在这个阶段，数据变成了机器可读的通用代码，消除了中文和英文的差异。"}
                          {simulationStep === 3 && "卖方（美国供应商）接收到报文。他们的系统自动识别标准代码，并将数据解析（Parse）映射到他们自己的数据库字段中。"}
                          {simulationStep === 4 && "订单成功进入卖方英文 ERP 系统（生成 Sales Order）！供应商看到的是英文界面和英文商品名。整个过程无需人工翻译或录入。"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Data Visualization */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">数据视图 (Data View)</h3>
                      <DataVisualizer step={simulationStep} data={simulationData} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <AIPlayground />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Supply Chain Management Course - EDI Demo System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
