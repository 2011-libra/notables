export default function clearDoc (){
  if(confirm('⚠️ WARNING ⚠️ : Are you sure you want to DELETE this document?')){
    document.getElementById('contentEditable').innerHTML = '';
  }
}
