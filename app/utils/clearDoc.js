export default function clearDoc (){
  if(confirm('Are you sure you want to delete this document?')){
    document.getElementById('contentEditable').innerHTML = '';
  }
}
