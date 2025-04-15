async function updateProductDetail() {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    // Actualiza el objeto local (para sincronizar la UI mientras espera respuesta)
    product.stage = detailStage.value;
    product.score = parseInt(detailScore.value) || 0;
    product.notes = detailNotes.value;
    
    // Ejecuta la actualización en Supabase
    const { data, error } = await supabase
      .from('products')
      .update({
        stage: product.stage,
        score: product.score,
        notes: product.notes
      })
      .eq('id', selectedProductId);
    
    if (error) {
      console.error("Error actualizando el producto:", error);
      return;
    }
    
    render();
  }
  