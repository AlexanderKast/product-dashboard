async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error cargando productos:", error);
      return;
    }
    
    // Asigna los datos recibidos a la variable de estado 'products'
    products = data;
    render();
  }
  