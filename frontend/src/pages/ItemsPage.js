// frontend/src/pages/ItemsPage.js
import React from 'react';
import Layout from '../components/layout/Layout';
import ItemsList from '../components/items/ItemsList';

const ItemsPage = () => {
  return (
    <Layout>
      <ItemsList />
    </Layout>
  );
};

export default ItemsPage;