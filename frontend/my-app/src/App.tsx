
import './App.css';
import Registration from './components/Registration';
import Login from './components/Login';


function App() {
return(
  <div className="App">
    <Registration />
     <div className='px-2'>
        <Login />
     </div>
  </div>
)
}
export default App;