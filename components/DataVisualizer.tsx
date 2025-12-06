import React from 'react';
import { SimulationData } from '../types';

interface DataVisualizerProps {
  step: number;
  data: SimulationData;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ step, data }) => {
  // Step 0-1: Human Form (Buyer - Chinese Interface)
  // Step 2-3: EDI Code (Standard - ASCII/English)
  // Step 4: Human Form (Supplier - English Interface)
  
  const isEDIPhase = step === 2 || step === 3;
  const isSupplierSide = step >= 4;

  if (isEDIPhase) {
    return (
      <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-sm shadow-inner h-64 overflow-y-auto border border-slate-700">
        <div className="flex justify-between text-slate-500 text-xs mb-2 border-b border-slate-700 pb-1">
          <span>FORMAT: ANSI X12 (850 Purchase Order)</span>
          <span>ENCODING: ASCII (Standard)</span>
        </div>
        <p>ISA*00*          *00*          *ZZ*{data.buyerName.toUpperCase().padEnd(15)}*ZZ*{data.supplierName.toUpperCase().padEnd(15)}*231025*1200*U*00401*000000001*0*P*>~</p>
        <p>GS*PO*{data.buyerName.toUpperCase()}*{data.supplierName.toUpperCase()}*20231025*1200*1*X*004010~</p>
        <p className="bg-slate-800 animate-pulse">ST*850*0001~</p>
        <p>BEG*00*NE*{data.poNumber}**20231025~</p>
        <p>N1*BY*{data.buyerName}*92*12345~</p>
        <p>N1*SE*{data.supplierName}*92*67890~</p>
        <p className="bg-slate-800 animate-pulse">PO1*1*{data.quantity}*EA*{data.price.toFixed(2)}**VP*{data.itemName.toUpperCase()}~</p>
        <p>CTT*1~</p>
        <p>SE*8*0001~</p>
        <p>GE*1*1~</p>
        <p>IEA*1*000000001~</p>
      </div>
    );
  }

  // Supplier Side - English Interface (USA)
  if (isSupplierSide) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 h-64 overflow-y-auto transition-colors duration-500 border-orange-500">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="font-bold text-lg text-gray-800">
            Sales Order (Received)
          </h3>
          <span className="text-xs px-2 py-1 rounded text-white bg-orange-500">
            Supplier ERP (English/USA)
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-gray-400 text-xs uppercase tracking-wide">PO Number</span>
            <span className="font-medium text-gray-700">{data.poNumber}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-xs uppercase tracking-wide">Order Date</span>
            <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-US')}</span>
          </div>
          
          <div className="col-span-1">
            <span className="block text-gray-400 text-xs uppercase tracking-wide">Customer</span>
            <span className="font-medium text-gray-700">{data.buyerName}</span>
          </div>
          <div className="col-span-1">
            <span className="block text-gray-400 text-xs uppercase tracking-wide">Vendor</span>
            <span className="font-medium text-gray-700">{data.supplierName}</span>
          </div>

          <div className="col-span-2 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs border-b">
                  <th className="pb-1">Item Description</th>
                  <th className="pb-1 text-right">Qty</th>
                  <th className="pb-1 text-right">Unit Price</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 font-medium">{data.itemName}</td>
                  <td className="py-2 text-right">{data.quantity}</td>
                  <td className="py-2 text-right">${data.price.toFixed(2)}</td>
                  <td className="py-2 text-right font-bold text-gray-800">${(data.quantity * data.price).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Buyer Side - Chinese Interface (China)
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 h-64 overflow-y-auto transition-colors duration-500 border-blue-500">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold text-lg text-gray-800">
          采购订单 (Purchase Order)
        </h3>
        <span className="text-xs px-2 py-1 rounded text-white bg-blue-500">
          买方 ERP 系统 (中文/China)
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="block text-gray-400 text-xs uppercase tracking-wide">订单编号 (PO#)</span>
          <span className="font-medium text-gray-700">{data.poNumber}</span>
        </div>
        <div>
          <span className="block text-gray-400 text-xs uppercase tracking-wide">订单日期</span>
          <span className="font-medium text-gray-700">{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
        
        <div className="col-span-1">
          <span className="block text-gray-400 text-xs uppercase tracking-wide">买方 (Buyer)</span>
          <span className="font-medium text-gray-700">{data.buyerNameCN}</span>
        </div>
        <div className="col-span-1">
          <span className="block text-gray-400 text-xs uppercase tracking-wide">供应商 (Vendor)</span>
          <span className="font-medium text-gray-700">{data.supplierNameCN}</span>
        </div>

        <div className="col-span-2 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs border-b">
                <th className="pb-1">商品名称</th>
                <th className="pb-1 text-right">数量</th>
                <th className="pb-1 text-right">单价 (USD)</th>
                <th className="pb-1 text-right">总价</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 font-medium">{data.itemNameCN}</td>
                <td className="py-2 text-right">{data.quantity}</td>
                <td className="py-2 text-right">${data.price.toFixed(2)}</td>
                <td className="py-2 text-right font-bold text-gray-800">${(data.quantity * data.price).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};