async function addProduct() {
    const name = newProductInput.value.trim();
    if (name === "") return;
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, stage: "Descubrimiento", score: 0, notes: "" }])
      .single(); // .single() para recibir el objeto insertado
    
    if (error) {
      console.error("Error agregando el producto:", error);
      return;
    }
    
    // Agrega el nuevo producto al arreglo local y actualiza la vista.
    products.push(data);
    newProductInput.value = "";
    render();
  }
  