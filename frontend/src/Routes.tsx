import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/product/ProductList';
import ProductCreate from './components/product/ProductCreate';
import EntryList from './components/entry/EntryList';
import EntryCreate from './components/entry/EntryCreate';
import ExitList from './components/exit/ExitList';
import ExitCreate from './components/exit/ExitCreate';
import DashboardChart from './components/dashboard/DashboardChart';
import ReportGenerator from './components/report/ReportGenerator';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardChart />} />
      <Route path="/dashboard" element={<DashboardChart />} />
      <Route path="/report" element={<ReportGenerator />} />
      <Route path="/produtos/listagem" element={<ProductList />} />
      <Route path="/produtos/cadastro" element={<ProductCreate />} />
      <Route path="/produtos/editar/:id" element={<ProductCreate />} />
      <Route path="/entradas/listagem" element={<EntryList />} />
      <Route path="/entradas/cadastro" element={<EntryCreate />} />
      <Route path="/entradas/editar/:id" element={<EntryCreate />} />
      <Route path="/saidas/listagem" element={<ExitList />} />
      <Route path="/saidas/cadastro" element={<ExitCreate />} />
      <Route path="/saidas/editar/:id" element={<ExitCreate />} />
    </Routes>
  );
};

export default AppRoutes;
