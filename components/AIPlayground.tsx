import React, { useState } from 'react';
import { generateEDISample, explainEDI } from '../services/gemini';

export const AIPlayground: React.FC = () => {
  // Form State representing ERP fields
  const [formData, setFormData] = useState({
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    buyerName: '未来零售有限公司 (China)',
    supplierName: 'TechMfg Ltd. (USA)',
    itemName: '高保真无线蓝牙耳机',
    quantity: 100,
    price: 45.00,
    date: new Date().toISOString().split('T')[0]
  });

  const [ediOutput, setEdiOutput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const generateEDI = async () => {
    setLoading(true);
    setEdiOutput('');
    setExplanation('');
    setGenerated(false);

    try {
      // Construct a specific prompt based on form data
      const prompt = `
        Create a valid ANSI X12 850 Purchase Order based on this exact data:
        - Buyer: ${formData.buyerName}
        - Supplier: ${formData.supplierName}
        - PO Number: ${formData.poNumber}
        - Date: ${formData.date}
        - Item: ${formData.itemName}
        - Quantity: ${formData.quantity}
        - Price: ${formData.price}
        
        Ensure the segments (ISA, GS, ST, BEG, N1, PO1, CTT, SE, GE, IEA) are correct.
      `;

      const edi = await generateEDISample(prompt);
      setEdiOutput(edi);
      
      // Get explanation
      const exp = await explainEDI(edi);
      setExplanation(exp);
      setGenerated(true);
    } catch (e) {
      console.error(e);
      setExplanation("生成 EDI 失败，请检查网络连接。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ERP Header / Introduction */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          买方 ERP 系统模拟 (ERP Simulation)
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold text-blue-700">任务说明：</span> 
          您现在是 <span className="font-bold">中国采购经理</span>。请在下方 ERP 系统中录入采购订单信息。
          系统将自动调用 EDI 引擎，将您的业务数据转换为符合国际标准的 EDI 850 报文，发送给美国供应商。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input Form (The ERP Interface) */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-600 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">采购订单录入 (New Purchase Order)</h3>
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">System: SAP S/4HANA (Simulated)</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">订单编号 (PO Number)</label>
                <input 
                  type="text" 
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">订单日期 (Date)</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">采购方 (Buyer)</label>
                <input 
                  type="text" 
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">供应商 (Vendor)</label>
                <input 
                  type="text" 
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">行项目 (Line Items)</h4>
              <div className="space-y-3">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">商品名称 (Item Description)</label>
                    <input 
                      type="text" 
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">数量 (Quantity)</label>
                      <input 
                        type="number" 
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">单价 (Unit Price - USD)</label>
                      <input 
                        type="number" 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                 </div>
                 <div className="text-right pt-2 border-t border-gray-200 mt-2">
                    <span className="text-sm text-gray-500 mr-2">总金额 (Total):</span>
                    <span className="text-lg font-bold text-blue-800">${(formData.quantity * formData.price).toFixed(2)}</span>
                 </div>
              </div>
            </div>

            <button
              onClick={generateEDI}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow transition-all transform active:scale-95 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>正在处理订单并生成 EDI...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  提交订单并转换为 EDI (Submit & Convert)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output & Analysis */}
        <div className="space-y-6">
          
          {/* EDI Output Card */}
          <div className={`bg-slate-900 rounded-xl shadow-lg overflow-hidden transition-all duration-500 border border-slate-700 ${generated ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
              <span className="text-green-400 font-mono text-sm font-bold">EDI 输出 (ANSI X12 850)</span>
              {generated && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">Generated Successfully</span>}
            </div>
            <div className="p-4 overflow-x-auto min-h-[200px] max-h-[400px]">
              {ediOutput ? (
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
                  {ediOutput}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                  <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  <p className="text-sm">等待订单提交...</p>
                </div>
              )}
            </div>
          </div>

          {/* Explanation Card */}
          {generated && (
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-6 shadow-sm animate-fade-in-up">
               <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                 教授点评 (AI Analysis)
               </h4>
               <div className="prose prose-sm prose-purple max-w-none text-gray-700">
                 {explanation ? (
                    <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }} />
                 ) : (
                    <p className="italic text-gray-400">正在分析 EDI 结构...</p>
                 )}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
