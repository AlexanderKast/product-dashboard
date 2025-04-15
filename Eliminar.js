async function deleteProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error eliminando el producto:", error);
      return;
    }
    
    // Actualiza la lista local eliminando el producto
    products = products.filter(p => p.id !== id);
    if (selectedProductId === id) {
      selectedProductId = null;
      productDetail.classList.remove('visible');
    }
    render();
  }
  