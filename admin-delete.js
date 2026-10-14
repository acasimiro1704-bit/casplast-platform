function deleteModel(id){
  const m=db.models.find(x=>x.id===id);
  if(!m || !confirm(`¿Eliminar el modelo "${m.name}"? Esta acción no elimina los colores.`)) return;
  db.models=db.models.filter(x=>x.id!==id);
  if(state.model===id) state.model=activeModels()[0]?.id || null;
  save(); render();
}
const adminWithDelete = admin;
admin = function(){
  return adminWithDelete().replace(/<button class="tool" onclick="modelModal\('([^']+)'\)">Editar<\/button>/g, '<button class="tool" onclick="modelModal(\'$1\')">Editar</button> <button class="tool" onclick="deleteModel(\'$1\')">Eliminar</button>');
};
