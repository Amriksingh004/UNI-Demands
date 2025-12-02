import './App.css';
import Navigation from './navigation/Navigation.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCartShopping, faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import 'toastr/build/toastr.css'
import 'toastr/toastr.js'
import 'sweetalert/dist/sweetalert.min.js'

library.add(faCartShopping, faPlus, faRotateLeft)


export const address = (param)=>{
  return `http://localhost:8080/${param}`
}
function App() {
  return (
    <div className="App">
      <Navigation/>
    </div>
  );
}

export default App;
